#!/usr/bin/env node
/**
 * SpecLoom installer — copies agents + skills to user-level Cursor/Codex dirs.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const PACKAGE_ROOT = path.join(REPO_ROOT, "package");

const MANAGED_SKILL_PREFIXES = ["specloom-", "code-", "test-"];
const MANAGED_CURSOR_SKILL_PREFIXES = ["specloom-"];

function usage() {
  console.log(`SpecLoom installer

Usage:
  node scripts/install.mjs [options]

Options:
  --cursor          Install Cursor agents + skills (~/.cursor/)
  --codex           Install Codex agents + shared skills (~/.codex/, ~/.agents/)
  --all             Install both Cursor and Codex (default)
  --bootstrap <dir> Scaffold docs/ tree in target repo after install
  --force           Overwrite existing files (backs up first)
  --dry-run         Print actions without writing
  -h, --help        Show this help

Examples:
  node scripts/install.mjs --all
  node scripts/install.mjs --cursor --bootstrap ./my-app
  ./install.sh --codex
`);
}

function parseArgs(argv) {
  const opts = {
    cursor: false,
    codex: false,
    all: false,
    bootstrap: null,
    force: false,
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") opts.help = true;
    else if (arg === "--cursor") opts.cursor = true;
    else if (arg === "--codex") opts.codex = true;
    else if (arg === "--all") opts.all = true;
    else if (arg === "--force") opts.force = true;
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--bootstrap") {
      const next = argv[++i];
      if (!next) throw new Error("--bootstrap requires a directory path");
      opts.bootstrap = path.resolve(next);
    } else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!opts.cursor && !opts.codex && !opts.all) opts.all = true;
  if (opts.all) {
    opts.cursor = true;
    opts.codex = true;
  }

  return opts;
}

function homeDir() {
  return os.homedir();
}

function codexSkillsPath() {
  return path.join(homeDir(), ".agents", "skills").replace(/\\/g, "/");
}

function walkFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function isManagedSkillName(name) {
  return MANAGED_SKILL_PREFIXES.some((p) => name.startsWith(p));
}

function isManagedCursorSkillName(name) {
  return MANAGED_CURSOR_SKILL_PREFIXES.some((p) => name.startsWith(p));
}

function backupPath(target) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${target}.specloom-backup-${stamp}`;
}

function copyTree({ source, target, filter, transform, force, dryRun, label }) {
  if (!fs.existsSync(source)) {
    console.warn(`[skip] ${label}: source missing — ${source}`);
    return { copied: 0, skipped: 0 };
  }

  let copied = 0;
  let skipped = 0;

  for (const file of walkFiles(source)) {
    const rel = path.relative(source, file);
    const base = rel.split(path.sep)[0];
    if (filter && !filter(base, rel, file)) {
      skipped++;
      continue;
    }

    const dest = path.join(target, rel);
    const action = `copy ${rel}`;

    if (dryRun) {
      console.log(`[dry-run] ${label}: ${action} -> ${dest}`);
      copied++;
      continue;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (fs.existsSync(dest) && !force) {
      console.log(`[skip] ${label}: exists (use --force) — ${dest}`);
      skipped++;
      continue;
    }

    if (fs.existsSync(dest) && force) {
      const bak = backupPath(dest);
      fs.renameSync(dest, bak);
      console.log(`[backup] ${bak}`);
    }

    const ext = path.extname(file).toLowerCase();
    const textExts = new Set([".md", ".txt", ".json", ".yaml", ".yml", ".toml", ".template"]);
    if (transform && (textExts.has(ext) || rel.includes(".template."))) {
      fs.writeFileSync(dest, transform(fs.readFileSync(file, "utf8")), "utf8");
    } else {
      fs.copyFileSync(file, dest);
    }

    console.log(`[ok] ${label}: ${action}`);
    copied++;
  }

  return { copied, skipped };
}

function installCursor({ force, dryRun }) {
  const cursorAgentsSrc = path.join(PACKAGE_ROOT, "cursor", "agents");
  const cursorSkillsSrc = path.join(PACKAGE_ROOT, "cursor", "skills");
  const cursorAgentsDest = path.join(homeDir(), ".cursor", "agents");
  const cursorSkillsDest = path.join(homeDir(), ".cursor", "skills");

  console.log("\n== Cursor ==");

  const agents = copyTree({
    source: cursorAgentsSrc,
    target: cursorAgentsDest,
    filter: (_base, rel) => path.basename(rel).startsWith("specloom-"),
    force,
    dryRun,
    label: "cursor/agents",
  });

  const skills = copyTree({
    source: cursorSkillsSrc,
    target: cursorSkillsDest,
    filter: (base) => isManagedCursorSkillName(base),
    force,
    dryRun,
    label: "cursor/skills",
  });

  return { agents, skills };
}

function rewriteCodexAgent(text) {
  const skillsHome = codexSkillsPath();
  return text
    .replace(/C:\/Users\/[^/]+\/\.agents\/skills/g, skillsHome)
    .replace(/C:\\Users\\[^\\]+\\.agents\\skills/g, skillsHome.replace(/\//g, "\\"))
    .replace(/~\/\.agents\/skills/g, skillsHome);
}

function installCodex({ force, dryRun }) {
  const codexAgentsSrc = path.join(PACKAGE_ROOT, "codex", "agents");
  const sharedSkillsSrc = path.join(PACKAGE_ROOT, "shared-skills");
  const codexAgentsDest = path.join(homeDir(), ".codex", "agents");
  const sharedSkillsDest = path.join(homeDir(), ".agents", "skills");

  console.log("\n== Codex ==");

  const agents = copyTree({
    source: codexAgentsSrc,
    target: codexAgentsDest,
    filter: (_base, rel) => path.basename(rel).startsWith("specloom-"),
    transform: rewriteCodexAgent,
    force,
    dryRun,
    label: "codex/agents",
  });

  const shared = copyTree({
    source: sharedSkillsSrc,
    target: sharedSkillsDest,
    filter: (base) => isManagedSkillName(base),
    force,
    dryRun,
    label: "shared-skills",
  });

  const specloomSkills = copyTree({
    source: path.join(PACKAGE_ROOT, "cursor", "skills"),
    target: sharedSkillsDest,
    filter: (base) => base.startsWith("specloom-"),
    force,
    dryRun,
    label: "specloom-skills→codex",
  });

  return { agents, skills: shared, specloomSkills };
}

function readTemplate(name) {
  return fs.readFileSync(path.join(PACKAGE_ROOT, "repo-templates", name), "utf8");
}

function writeIfMissing(file, content, { force, dryRun }) {
  if (fs.existsSync(file) && !force) {
    console.log(`[skip] bootstrap: exists — ${file}`);
    return false;
  }
  if (dryRun) {
    console.log(`[dry-run] bootstrap: write ${file}`);
    return true;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && force) {
    fs.renameSync(file, backupPath(file));
  }
  fs.writeFileSync(file, content, "utf8");
  console.log(`[ok] bootstrap: ${file}`);
  return true;
}

function copyTemplateDir(rel, destRoot, { force, dryRun }) {
  const src = path.join(PACKAGE_ROOT, "repo-templates", rel);
  if (!fs.existsSync(src)) return;
  copyTree({
    source: src,
    target: path.join(destRoot, rel === "automation" ? "docs/automation" : rel),
    filter: () => true,
    force,
    dryRun,
    label: `bootstrap/${rel}`,
  });
}

function bootstrapRepo(repoRoot, { force, dryRun }) {
  console.log(`\n== Bootstrap repo: ${repoRoot} ==`);

  if (!dryRun) fs.mkdirSync(repoRoot, { recursive: true });

  writeIfMissing(path.join(repoRoot, "AGENTS.md"), readTemplate("AGENTS.template.md"), { force, dryRun });
  writeIfMissing(path.join(repoRoot, "docs", "README.md"), readTemplate("docs-readme.template.md"), { force, dryRun });

  const dirs = [
    "docs/specs",
    "docs/specs/archived",
    "docs/specs/work-records",
    "docs/automation/loops",
    "docs/automation/state",
    "docs/automation/reports",
    "docs/images",
    "docs/images/assets",
    "docs/code",
    "docs/architecture",
    "docs/decisions",
    "docs/workflows",
    "docs/knowledge",
    "automation_inputs",
    "automation_outputs",
    "local_data",
  ];

  for (const dir of dirs) {
    const full = path.join(repoRoot, dir);
    if (dryRun) console.log(`[dry-run] bootstrap: mkdir ${full}`);
    else fs.mkdirSync(full, { recursive: true });
  }

  // Automation bundle
  const automationSrc = path.join(PACKAGE_ROOT, "repo-templates", "automation");
  if (fs.existsSync(automationSrc)) {
    copyTree({
      source: automationSrc,
      target: path.join(repoRoot, "docs", "automation"),
      filter: () => true,
      force,
      dryRun,
      label: "bootstrap/automation",
    });
  }

  // Work records templates
  const wrSrc = path.join(PACKAGE_ROOT, "repo-templates", "work-records");
  if (fs.existsSync(wrSrc)) {
    copyTree({
      source: wrSrc,
      target: path.join(repoRoot, "docs", "specs", "work-records"),
      filter: () => true,
      force,
      dryRun,
      label: "bootstrap/work-records",
    });
  }

  // GitHub planning config
  const planningTemplate = path.join(PACKAGE_ROOT, "repo-templates", "automation", "github-planning.template.json");
  const planningDest = path.join(repoRoot, "docs", "automation", "github-planning.json");
  if (fs.existsSync(planningTemplate)) {
    writeIfMissing(planningDest, fs.readFileSync(planningTemplate, "utf8"), { force, dryRun });
  }

  // Workflow stub
  writeIfMissing(
    path.join(repoRoot, "docs", "workflows", "daily-spec-automation.md"),
    readTemplate("daily-spec-automation.template.md"),
    { force, dryRun },
  );

  writeIfMissing(
    path.join(repoRoot, "docs", "workflows", "agent-orchestration.md"),
    `# Agent Orchestration\n\nUser entry: **specloom-work-creator** (planning) and **specloom-implement** (implementation).\n\nSee WORKFLOW.md in the specloom package and \`docs/workflows/\`.\n`,
    { force, dryRun },
  );

  // Architecture stubs
  const archStubs = {
    "system_overview.md": "# System Overview\n\n_Describe the system at a high level._\n",
    "repositories.md": "# Repositories\n\n_List repos and their roles._\n",
    "dependencies.md": "# Dependencies\n\n_Key runtime and dev dependencies._\n",
    "app_structure.md": "# App Structure\n\n_Folders, modules, and boundaries._\n",
  };
  for (const [file, content] of Object.entries(archStubs)) {
    writeIfMissing(path.join(repoRoot, "docs", "architecture", file), content, { force, dryRun });
  }

  const decisionStubs = ["product.md", "architecture.md", "ux.md", "technical.md"];
  for (const file of decisionStubs) {
    writeIfMissing(
      path.join(repoRoot, "docs", "decisions", file),
      `# ${file.replace(".md", "")} decisions\n\n| Date | Decision | Rationale |\n| --- | --- | --- |\n`,
      { force, dryRun },
    );
  }

  const knowledgeStubs = {
    "product_memory.md": "# Product Memory\n",
    "implementation_memory.md": "# Implementation Memory\n",
    "pitfalls.md": "# Pitfalls\n",
  };
  for (const [file, content] of Object.entries(knowledgeStubs)) {
    writeIfMissing(path.join(repoRoot, "docs", "knowledge", file), content, { force, dryRun });
  }

  // .gitignore entries
  const gitignorePath = path.join(repoRoot, ".gitignore");
  const gitignoreBlock = [
    "",
    "# SpecLoom local boundaries",
    "automation_inputs/",
    "automation_outputs/",
    "local_data/",
    "docs/images/private/",
    "",
  ].join("\n");

  if (!fs.existsSync(gitignorePath)) {
    writeIfMissing(gitignorePath, gitignoreBlock.trimStart(), { force, dryRun });
  } else if (!dryRun) {
    const existing = fs.readFileSync(gitignorePath, "utf8");
    if (!existing.includes("automation_inputs/")) {
      fs.appendFileSync(gitignorePath, gitignoreBlock, "utf8");
      console.log(`[ok] bootstrap: appended SpecLoom entries to .gitignore`);
    }
  }

  console.log("\nBootstrap complete. Next steps:");
  console.log("  1. Edit AGENTS.md with your build/test commands");
  console.log("  2. Edit docs/automation/github-planning.json with your GitHub repo");
  console.log("  3. Create remote branch ai-workflow");
  console.log("  4. Run: gh auth login");
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    usage();
    return;
  }

  console.log("SpecLoom installer");
  console.log(`Package: ${PACKAGE_ROOT}`);
  console.log(`Home:    ${homeDir()}`);

  if (opts.cursor) installCursor(opts);
  if (opts.codex) installCodex(opts);
  if (opts.bootstrap) bootstrapRepo(opts.bootstrap, opts);

  console.log("\nDone.");
  if (opts.cursor) console.log("Cursor entry: specloom-work-creator, specloom-implement");
  if (opts.codex) console.log("Codex entry:  specloom-work-creator, specloom-implement");
}

try {
  main();
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

#!/usr/bin/env node
/**
 * SpecLoom installer — copies agents + skills to Cursor, Codex, Claude Code, and Google Antigravity dirs.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const PACKAGE_ROOT = path.join(REPO_ROOT, "package");

const MANAGED_SKILL_PREFIXES = ["specloom-", "document-", "code-", "test-"];
const MANAGED_CURSOR_SKILL_PREFIXES = ["specloom-", "document-"];

function usage() {
  console.log(`SpecLoom installer

Usage:
  node scripts/install.mjs [options]

Options:
  --v1              Use package/v1 (legacy docs/ features+specs) [default]
  --v2              Use package/v2 (Linear Overview→Phase→Brief)
  --v3              Use package/v3 (v2 + findings contract, per-gate budgets)
  --v4              Use package/v4 (no orchestrator; run-set Workflow script; 2 gates; CI security)
  --verify          Check every skill reference resolves, then exit
  --clean           Remove ALL managed specloom/document/code/test agents and skills
                    from the targets first (backed up). Use when switching versions.
  --cursor          Install Cursor agents + skills (~/.cursor/)
  --codex           Install Codex agents + shared skills (~/.codex/, ~/.agents/)
  --claude          Install Claude Code agents + skills (~/.claude/)
  --antigravity     Install Antigravity skills + global workflows (~/.gemini/)
  --all             Install Cursor, Codex, Claude Code, and Antigravity (default)
  --bootstrap <dir> Scaffold target repo after install (v1=docs tree; v2=minimal note)
  --force           Overwrite existing files (backs up first)
  --dry-run         Print actions without writing
  -h, --help        Show this help

Examples:
  node scripts/install.mjs --v1 --all
  node scripts/install.mjs --v2 --cursor --force
  node scripts/install.mjs --v2 --claude --force
  node scripts/install.mjs --v2 --cursor --claude --force
  node scripts/install.mjs --v2 --cursor --bootstrap ./my-app
`);
}

function parseArgs(argv) {
  const opts = {
    version: "v3",
    cursor: false,
    codex: false,
    claude: false,
    antigravity: false,
    all: false,
    bootstrap: null,
    force: false,
    dryRun: false,
    verify: false,
    clean: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") opts.help = true;
    else if (arg === "--v1") opts.version = "v1";
    else if (arg === "--v2") opts.version = "v2";
    else if (arg === "--v3") opts.version = "v3";
    else if (arg === "--v4") opts.version = "v4";
    else if (arg === "--cursor") opts.cursor = true;
    else if (arg === "--codex") opts.codex = true;
    else if (arg === "--claude") opts.claude = true;
    else if (arg === "--antigravity") opts.antigravity = true;
    else if (arg === "--all") opts.all = true;
    else if (arg === "--force") opts.force = true;
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--verify") opts.verify = true;
    else if (arg === "--clean") opts.clean = true;
    else if (arg === "--bootstrap") {
      const next = argv[++i];
      if (!next) throw new Error("--bootstrap requires a directory path");
      opts.bootstrap = path.resolve(next);
    } else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!opts.cursor && !opts.codex && !opts.claude && !opts.antigravity && !opts.all) {
    opts.all = true;
  }
  if (opts.all) {
    opts.cursor = true;
    opts.codex = true;
    opts.claude = true;
    opts.antigravity = true;
  }

  return opts;
}

function versionPackageRoot(version) {
  const root = path.join(PACKAGE_ROOT, version);
  if (!fs.existsSync(root)) throw new Error(`Missing package version dir: ${root}`);
  return root;
}

function homeDir() {
  return os.homedir();
}

function codexSkillsPath() {
  return path.join(homeDir(), ".agents", "skills").replace(/\\/g, "/");
}

function antigravityGlobalSkillsDir() {
  return path.join(homeDir(), ".gemini", "config", "skills");
}

function antigravityGlobalAgentsDir() {
  return path.join(homeDir(), ".gemini", "config", "agents");
}

function antigravityGlobalWorkflowsDir() {
  return path.join(homeDir(), ".gemini", "antigravity", "global_workflows");
}

function claudeAgentsDir() {
  return path.join(homeDir(), ".claude", "agents");
}

function claudeSkillsDir() {
  return path.join(homeDir(), ".claude", "skills");
}

/** Claude Code: drop Cursor-only frontmatter keys that confuse skill loading. */
function rewriteClaudeSkill(content) {
  return content
    .replace(/^disable-model-invocation:\s*true\s*\n/m, "")
    .replace(/^disable-model-invocation:\s*false\s*\n/m, "");
}

/** Claude Code agents: map Cursor inherit → Claude default inherit-ish omit, keep body. */
function rewriteClaudeAgent(content) {
  return content.replace(/^model:\s*inherit\s*\n/m, "model: inherit\n");
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

function isManagedAgentFile(rel) {
  const name = path.basename(rel);
  return name === "specloom.md" || name.startsWith("specloom-");
}

/**
 * Backups and cleaned files go to REPO_ROOT/attic/<stamp>/, never next to live files.
 * The old scheme (*.specloom-backup-* / *.removed-* siblings) left litter that Claude Code
 * kept loading as skills — dozens of dead entries taxing every session's context.
 */
function atticDir(stamp) {
  const dir = path.join(REPO_ROOT, "attic", stamp);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** rename, falling back to copy+delete when source and attic sit on different drives. */
function safeMove(src, dest) {
  try {
    fs.renameSync(src, dest);
  } catch (err) {
    if (err.code !== "EXDEV") throw err;
    fs.cpSync(src, dest, { recursive: true });
    fs.rmSync(src, { recursive: true, force: true });
  }
}

function moveToAttic(target, stamp) {
  const dest = path.join(atticDir(stamp), `${path.basename(path.dirname(target))}__${path.basename(target)}`);
  safeMove(target, dest);
  return dest;
}

function backupPath(target) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return path.join(atticDir(stamp), `${path.basename(path.dirname(target))}__${path.basename(target)}`);
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
      safeMove(dest, bak);
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

function installCursor({ force, dryRun, pkgRoot }) {
  const cursorAgentsSrc = path.join(pkgRoot, "cursor", "agents");
  const cursorSkillsSrc = path.join(pkgRoot, "cursor", "skills");
  const cursorAgentsDest = path.join(homeDir(), ".cursor", "agents");
  const cursorSkillsDest = path.join(homeDir(), ".cursor", "skills");

  console.log("\n== Cursor ==");

  const agents = copyTree({
    source: cursorAgentsSrc,
    target: cursorAgentsDest,
    filter: (_base, rel) => isManagedAgentFile(rel),
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

  const sharedSkillsSrc = path.join(pkgRoot, "shared-skills");
  let shared = { copied: 0, skipped: 0 };
  if (fs.existsSync(sharedSkillsSrc)) {
    shared = copyTree({
      source: sharedSkillsSrc,
      target: cursorSkillsDest,
      filter: (base) => isManagedSkillName(base),
      force,
      dryRun,
      label: "shared-skills→cursor",
    });
  } else {
    console.log("[skip] shared-skills (not in this version)");
  }

  return { agents, skills, shared };
}

function rewriteCodexAgent(text) {
  const skillsHome = codexSkillsPath();
  return text
    .replace(/C:\/Users\/[^/]+\/\.agents\/skills/g, skillsHome)
    .replace(/C:\\Users\\[^\\]+\\.agents\\skills/g, skillsHome.replace(/\//g, "\\"))
    .replace(/~\/\.agents\/skills/g, skillsHome);
}

function installCodex({ force, dryRun, pkgRoot, version }) {
  const codexAgentsSrc = path.join(pkgRoot, "codex", "agents");
  const cursorAgentsSrc = path.join(pkgRoot, "cursor", "agents");
  const sharedSkillsSrc = path.join(pkgRoot, "shared-skills");
  const codexAgentsDest = path.join(homeDir(), ".codex", "agents");
  const sharedSkillsDest = path.join(homeDir(), ".agents", "skills");

  console.log("\n== Codex ==");

  if (!fs.existsSync(codexAgentsSrc)) {
    console.error(`[refused] Codex: ${path.basename(pkgRoot)} has no codex/agents/.`);
    console.error(`          Cursor agents are markdown; Codex loads .toml. Copying them would`);
    console.error(`          write files Codex silently ignores. Use --cursor or --claude.`);
    return { agents: { copied: 0, skipped: 0 }, skills: { copied: 0, skipped: 0 }, refused: true };
  }
  const agentsSrc = codexAgentsSrc;
  const agents = copyTree({
    source: agentsSrc,
    target: codexAgentsDest,
    filter: (_base, rel) => isManagedAgentFile(rel),
    transform: version === "v1" ? rewriteCodexAgent : undefined,
    force,
    dryRun,
    label: fs.existsSync(codexAgentsSrc) ? "codex/agents" : "cursor/agents→codex",
  });

  let shared = { copied: 0, skipped: 0 };
  if (fs.existsSync(sharedSkillsSrc)) {
    shared = copyTree({
      source: sharedSkillsSrc,
      target: sharedSkillsDest,
      filter: (base) => isManagedSkillName(base),
      force,
      dryRun,
      label: "shared-skills",
    });
  } else {
    console.log("[skip] shared-skills (not in this version)");
  }

  const specloomSkills = copyTree({
    source: path.join(pkgRoot, "cursor", "skills"),
    target: sharedSkillsDest,
    filter: (base) => isManagedCursorSkillName(base),
    force,
    dryRun,
    label: "specloom-skills→codex",
  });

  return { agents, skills: shared, specloomSkills };
}

function installClaude({ force, dryRun, pkgRoot }) {
  const cursorAgentsSrc = path.join(pkgRoot, "cursor", "agents");
  const cursorSkillsSrc = path.join(pkgRoot, "cursor", "skills");
  const sharedSkillsSrc = path.join(pkgRoot, "shared-skills");
  const agentsDest = claudeAgentsDir();
  const skillsDest = claudeSkillsDir();

  console.log("\n== Claude Code ==");
  console.log(`  agents → ${agentsDest}`);
  console.log(`  skills → ${skillsDest}`);

  const agents = copyTree({
    source: cursorAgentsSrc,
    target: agentsDest,
    filter: (_base, rel) => isManagedAgentFile(rel),
    transform: rewriteClaudeAgent,
    force,
    dryRun,
    label: "claude/agents",
  });

  const skills = copyTree({
    source: cursorSkillsSrc,
    target: skillsDest,
    filter: (base) => isManagedCursorSkillName(base),
    transform: rewriteClaudeSkill,
    force,
    dryRun,
    label: "claude/skills (specloom+document)",
  });

  let shared = { copied: 0, skipped: 0 };
  if (fs.existsSync(sharedSkillsSrc)) {
    shared = copyTree({
      source: sharedSkillsSrc,
      target: skillsDest,
      filter: (base) => isManagedSkillName(base),
      transform: rewriteClaudeSkill,
      force,
      dryRun,
      label: "claude/skills (code/test)",
    });
  } else {
    console.log("[skip] shared-skills (not in this version)");
  }

  // v4+: deterministic Workflow scripts (e.g. specloom-run-set) → ~/.claude/workflows
  const workflowsSrc = path.join(pkgRoot, "claude", "workflows");
  let workflows = { copied: 0, skipped: 0 };
  if (fs.existsSync(workflowsSrc)) {
    workflows = copyTree({
      source: workflowsSrc,
      target: path.join(homeDir(), ".claude", "workflows"),
      filter: () => true,
      force,
      dryRun,
      label: "claude/workflows",
    });
  }

  return { agents, skills, shared, workflows };
}

function installAntigravity({ force, dryRun, pkgRoot }) {
  const cursorAgentsSrc = path.join(pkgRoot, "cursor", "agents");
  const cursorSkillsSrc = path.join(pkgRoot, "cursor", "skills");
  const sharedSkillsSrc = path.join(pkgRoot, "shared-skills");
  const workflowsSrc = path.join(pkgRoot, "antigravity", "workflows");
  const agentsDest = antigravityGlobalAgentsDir();
  const skillsDest = antigravityGlobalSkillsDir();
  const workflowsDest = antigravityGlobalWorkflowsDir();

  console.log("\n== Google Antigravity ==");

  const specloomAgents = copyTree({
    source: cursorAgentsSrc,
    target: agentsDest,
    filter: (_base, rel) => isManagedAgentFile(rel),
    force,
    dryRun,
    label: "antigravity/agents",
  });

  const specloomSkills = copyTree({
    source: cursorSkillsSrc,
    target: skillsDest,
    filter: (base) => isManagedCursorSkillName(base),
    force,
    dryRun,
    label: "antigravity/skills (specloom)",
  });

  let sharedSkills = { copied: 0, skipped: 0 };
  if (fs.existsSync(sharedSkillsSrc)) {
    sharedSkills = copyTree({
      source: sharedSkillsSrc,
      target: skillsDest,
      filter: (base) => isManagedSkillName(base),
      force,
      dryRun,
      label: "antigravity/skills (code/test)",
    });
  } else {
    console.log("[skip] shared-skills (not in this version)");
  }

  let workflows = { copied: 0, skipped: 0 };
  if (fs.existsSync(workflowsSrc)) {
    workflows = copyTree({
      source: workflowsSrc,
      target: workflowsDest,
      filter: () => true,
      force,
      dryRun,
      label: "antigravity/global_workflows",
    });
  } else {
    console.log("[skip] antigravity/workflows (not in this version)");
  }

  return { specloomAgents, specloomSkills, sharedSkills, workflows };
}

function readTemplate(pkgRoot, name) {
  return fs.readFileSync(path.join(pkgRoot, "repo-templates", name), "utf8");
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
    safeMove(file, backupPath(file));
  }
  fs.writeFileSync(file, content, "utf8");
  console.log(`[ok] bootstrap: ${file}`);
  return true;
}

function copyTemplateDir(pkgRoot, rel, destRoot, { force, dryRun }) {
  const src = path.join(pkgRoot, "repo-templates", rel);
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

function bootstrapRepoV2(repoRoot, { force, dryRun }) {
  console.log(`\n== Bootstrap repo (v2): ${repoRoot} ==`);
  if (!dryRun) fs.mkdirSync(repoRoot, { recursive: true });
  const note = `# SpecLoom v2

Planning: Linear (Overview → Phase → Brief).
Standards: external specloom-standards (pinned ref).
Docs: separate \`<app>-docs\` repo (\`architecture\` / \`system\` / \`workflow\` / \`specs\`) — \`@specloom-document\`.
App: code + tests + CI + runtime assets only.

Peers: \`@specloom\` (orchestrator) · \`@specloom-document\`
Internals: project-manager · loop · implementation · security · tester · repository
App git: work branch → merge \`ai-workflow\` · Docs: \`main\`
Coverage gate: ≥ 0.99
`;
  writeIfMissing(path.join(repoRoot, "SPECLOOM.md"), note, { force, dryRun });
  console.log("\nBootstrap v2 complete. Wire Linear MCP + standards clone for automations.");
}

function bootstrapRepoV1(repoRoot, { force, dryRun, pkgRoot }) {
  console.log(`\n== Bootstrap repo: ${repoRoot} ==`);

  if (!dryRun) fs.mkdirSync(repoRoot, { recursive: true });

  writeIfMissing(path.join(repoRoot, "AGENTS.md"), readTemplate(pkgRoot, "AGENTS.template.md"), { force, dryRun });
  writeIfMissing(path.join(repoRoot, "docs", "README.md"), readTemplate(pkgRoot, "docs-readme.template.md"), { force, dryRun });

  const dirs = [
    "docs/phases",
    "docs/phases/archived",
    "docs/phases/01-Prototype",
    "docs/phases/phase-template",
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
  const automationSrc = path.join(pkgRoot, "repo-templates", "automation");
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
  const wrSrc = path.join(pkgRoot, "repo-templates", "work-records");
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
  const planningTemplate = path.join(pkgRoot, "repo-templates", "automation", "github-planning.template.json");
  const planningDest = path.join(repoRoot, "docs", "automation", "github-planning.json");
  if (fs.existsSync(planningTemplate)) {
    writeIfMissing(planningDest, fs.readFileSync(planningTemplate, "utf8"), { force, dryRun });
  }

  // Workflow stub
  writeIfMissing(
    path.join(repoRoot, "docs", "workflows", "daily-spec-automation.md"),
    readTemplate(pkgRoot, "daily-spec-automation.template.md"),
    { force, dryRun },
  );

  writeIfMissing(
    path.join(repoRoot, "docs", "workflows", "agent-orchestration.md"),
    `# Agent Orchestration\n\n**Cursor:** \`@specloom-work-creator\`, \`@specloom-implement\`, \`@specloom-validator\`, \`@specloom-tester\`, \`@specloom-git\`\n\n**Antigravity:** \`/specloom-work-creator\`, \`/specloom-implement\`, \`/specloom-validator\`, \`/specloom-tester\`, \`/specloom-git\`\n\nSee WORKFLOW.md in the specloom package.\n`,
    { force, dryRun },
  );

  // Antigravity workspace workflows + rules
  const agyWorkflowsSrc = path.join(pkgRoot, "antigravity", "workflows");
  if (fs.existsSync(agyWorkflowsSrc)) {
    copyTree({
      source: agyWorkflowsSrc,
      target: path.join(repoRoot, ".agents", "workflows"),
      filter: () => true,
      force,
      dryRun,
      label: "bootstrap/.agents/workflows",
    });
  }

  const agyRulesSrc = path.join(pkgRoot, "antigravity", "rules");
  if (fs.existsSync(agyRulesSrc)) {
    copyTree({
      source: agyRulesSrc,
      target: path.join(repoRoot, ".agents", "rules"),
      filter: () => true,
      force,
      dryRun,
      label: "bootstrap/.agents/rules",
    });
  }

  // Code CORE stubs (project extensions — universal rules in code-* skills)
  const codeCoreTemplates = [
    ["csharp", "CORE.template.md", "CORE.md"],
    ["monogame", "CORE.template.md", "CORE.md"],
  ];
  for (const [subdir, templateName, destName] of codeCoreTemplates) {
    const templatePath = path.join(pkgRoot, "repo-templates", "code", subdir, templateName);
    if (fs.existsSync(templatePath)) {
      writeIfMissing(
        path.join(repoRoot, "docs", "code", subdir, destName),
        fs.readFileSync(templatePath, "utf8"),
        { force, dryRun },
      );
    }
  }

  // Phase stubs
  const phasesSrc = path.join(pkgRoot, "repo-templates", "phases");
  if (fs.existsSync(phasesSrc)) {
    copyTree({
      source: phasesSrc,
      target: path.join(repoRoot, "docs", "phases"),
      filter: () => true,
      force,
      dryRun,
      label: "bootstrap/phases",
    });
  }

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

function bootstrapRepo(repoRoot, { force, dryRun, pkgRoot, version }) {
  if (version === "v2") {
    bootstrapRepoV2(repoRoot, { force, dryRun });
    return;
  }
  bootstrapRepoV1(repoRoot, { force, dryRun, pkgRoot });
}


/** Every **specloom-x** / **document-x** reference must resolve to a live agent or skill. */
function verifyPackage(pkgRoot) {
  const agentsDir = path.join(pkgRoot, "cursor", "agents");
  const skillsDir = path.join(pkgRoot, "cursor", "skills");
  const sharedDir = path.join(pkgRoot, "shared-skills");
  const dirNames = (d) =>
    fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : [];

  const skills = new Set([...dirNames(skillsDir), ...dirNames(sharedDir)]);
  const agents = new Set(
    fs.existsSync(agentsDir) ? fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")) : []
  );

  // retired names, but NOT their hyphenated descendants (specloom-brief-plan is live)
  const RETIRED =
    /\b(specloom-(run|brief|planner|init|build|build-worker|build-check|test-loop|validate|validate-loop|sync|standardized-loop|worker-validation)(?![-\w])|sdd-[a-z-]+)/g;
  // real things that are not agents or skills
  const EXTERNAL = new Set(["specloom-standards"]);
  const problems = [];
  let stubs = 0, files = 0;

  for (const file of [...walkFiles(agentsDir), ...walkFiles(skillsDir)]) {
    if (!file.endsWith(".md")) continue;
    files++;
    const text = fs.readFileSync(file, "utf8");
    const rel = path.relative(pkgRoot, file);
    if (/Status:\s*STUB/.test(text)) { stubs++; problems.push(`${rel}: still a STUB`); }
    for (const m of text.matchAll(/\*\*((?:specloom|document|code|test)-[a-z0-9-]+)\*\*/g)) {
      if (!skills.has(m[1]) && !agents.has(m[1]) && !EXTERNAL.has(m[1])) problems.push(`${rel}: references ${m[1]} — not an agent or skill`);
    }
    for (const m of text.matchAll(RETIRED)) problems.push(`${rel}: names retired agent ${m[0]}`);
    // v3 also forbids self-reported token/cost fields — an agent cannot measure itself
    for (const m of text.matchAll(/\b(tokens_used|tokens_spent_by_agent|estimated_tokens|self_reported_cost)\b/g)) {
      const ln = text.slice(0, m.index).split("\n").length;
      const src = text.split("\n")[ln - 1] || "";
      if (!/\b(v1|v2|retired?s?|no longer|there is no|does not exist|do not exist|forbid|invented|never)\b/i.test(src))
        problems.push(`${rel}:${ln}: self-reported usage field ${m[1]} — use a receipt`);
    }
    // v3 retired every self-assigned score; prose *about* the retirement is allowed
    for (const m of text.matchAll(/\b(confidence_score|code_confidence|ux_confidence)\b/g)) {
      const line = text.slice(0, m.index).split("\n").length;
      const src = text.split("\n")[line - 1] || "";
      if (!/\b(v2|retired?s?|no longer|there is no|does not exist|do not exist|replaces?d?|is gone)\b/i.test(src))
        problems.push(`${rel}:${line}: uses retired score ${m[1]}`);
    }
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    if (fm && file.endsWith("SKILL.md")) {
      const name = (fm[1].match(/^name:\s*(\S+)/m) || [])[1];
      const dir = path.basename(path.dirname(file));
      if (name !== dir) problems.push(`${rel}: frontmatter name "${name}" != directory "${dir}"`);
    }
  }

  // orphans: a managed skill directory no agent declares. Catches stale skills left behind
  // when a version is edited in place — nothing references them, so nothing else notices.
  const declared = new Set();
  for (const f of walkFiles(agentsDir)) {
    if (!f.endsWith(".md")) continue;
    for (const m of fs.readFileSync(f, "utf8").matchAll(/\*\*((?:specloom|document|code|test)-[a-z0-9-]+)\*\*/g))
      declared.add(m[1]);
  }
  // a skill referenced by another skill counts as reachable too
  for (const f of walkFiles(skillsDir)) {
    if (!f.endsWith(".md")) continue;
    for (const m of fs.readFileSync(f, "utf8").matchAll(/\*\*((?:specloom|document|code|test)-[a-z0-9-]+)\*\*/g))
      declared.add(m[1]);
  }
  for (const name of dirNames(skillsDir)) {
    if (!declared.has(name)) problems.push(`cursor/skills/${name}/: orphan — no agent or skill references it`);
  }

  const uniq = [...new Set(problems)];
  if (!uniq.length) {
    console.log(`[verify] OK — ${agents.size} agents, ${skills.size} skills, ${files} files, 0 stubs, all references resolve.`);
    return 0;
  }
  console.error(`[verify] ${uniq.length} problem(s)${stubs ? ` (${stubs} stub)` : ""}:`);
  for (const p of uniq) console.error("  " + p);
  return 1;
}


/**
 * Remove every managed agent file and skill directory from a target pair.
 * Switching versions leaves orphans otherwise — v1 ships ~24 agents, v2 ships 8, v3 ships 8,
 * and the names barely overlap, so an un-cleaned upgrade leaves the old ones loaded and live.
 */
function cleanTarget({ label, agentsDir, skillsDir, dryRun }) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  let agents = 0, skills = 0, swept = 0;

  // Sweep litter from the old backup scheme first: *.removed-* / *.specloom-backup-* siblings
  // still register as skills and tax every session's context.
  const LITTER = /\.(removed|specloom-backup)-/;
  for (const dir of [agentsDir, skillsDir]) {
    if (!fs.existsSync(dir)) continue;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!LITTER.test(e.name)) continue;
      const full = path.join(dir, e.name);
      if (dryRun) console.log(`[dry-run] ${label}: sweep litter ${e.name}`);
      else { moveToAttic(full, stamp); console.log(`[sweep] ${label}: ${e.name}`); }
      swept++;
    }
  }

  if (fs.existsSync(agentsDir)) {
    for (const f of fs.readdirSync(agentsDir)) {
      if (!f.endsWith(".md")) continue;
      const base = f.replace(/\.md$/, "");
      if (!MANAGED_SKILL_PREFIXES.some((p) => base.startsWith(p)) && base !== "specloom") continue;
      const full = path.join(agentsDir, f);
      if (dryRun) console.log(`[dry-run] ${label}: remove agent ${f}`);
      else { moveToAttic(full, stamp); console.log(`[clean] ${label}: ${f}`); }
      agents++;
    }
  }

  if (fs.existsSync(skillsDir)) {
    for (const d of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      if (!MANAGED_SKILL_PREFIXES.some((p) => d.name.startsWith(p))) continue;
      const full = path.join(skillsDir, d.name);
      if (dryRun) console.log(`[dry-run] ${label}: remove skill ${d.name}/`);
      else { moveToAttic(full, stamp); console.log(`[clean] ${label}: ${d.name}/`); }
      skills++;
    }
  }

  console.log(`[clean] ${label}: ${agents} agent(s), ${skills} skill(s), ${swept} litter file(s)${dryRun ? " (dry run)" : ` → attic/${stamp}/`}`);
  return { agents, skills, swept };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    usage();
    return;
  }

  const verifyRoot = versionPackageRoot(opts.version);
  if (opts.verify) process.exit(verifyPackage(verifyRoot));
  if ((opts.version === "v3" || opts.version === "v4") && verifyPackage(verifyRoot) !== 0) {
    console.error("\nRefusing to install with unresolved references. Fix them or use --dry-run.");
    process.exit(1);
  }

  const pkgRoot = versionPackageRoot(opts.version);
  opts.pkgRoot = pkgRoot;

  console.log("SpecLoom installer");
  console.log(`Version: ${opts.version}`);
  console.log(`Package: ${pkgRoot}`);
  console.log(`Home:    ${homeDir()}`);

  if (opts.clean) {
    console.log("\n== Clean ==");
    if (opts.cursor)
      cleanTarget({ label: "cursor", agentsDir: path.join(homeDir(), ".cursor", "agents"),
                    skillsDir: path.join(homeDir(), ".cursor", "skills"), dryRun: opts.dryRun });
    if (opts.claude)
      cleanTarget({ label: "claude", agentsDir: claudeAgentsDir(), skillsDir: claudeSkillsDir(), dryRun: opts.dryRun });
    if (opts.codex)
      cleanTarget({ label: "codex", agentsDir: path.join(homeDir(), ".codex", "agents"),
                    skillsDir: path.join(homeDir(), ".agents", "skills"), dryRun: opts.dryRun });
    console.log("  Nothing is deleted — entries are moved to <repo>/attic/<timestamp>/.");
  }

  if (opts.cursor) installCursor(opts);
  const codexResult = opts.codex ? installCodex(opts) : null;
  if (opts.claude) installClaude(opts);
  let agyRefused = false;
  if (opts.antigravity) {
    const agySrc = path.join(versionPackageRoot(opts.version), "antigravity");
    if (!fs.existsSync(agySrc)) {
      console.error(`\n[refused] Antigravity: ${opts.version} has no antigravity/ (rules + workflows).`);
      console.error(`          Use --cursor or --claude.`);
      agyRefused = true;
    } else installAntigravity(opts);
  }
  if (opts.bootstrap) bootstrapRepo(opts.bootstrap, opts);

  console.log("\nDone.");
  const peers =
    opts.version === "v4"
      ? "specloom-document (docs); execution: main thread → specloom-project-manager → specloom-run-set workflow"
      : opts.version === "v3" || opts.version === "v2"
      ? "specloom, specloom-document"
      : "specloom-work-creator, specloom-implement, specloom-validator, specloom-tester, specloom-git";
  if (opts.cursor) console.log(`Cursor peers: @${peers.replace(/, /g, ", @")}`);
  if (opts.version === "v3") {
    console.log(`\nv3: findings replace confidence scores; attempts are per gate.`);
    console.log(`Contract: package/v3/cursor/skills/specloom-contract/SKILL.md`);
  }
  if (opts.version === "v4") {
    console.log(`\nv4: no orchestrator — talk to Claude Code directly. Control flow is the`);
    console.log(`specloom-run-set Workflow script (~/.claude/workflows). Two gates per Brief;`);
    console.log(`deep security runs in CI (.github/workflows/pr-check.yml).`);
    console.log(`Contract: package/v4/cursor/skills/specloom-contract/SKILL.md`);
  }
  if (opts.codex && codexResult && !codexResult.refused) console.log(`Codex peers:  ${peers}`);
  if (opts.claude) {
    console.log(`Claude Code:  ${peers} (agents in ~/.claude/agents, skills in ~/.claude/skills)`);
    if (opts.version === "v4")
      console.log(`  Entry: just talk to Claude Code — no @specloom; restart Claude Code to pick up changes`);
    else
      console.log(`  Entry: ask for specloom / @specloom — restart Claude Code if ~/.claude was new`);
  }
  if (opts.antigravity && !agyRefused) {
    console.log(`Antigravity:  /${peers.replace(/, /g, ", /")}`);
    console.log(`  agents:    ${antigravityGlobalAgentsDir()}`);
    console.log(`  skills:    ${antigravityGlobalSkillsDir()}`);
    console.log(`  workflows: ${antigravityGlobalWorkflowsDir()}`);
  }
}

try {
  main();
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

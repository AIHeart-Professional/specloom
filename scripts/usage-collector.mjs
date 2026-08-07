#!/usr/bin/env node
/**
 * SpecLoom usage collector.
 *
 * A minimal OTLP/HTTP JSON receiver for Claude Code telemetry. It exists because
 * a subagent CANNOT know its own token usage — the model has no API for it, so any
 * number an agent reports about itself is invented. The harness knows; the agent does not.
 *
 * Claude Code exports `claude_code.token.usage` with these attributes, which is exactly
 * the per-agent attribution SpecLoom needs:
 *   query_source : "main" | "subagent" | "auxiliary"
 *   agent.name   : the subagent's name
 *   skill.name   : the skill in play
 *   session.id   : scopes a report to one session
 *   type         : "input" | "output" | "cacheRead" | "cacheCreation"
 *   model        : model id
 *
 * Docs: https://code.claude.com/docs/en/monitoring-usage.md
 *
 * Usage:
 *   node scripts/usage-collector.mjs            # listen on :4318, append to .specloom/usage.jsonl
 *   node scripts/usage-collector.mjs --report   # print the per-agent table for the newest session
 *   node scripts/usage-collector.mjs --report --session <id>
 *   node scripts/usage-collector.mjs --report --json
 *
 * Then, before launching claude:
 *   export CLAUDE_CODE_ENABLE_TELEMETRY=1
 *   export OTEL_METRICS_EXPORTER=otlp
 *   export OTEL_EXPORTER_OTLP_PROTOCOL=http/json
 *   export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
 *   export OTEL_METRIC_EXPORT_INTERVAL=5000
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ARGS = process.argv.slice(2);
const has = (f) => ARGS.includes(f);
const val = (f, d) => { const i = ARGS.indexOf(f); return i >= 0 && ARGS[i + 1] ? ARGS[i + 1] : d; };

const OUT_DIR = path.resolve(val("--dir", ".specloom"));
const OUT = path.join(OUT_DIR, "usage.jsonl");
const PORT = Number(val("--port", "4318"));
const METRIC = "claude_code.token.usage";

/* ---------------- OTLP/JSON parsing ---------------- */

const attrValue = (v = {}) =>
  v.stringValue ?? v.intValue ?? v.doubleValue ?? v.boolValue ??
  (v.arrayValue ? (v.arrayValue.values || []).map(attrValue) : undefined);

const attrs = (list = []) =>
  Object.fromEntries(list.map((a) => [a.key, attrValue(a.value)]));

/** Pull every claude_code.token.usage data point out of an OTLP/JSON metrics payload. */
function extract(payload) {
  const rows = [];
  for (const rm of payload.resourceMetrics ?? []) {
    const res = attrs(rm.resource?.attributes);
    for (const sm of rm.scopeMetrics ?? []) {
      for (const m of sm.metrics ?? []) {
        if (m.name !== METRIC) continue;
        const points = m.sum?.dataPoints ?? m.gauge?.dataPoints ?? [];
        for (const dp of points) {
          const a = { ...res, ...attrs(dp.attributes) };
          const n = dp.asInt !== undefined ? Number(dp.asInt)
                  : dp.asDouble !== undefined ? Number(dp.asDouble) : 0;
          if (!n) continue;
          rows.push({
            ts: Number(dp.timeUnixNano ?? 0) / 1e6 || Date.now(),
            session: a["session.id"] ?? "unknown",
            source: a.query_source ?? "main",
            agent: a["agent.name"] ?? null,
            skill: a["skill.name"] ?? null,
            model: a.model ?? "unknown",
            type: a.type ?? "input",
            tokens: n,
          });
        }
      }
    }
  }
  return rows;
}

/* ---------------- report ---------------- */

const LABEL = (r) =>
  r.source === "subagent" ? (r.agent ?? "subagent (unnamed)")
  : r.source === "auxiliary" ? "auxiliary"
  : "@specloom (main)";

function report({ session, json }) {
  if (!fs.existsSync(OUT)) {
    console.error(`No usage recorded yet at ${OUT}.`);
    console.error(`Is the collector running, and was CLAUDE_CODE_ENABLE_TELEMETRY=1 set before claude launched?`);
    process.exit(1);
  }
  const rows = fs.readFileSync(OUT, "utf8").trim().split("\n")
    .filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);

  if (!rows.length) { console.error("Usage file is empty."); process.exit(1); }

  const target = session ?? rows[rows.length - 1].session;
  const scoped = rows.filter((r) => r.session === target);
  if (!scoped.length) { console.error(`No rows for session ${target}.`); process.exit(1); }

  const by = new Map();
  for (const r of scoped) {
    const k = LABEL(r);
    const e = by.get(k) ?? { input: 0, output: 0, cacheRead: 0, cacheCreation: 0, models: new Set() };
    e[r.type] = (e[r.type] ?? 0) + r.tokens;
    e.models.add(r.model);
    by.set(k, e);
  }

  const billable = (e) => e.input + e.output + e.cacheCreation;   // cacheRead is not new spend
  const entries = [...by.entries()].sort((a, b) => billable(b[1]) - billable(a[1]));
  const total = entries.reduce((s, [, e]) => s + billable(e), 0);

  if (json) {
    console.log(JSON.stringify({
      session: target,
      total_billable: total,
      agents: entries.map(([name, e]) => ({
        name, input: e.input, output: e.output,
        cache_read: e.cacheRead, cache_creation: e.cacheCreation,
        billable: billable(e), models: [...e.models],
      })),
    }, null, 2));
    return;
  }

  const num = (n) => n.toLocaleString("en-US");
  const w = Math.max(18, ...entries.map(([n]) => n.length));
  const pad = (s, n) => String(s).padEnd(n);
  const rpad = (s, n) => String(s).padStart(n);

  console.log(`\nToken usage — session ${target}\n`);
  console.log(`${pad("agent", w)}  ${rpad("input", 10)}  ${rpad("output", 9)}  ${rpad("cache rd", 10)}  ${rpad("billable", 10)}   share`);
  console.log("-".repeat(w + 58));
  for (const [name, e] of entries) {
    const b = billable(e);
    const pct = total ? ((b / total) * 100).toFixed(1) : "0.0";
    console.log(`${pad(name, w)}  ${rpad(num(e.input), 10)}  ${rpad(num(e.output), 9)}  ${rpad(num(e.cacheRead), 10)}  ${rpad(num(b), 10)}  ${rpad(pct + "%", 6)}`);
  }
  console.log("-".repeat(w + 58));
  console.log(`${pad("TOTAL", w)}  ${rpad("", 10)}  ${rpad("", 9)}  ${rpad("", 10)}  ${rpad(num(total), 10)}\n`);
  console.log(`billable = input + output + cacheCreation. cacheRead is shown but is not new spend.`);
  console.log(`source: claude_code.token.usage via OTLP — measured by the harness, not reported by the agents.\n`);
}

/* ---------------- serve ---------------- */

function serve() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let count = 0;

  const server = http.createServer((req, res) => {
    if (req.method !== "POST") { res.writeHead(405).end(); return; }
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      // Always 200 — a collector that errors makes Claude Code retry and noise up the session.
      res.writeHead(200, { "content-type": "application/json" }).end("{}");
      if (!req.url.includes("/v1/metrics")) return;
      let rows = [];
      try { rows = extract(JSON.parse(body)); }
      catch (e) {
        if (body.trim().startsWith("{")) console.error(`[warn] unparsed metrics payload: ${e.message}`);
        else console.error(`[warn] non-JSON payload — set OTEL_EXPORTER_OTLP_PROTOCOL=http/json`);
        return;
      }
      if (!rows.length) return;
      fs.appendFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
      count += rows.length;
      process.stdout.write(`\r[usage] ${count} data points → ${path.relative(process.cwd(), OUT)}   `);
    });
  });

  server.listen(PORT, "127.0.0.1", () => {
    console.log(`SpecLoom usage collector on http://localhost:${PORT}  →  ${OUT}`);
    console.log(`\nBefore launching claude, in the same shell:\n`);
    console.log(`  export CLAUDE_CODE_ENABLE_TELEMETRY=1`);
    console.log(`  export OTEL_METRICS_EXPORTER=otlp`);
    console.log(`  export OTEL_EXPORTER_OTLP_PROTOCOL=http/json`);
    console.log(`  export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:${PORT}`);
    console.log(`  export OTEL_METRIC_EXPORT_INTERVAL=5000\n`);
    console.log(`Report:  node scripts/usage-collector.mjs --report\n`);
  });
  server.on("error", (e) => {
    console.error(e.code === "EADDRINUSE" ? `Port ${PORT} is busy — pass --port <n>.` : e.message);
    process.exit(1);
  });
}

if (has("--report")) report({ session: val("--session", null), json: has("--json") });
else serve();

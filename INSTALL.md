# Installing SpecLoom v3

Windows / PowerShell. Adjust paths if your repo lives elsewhere.

---

## 0 · One-time cleanup

`specloom-linear-team` was replaced by `specloom-tracker-linear`. The old directory is still on
disk — it was written there before the rename and nothing has removed it. Left in place it
installs as a stale skill that treats Linear as the only tracker.

```powershell
Remove-Item -Recurse -Force "$HOME\Projects\sdd-loop\package\v3\cursor\skills\specloom-linear-team"
```

---

## 1 · Verify the package

```powershell
cd "$HOME\Projects\sdd-loop"
node scripts\install.mjs --v3 --verify
```

Expect:

```
[verify] OK — 8 agents, 54 skills, 61 files, 0 stubs, all references resolve.
```

If it reports problems, **stop and fix them** — the installer refuses to proceed on a broken
package anyway. The likely one is the orphan above if step 0 was skipped.

---

## 2 · Check your Claude Code version

```powershell
claude --version
```

| Version | Nesting |
|---------|---------|
| **2.1.219 or newer** | works as-is — 3 subagent layers by default |
| 2.1.217 – 2.1.218 | default is 1 layer; set `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=2` |
| older | 5 layers, fine |

SpecLoom needs two layers: `@specloom` → `loop` → the three workers.

```powershell
# only if you are on 2.1.217 or 2.1.218
[Environment]::SetEnvironmentVariable("CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH", "2", "User")
```

---

## 3 · Install

```powershell
node scripts\install.mjs --v3 --claude --clean --force
```

- `--clean` removes every SpecLoom agent and skill already in `~/.claude` — v1 and v2 names
  barely overlap with v3, so without it about twenty stale agents stay loaded and live
- Nothing is deleted. Entries are renamed `*.removed-<timestamp>` beside the originals
- Skills that are not SpecLoom's are left alone
- `--verify` runs first automatically and refuses to install on a broken package

Preview first if you want:

```powershell
node scripts\install.mjs --v3 --claude --clean --force --dry-run
```

### Confirm

```powershell
(Get-ChildItem "$HOME\.claude\agents\*.md" | Where-Object { $_.Name -notlike "*removed*" }).Count
(Get-ChildItem "$HOME\.claude\skills" -Directory | Where-Object { $_.Name -notlike "*removed*" }).Count
```

Expect **8** agents and **54** or more skills — more if you have skills of your own, which are
preserved.

---

## 4 · Restart Claude Code

Claude Code watches directories that existed when the session started. If `~/.claude/agents` or
`~/.claude/skills` is new, a running session will not see them.

Restart, then check:

```
/agents
```

`specloom` and `specloom-document` are the two you invoke. The other six are internal and refuse
handoffs that did not come from an orchestrator.

---

## 5 · Token usage (optional, but it is the point of the usage table)

Without this, `@specloom` reports usage as unavailable and shows work receipts instead. It will
not invent a number.

**Terminal 1** — leave running:

```powershell
cd "$HOME\Projects\sdd-loop"
node scripts\usage-collector.mjs
```

**Terminal 2** — set these *before* launching, in the same shell:

```powershell
$env:CLAUDE_CODE_ENABLE_TELEMETRY = "1"
$env:OTEL_METRICS_EXPORTER = "otlp"
$env:OTEL_EXPORTER_OTLP_PROTOCOL = "http/json"
$env:OTEL_EXPORTER_OTLP_ENDPOINT = "http://localhost:4318"
$env:OTEL_METRIC_EXPORT_INTERVAL = "5000"
claude
```

Telemetry variables are read at launch; whether Claude Code picks up mid-session changes is not
documented, so set them first.

To make them permanent instead:

```powershell
[Environment]::SetEnvironmentVariable("CLAUDE_CODE_ENABLE_TELEMETRY", "1", "User")
[Environment]::SetEnvironmentVariable("OTEL_METRICS_EXPORTER", "otlp", "User")
[Environment]::SetEnvironmentVariable("OTEL_EXPORTER_OTLP_PROTOCOL", "http/json", "User")
[Environment]::SetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4318", "User")
[Environment]::SetEnvironmentVariable("OTEL_METRIC_EXPORT_INTERVAL", "5000", "User")
```

Read the table any time:

```powershell
node scripts\usage-collector.mjs --report
```

The default export interval is 60 s, which is too slow for an end-of-turn table — hence 5000.

---

## 6 · Per-tracker prerequisites

Only the one you pick at bootstrap.

### `tracker: linear`

Linear MCP connected in Claude Code. Free plan caps at **250 issues / 2 teams** — if a product
will outgrow that, pick GitHub now, because changing later is a manual migration.

### `tracker: github`

```powershell
gh --version      # needs 2.94.0 or newer
gh auth status
```

2.94 is the release that added `--type`, `--parent`, `--blocked-by` and `--blocking`. Older `gh`
and the adapter stops rather than faking a hierarchy.

Issue types are configured at **organization** level. On a personal repo the adapter falls back
to labels — it works, but Projects hierarchy view groups by type, so you lose that view. The
adapter says which mode it used.

---

## 7 · First run

```
@specloom I want to start a new product
```

It will ask which tracker. That answer is recorded on the Overview and never asked again.

**Make the first Brief deliberately small** — one file, one acceptance criterion. Nothing in v3
has been executed end to end; the gate rules were written from the architecture, not from
watching them fail. A small first Brief tells you where it actually stops.

Most likely to need correction first:

| Area | Why |
|------|-----|
| GitHub adapter | its `gh` commands have never been run against a real repo |
| `coverage_floor` 0.90 | an estimate, not a measurement |
| attempts 3 / 2 / 3 | an estimate |
| `token_budget_per_brief` 250k | an estimate |

---

## Rolling back

`--clean` renames rather than deletes. To restore what was there before:

```powershell
Get-ChildItem "$HOME\.claude\agents" -Filter "*.removed-*" | ForEach-Object {
  Rename-Item $_.FullName ($_.Name -replace '\.removed-.*$', '')
}
```

Same shape for `~/.claude/skills`, where the entries are directories.

To clear old backups once you are happy:

```powershell
Get-ChildItem "$HOME\.claude\agents","$HOME\.claude\skills" -Filter "*.removed-*" | Remove-Item -Recurse -Force
```

---

## Cursor

Same package, different flag — and Cursor keeps `disable-model-invocation: true`, so skills load
only when an agent's instructions name them. Claude Code has that field stripped at install
(whether an explicitly named suppressed skill loads there is undocumented), so Claude Code sees
every skill description and may load more liberally. Same rules, slightly looser gating.

```powershell
node scripts\install.mjs --v3 --cursor --clean --force
```

Both at once is fine:

```powershell
node scripts\install.mjs --v3 --cursor --claude --clean --force
```

Codex and Antigravity are **refused** for v3 with a reason — `package/v3` has no TOML or
workflow variants, and v2 silently copied Cursor markdown into `~/.codex/agents`, where Codex
ignores it while reporting success.

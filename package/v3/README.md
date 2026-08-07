# SpecLoom v3

**Canonical contract:** [`WORKFLOW-V3.md`](./WORKFLOW-V3.md) — the single source. Everything else links to it.

**User entry:** `@specloom` (orchestrator) · `@specloom-document` (docs)

```
@specloom → PM / Discovery / Loop / Document / Repository → natural-language reply
Loop, per Brief: Implementation → Security → Tester
Repository: stacked PRs → merge_stack → ai-workflow
```

## What changed from v2

| v2 | v3 |
|----|----|
| `confidence` · `code_confidence` · `ux_confidence` all `≥ 0.99` | **findings** — a finding needs a `file` and a `source`, or it is dropped. Green = zero critical, zero major |
| `coverage ≥ 0.99` flat | `coverage_floor`, default 0.90, **ratcheting up** on every green Brief |
| `ux_confidence ≥ 0.99` | **per-criterion pass/fail** against a named Image File |
| `Retry ≤ 5` for the whole Brief | **per-gate budgets** (3/2/3, 6 total) so FAILED names the stuck gate |
| no spend limit | `token_budget_per_brief`, default 250,000 |
| no way to undo a merged stack | **`revert_stack`** |
| failed set left orphaned PRs | explicit cleanup: draft the failed PR, keep green ones blocked, trunk untouched |
| Linear down = total halt | deferred transitions in `.specloom/pending-linear.json` |
| `code-*` / `test-*` regenerated per run | **pinned** to `.specloom/skills/` and committed |
| generated UX refs regenerated freely | **frozen** once reviewed |
| agents listed skills with no load rule | every agent has a **when-to-load** table |
| no route from "what should we build" to a Brief | **`specloom-discovery`** — scans the goal and existing work, researches comparable tools, proposes with evidence and observables. No scores, proposes only, user accepts |
| Linear only | **`tracker: linear \| github`**, chosen once at bootstrap. GitHub uses sub-issues, issue types and native `--blocked-by` |
| 26 stub files | **0** |
| installer silently wrote Cursor markdown to `~/.codex/agents` | **refuses**, and `--verify` gates every install |

## Install

```bash
node scripts/install.mjs --v3 --verify     # check references, exit
node scripts/install.mjs --v3 --cursor     # install (verify runs first, refuses on break)
node scripts/install.mjs --v3 --claude --force
```

v3 ships Cursor and Claude Code. Codex and Antigravity are refused with a reason rather than
half-installed — v2 copied markdown into `~/.codex/agents/`, which Codex ignores, and reported
success.

## Layout

```
package/v3/
├── README.md
├── WORKFLOW-V3.md          canonical
├── cursor/agents/          9
├── cursor/skills/          52
└── shared-skills/          6   code-* / test-*
```

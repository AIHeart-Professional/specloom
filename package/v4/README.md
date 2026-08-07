# SpecLoom v4

**Canonical contract:** [`WORKFLOW-V4.md`](./WORKFLOW-V4.md) — the single source. Everything else links to it.

**User entry:** the Claude Code main thread (no orchestrator agent) · `@specloom-document` (docs)

```
you ⇄ Claude Code main thread
        → specloom-project-manager       plan, tracker, Task Spec + run_set
        → specloom-run-set workflow      deterministic script: per Brief,
             Implementation (code + secrets scan) → Tester → stacked PR
        → specloom-quality-gate          external check on the green stack (or any PR/branch):
                                         verify candidates → PASS, or blocking findings back
        → specloom-repository            merge_stack → ai-workflow
```

## What changed from v3

| v3 | v4 |
|----|----|
| `@specloom` orchestrator agent routed intent and formatted replies | **deleted** — the main thread already does both; one fewer cold context per interaction |
| Loop Controller agent counted attempts and budgets in prose | **`specloom-run-set` Workflow script** — gate order, attempt counters, token ceiling, repeat-finding stop and failure cleanup are deterministic JavaScript |
| hand-written JSON envelopes, hand-parsed | schema-validated agent results (`schema` on every gate call) |
| Security gate agent on every Brief | **secrets scan inside the Implementation gate** (cheap, always) + **`specloom-quality-gate`** — an external agent run at the merge boundary (or on any PR/branch) that must refute-or-confirm every candidate before it may block |
| three gates, 3/2/3 attempts, Brief total 6 | two gates, 3/3, Brief total 5 |
| every Brief pays the full pipeline | **fast path** — PM marks `size: small`; Implementation writes code + tests in one run, Tester skipped |
| reads restricted to files the Brief lists | **reads roam, writes stay scoped** — code that fits the codebase beats code that merely compiles |
| `receipt` blocks and a mandatory token table per reply | **gone** — neither ever changed a decision; harness telemetry measures real usage |
| installer backups littered `*.removed-*` / `*.specloom-backup-*` next to live skills | backups and cleaned files go to `<repo>/attic/<stamp>/`; `--clean` also sweeps old litter |

## Install

```bash
node scripts/install.mjs --v4 --verify              # check references, exit
node scripts/install.mjs --v4 --claude --cursor --clean --force
```

`--claude` also installs `claude/workflows/specloom-run-set.js` to `~/.claude/workflows/`.

## Quality gate

`specloom-quality-gate` is the external check: point it at a green run_set stack, a PR, or a
branch. It collects candidates (secrets, security read, standards, acceptance criteria), then
**verifies each one** — confirmed / plausible / refuted, with refuted findings reported in
`dismissed[]` so the triage is auditable. Blocking = confirmed critical/major, or plausible
critical. Everything else is advisory and does not stop a merge.

*(Parked: `.github/workflows/pr-check.yml` — a SonarQube+Claude CI variant. SonarQube PR
analysis needs paid editions, so it is inert unless an app repo opts in with the caller
template.)*

## Layout

```
package/v4/
├── README.md
├── WORKFLOW-V4.md              canonical
├── cursor/agents/              7   (pm, discovery, implementation, tester, repository, document, quality-gate)
├── cursor/skills/              45
├── claude/workflows/           1   specloom-run-set.js
├── repo-templates/             pr-check caller (parked)
└── shared-skills/              6   code-* / test-*
```

# SpecLoom v4 — canonical workflow

v4's thesis: **SpecLoom v3 was an organization; the work is a pipeline.** Keep the spec layer,
the gates and the discipline; delete the routing bureaucracy; move fixed control flow out of
prose and into a script; move whole-repo security out of the loop and into CI.

## Roles

| Piece | Kind | Job |
|-------|------|-----|
| Main thread | Claude Code session | entry point: parse intent, Task agents, launch the run-set workflow, reply to the user |
| `specloom-project-manager` | agent | only tracker writer; plans Phases/Briefs; returns Task Spec + ordered `run_set` with per-Brief `size` |
| `specloom-run-set` | **Workflow script** | deterministic execution: gates, attempts, budgets, stacking, failure cleanup |
| `specloom-implementation` | agent | gate 1 — production code + secrets scan on its own diff; code *and* tests in fast mode |
| `specloom-tester` | agent | gate 2 — criteria→assertions, coverage ratchet, visual criteria; skipped on the fast path |
| `specloom-repository` | agent | commits, stacked PRs, `merge_stack`, failed-set cleanup |
| `specloom-document` | agent | docs repo + type skills; optional direct user entry |
| `specloom-discovery` | agent | proposals with evidence; never creates work |
| `specloom-quality-gate` | agent | **external check** — scans a PR/branch/stack diff on demand, verifies every candidate (confirmed/plausible/refuted), returns PASS or a remediation list; read-only |

## The flow

```
1. Plan      you ⇄ main thread ⇄ PM        (init dialogue, Phases, Briefs, queue)
2. Execute   main thread → Workflow(specloom-run-set, { runSet })
               per Brief, sequential:
                 size small → Implementation fast mode (code + tests) → stacked PR
                 else       → Implementation → Tester → stacked PR
3. Check     main thread → specloom-quality-gate on the green stack
               PASS → continue · FAIL → blocking findings back to a remediation run
4. Land      main thread → Repository merge_stack → PM Done + promote → Document closeout
```

The quality gate is external: the run-set workflow neither launches it nor waits for it, and
the user can point it at any PR or branch independently of SpecLoom runs.

Auto-running the next Brief after Done remains forbidden — the main thread asks, the user
decides.

## Budgets (enforced by the script, not by prose)

| Limit | Value |
|-------|-------|
| Implementation attempts | 3 |
| Tester attempts | 3 |
| Brief total | 5 |
| Same `(file, rule)` finding failing | 3 → stop the gate early |
| `token_budget_per_brief` | 250,000 measured between gates |

## Failure semantics

Stop the set at the first red Brief. The script Tasks Repository to: keep the failed branch
pushed, convert its PR to draft with the stuck gate and findings, comment earlier green PRs as
blocked, and touch nothing on `ai-workflow`. Recovery = fix the cause, relaunch with the same
`run_set`; green Briefs re-verify rather than re-implement.

## What v4 deliberately does not have

- An orchestrator agent (the main thread is the orchestrator)
- A loop-controller agent (the script is the loop)
- A per-Brief deep-security agent (secrets in gate 1; the deep pass is the external quality gate at the merge boundary)
- Receipts, token tables, confidence scores (measured telemetry or nothing)
- A read-scope cage (reads roam; writes stay scoped to the Brief)

The standing test for every remaining piece: **has it caught a real failure or changed a
decision?** If not, it is next on the chopping block.

---
name: specloom-loop-protocol
description: >
  INTERNAL — specloom-loop. Sequential Briefs in a run_set, per-gate attempt budgets,
  token ceiling, and what happens to branches when a set fails. Not user-invokable.
disable-model-invocation: true
---

# Loop protocol

## Input

- **run_set** — ordered Brief keys, 1..N
- Task Spec per Brief, tech stack, visual flag

Single Ready head → `run_set` is that one Brief.

## Before the first gate

Run **specloom-lang-mount**. A missing `code-*` / `test-*` stops the Brief before any gate runs,
rather than a worker discovering it mid-build.

## Per Brief

```
1. Base branch: first Brief from ai-workflow; later Briefs from the previous Brief tip
2. Work branch: specloom/<brief-key>
3. Visual Brief → UX ensure (specloom-ux-refs) before gate 1
4. Gate 1 Implementation  → gate 2 Security → gate 3 Tester
5. All three green → Repository commits and opens/updates the stacked PR
6. Next Brief
```

## Budgets — per gate, not per Brief

v2 gave the whole Brief one budget of 5, so a FAILED payload could not say which gate was stuck.

| Gate | Attempts |
|------|----------|
| Implementation | 3 |
| Security | 2 |
| Tester | 3 |
| **Brief total** | **6** across all gates |

The Brief total stops a Brief that ping-pongs between two gates that each stay under their own
budget.

Exhausted → `state: FAILED` naming the gate:

```json
{ "state":"FAILED", "brief":"BUD-11", "stuck_gate":"tester",
  "attempts":{"implementation":2,"security":1,"tester":3},
  "reason":"gate_attempts", "findings":[] }
```

## Token ceiling

`token_budget_per_brief`, default **250,000** (`specloom-contract`).

Check before dispatching each gate. Projected overrun → stop with `reason: budget` and report
spend so far. Attempts bound how many times a gate runs; they never bounded how much a single
run costs.

## Routing a failure

**specloom-remediation** maps `owner` to the next agent. Workers never Task each other.

## When a Brief fails mid-set

Stop the set. Do not start Brief i+1. Then clean up — v2 specified the stop and left the rest
undefined, so a failed 5-Brief set left four stacked PRs open on each other.

| Artefact | Action |
|----------|--------|
| Failed Brief's work branch | **keep**, pushed, for inspection |
| Failed Brief's PR | convert to **draft**, comment with the stuck gate and findings |
| Earlier green Briefs in the set | **keep** branches and PRs open, still stacked |
| Their PRs | comment: blocked by `<failed-brief>`, no action needed |
| Worktrees, if parallel | remove all, green or red |
| `ai-workflow` | **untouched** — nothing merges from a failed set |

Green Briefs are not merged on their own. Their base is the failed Brief's branch, so merging
would either reparent them silently or drag the failure in. Report them as ready-and-blocked and
let the operator decide.

## Recovery

The operator fixes the cause and re-invokes with the same `run_set`. Briefs whose gates are
already green are re-verified, not re-implemented: re-run the gates, and if all three are green
with no new commits, advance without calling Implementation.

## Forbidden

- Starting Brief i+1 before Brief i is green
- Parallel Briefs inside one run_set
- Merging to `ai-workflow` mid-set when N > 1
- Skipping UX ensure on a visual Brief
- User chat, Linear Done, queue promotion

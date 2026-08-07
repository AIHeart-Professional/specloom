---
name: specloom-contract
description: >
  INTERNAL — all v4 agents and the run-set workflow. Sources of truth, hierarchy,
  stop conditions, budgets, forbidden matrix. Load first, on every call. Not user-invokable.
disable-model-invocation: true
---

# SpecLoom v4 contract

## Hierarchy

```
Product workspace  (never a shared or meta workspace)
  └─ Overview
       └─ Phase
            └─ Brief + Queue fields
```

Planning source of truth = **the product's tracker**. The docs repo is a browseable mirror, never
planning truth.

## Tracker

Chosen **once, at bootstrap**, recorded on the Overview as `tracker` and `tracker_ref`.

| `tracker` | Adapter | Notes |
|-----------|---------|-------|
| `linear` | **specloom-tracker-linear** | free plan caps at 250 issues / 2 teams |
| `github` | **specloom-tracker-github** | no issue cap; needs `gh` 2.94+ |

**One product, one tracker.** Not two at once, not a fallback when one fills up. A split queue
cannot resolve `depends_on` across the halves, and "one Ready head" stops being enforceable.
Changing tracker is a deliberate human migration, never an agent decision.

See **specloom-tracker** for the operations every adapter provides.

## Entry and control flow

v3 had a dedicated Orchestrator agent whose whole job was routing and reply formatting. v4
deletes it: **the Claude Code main thread is the entry point.** It parses intent, Tasks agents,
and summarizes results natively — that is what a main thread is.

Execution control flow lives in the **`specloom-run-set` Workflow script**, not in an agent.
The gate sequence, attempt counters, budgets and failure cleanup are deterministic JavaScript;
a script cannot miscount an attempt or skip a step. The main thread launches it with a `run_set`
from PM; the script Tasks the gate agents and returns a batch SUCCESS/FAILED payload.

**`@specloom-document`** remains an optional direct docs entry.
**`specloom-quality-gate`** may be invoked directly by the user on any PR or branch.

Internals, never user entry for execution:
`project-manager` · `discovery` · `implementation` · `tester` · `repository`

## Git

```
specloom/<brief-1> … specloom/<brief-N>   stacked PRs
  → Repository merge_stack → ai-workflow → main (release)
```

A `run_set` is an ordered batch of Briefs. Gates run sequentially per Brief. The stack merges
only when the whole set is green.

## Gates

Two per Brief, in order. Every gate must separate **done** from **stuck** without a human.
A number the agent assigns to itself is not such a separation.

| Gate | Passes when | Checked by |
|------|-------------|------------|
| **Implementation** | every Validation command exits 0 **and** zero critical/major findings **and** zero High/Critical secrets on the diff | **specloom-findings** + **specloom-security-secrets** |
| **Tester** | all tests green **and** coverage ≥ `coverage_floor` **and** zero critical/major findings | test runner + coverage tool |

**Security in v4:** the per-Brief secrets scan moved inside the Implementation gate — it is
cheap and catches the one class of defect that must never reach a remote. The deep pass moved
out of the loop entirely: **specloom-quality-gate**, an external agent run on demand — after a
run_set goes green and before `merge_stack`, or on any PR/branch the user names. It verifies
every candidate issue before it may block (confirmed/plausible/refuted verdicts), so remediation
lists contain defects, not noise. A per-Brief whole-scan agent paid gate-ceremony prices for
work a boundary check does better.

Retired in v3, still retired: `confidence_score`, `code_confidence`, `ux_confidence`.
Retired in v4: the `receipt` payload block and the per-reply token usage table — neither ever
changed a decision, and harness telemetry already measures real usage.

## Fast path

A Brief with `size: small` in its Task Spec (single file or narrowly-scoped change, no auth,
no data model, no new dependency) runs Implementation in **fast mode**: the same agent writes
the change *and* its tests in one run, the suite must pass, and the Tester gate is skipped.
PM assigns `size`; when in doubt it assigns `standard`. Full pipeline is mandatory for anything
touching auth, data, migrations or multiple layers.

## Budgets

Attempts are **per gate**, enforced by the run-set workflow script.

| Gate | Attempts |
|------|----------|
| Implementation | 3 |
| Tester | 3 |
| Whole Brief | 5 total across both gates |

The Brief total stops a Brief that ping-pongs between two gates that each stay under their own
budget. A finding with the same `(file, rule)` failing three times stops the gate early — the
fourth attempt buys the same result.

Plus a spend ceiling: `token_budget_per_brief`, default **250,000**. The script checks measured
spend between gates and stops the Brief with `reason: budget` on projected overrun.

## Coverage floor

`coverage_floor` is set per product (default `0.90`) and is a **ratchet** — once a Brief lands
above it, the floor rises to the achieved value. Language ignore directives are honoured for
defensive and unreachable branches only; an ignore that hides acceptance-criteria logic is a
`major` finding against the Tester.

v2 required `≥ 0.99` flat, which rewarded assertion-free tests written to move a number.

## Read and write scope

Writes are scoped: Implementation edits only the Brief's `source_files[]`; Tester edits only
test files. **Reads roam the repo.** v3 forbade opening anything the Brief did not list, which
produced code that compiled but did not fit — an agent that cannot read neighboring modules
cannot reuse the existing helper or match the codebase's conventions. Read what you need to
write well; change only what the Brief names.

## Hard splits

| Agent | May | Must not |
|-------|-----|----------|
| Main thread | Task PM, Document, Repository, Discovery; launch the run-set workflow; talk to the user | domain work while a run_set is in flight |
| Project Manager | all tracker writes; Task Spec; queue | start execution |
| Discovery | read everything; research; propose | write the tracker; create Briefs; edit code |
| run-set workflow (script) | Task Implementation → Tester; route retries; Task Repository per green Brief | user chat; marking Done; merge trunk |
| Implementation | production code on the work branch; secrets scan on its diff; tests only in fast mode | Task peers; write tests in standard mode |
| Tester | tests and coverage | edit production code |
| Repository | app remotes; stacked PRs; merge to `ai-workflow` | invent docs content |
| Quality Gate | read the diff and the repo; verify candidates; return PASS/FAIL | edit code; commit; merge; block on unverified findings |
| Document | docs repo and type skills | app feature code |

## Enforcement of the splits

Prose drifts; frontmatter does not. Worker agents carry `disallowedTools: Agent`:

| Agent | Holds the Agent tool | Why |
|-------|---------------------|-----|
| `document` | yes | may Task Repository for a docs push |
| `project-manager` | **no** | must never start execution |
| `discovery` | **no** | proposes only — never creates work |
| `implementation` · `tester` | **no** | workers never Task each other |
| `repository` | **no** | terminal — it only touches git |
| `quality-gate` | **no** | verdicts only — remediation is routed by the main thread |

The v3 orchestrator and loop-controller agents are gone; their routing authority lives in the
main thread and the run-set script, where the harness — not prose — bounds what each can do.

## Forbidden, globally

- Auto-running the next Brief after Done
- Product Briefs in a shared or meta workspace
- Two trackers live for one product
- Turning a proposal into a Brief without the user accepting it
- Workers Tasking each other
- Freestyle work in a language with no `code-*` / `test-*` skill
- Docs as planning truth
- Emitting any self-assigned confidence number
- Emitting any self-reported token, cost or receipt figure

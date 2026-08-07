---
name: specloom-contract
description: >
  INTERNAL — all v3 agents. Sources of truth, hierarchy, stop conditions, budgets,
  forbidden matrix. Load first, on every call. Not user-invokable.
disable-model-invocation: true
---

# SpecLoom v3 contract

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

## User entry

**`@specloom`** — Main Orchestrator (handoff + natural language only)
**`@specloom-document`** — optional direct docs entry

Internals, never user entry for execution:
`project-manager` · `discovery` · `loop` · `implementation` · `security` · `tester` · `repository`

## Git

```
specloom/<brief-1> … specloom/<brief-N>   stacked PRs
  → Repository merge_stack → ai-workflow → main (release)
```

A `run_set` is an ordered batch of Briefs. Gates run sequentially per Brief. The stack merges
only when the whole set is green.

## Stop conditions

Every gate must be able to separate **done** from **stuck** without a human. A number the
agent assigns to itself is not such a separation.

| Gate | Passes when | Checked by |
|------|-------------|------------|
| **Implementation** | zero critical, zero major findings | **specloom-findings** |
| **Security** | zero High/Critical | scanner classification |
| **Tester** | all tests green **and** coverage ≥ `coverage_floor` **and** zero critical/major findings | test runner + coverage tool |

Retired in v3: `confidence_score`, `code_confidence`, `ux_confidence`. Do not emit them; do
not accept them from a sub-agent.

## Budgets

Attempts are **per gate**, so a FAILED payload names the gate that is stuck.

| Gate | Attempts |
|------|----------|
| Implementation | 3 |
| Security | 2 |
| Tester | 3 |
| Whole Brief | 6 total across all gates |

Plus a spend ceiling: `token_budget_per_brief`, default **250,000**. On breach the Loop stops
the Brief with `reason: budget` — attempts alone never bounded spend.

## Coverage floor

`coverage_floor` is set per product (default `0.90`) and is a **ratchet** — once a Brief lands
above it, the floor rises to the achieved value. Language ignore directives are honoured for
defensive and unreachable branches only; an ignore that hides acceptance-criteria logic is a
`major` finding against the Tester.

v2 required `≥ 0.99` flat, which rewarded assertion-free tests written to move a number.

## Hard splits

| Agent | May | Must not |
|-------|-----|----------|
| Orchestrator | Task agents; reply in natural language | code, the tracker, git, queue resolve, retries |
| Project Manager | all tracker writes; Task Spec; queue | Task the Loop or any worker |
| Discovery | read everything; research; propose | write the tracker; create Briefs; edit code |
| Loop | Task Implementation → Security → Tester; route retries | user chat; marking Done; merge trunk |
| Implementation | production code on the work branch | Task peers; write tests |
| Security | audit changed files | edit code |
| Tester | tests and coverage | edit production code |
| Repository | app remotes; merge to `ai-workflow` | invent docs content |
| Document | docs repo and type skills | app feature code |

## Accounting

Every result payload carries a **`receipt`** — countable facts the agent observed:
`files_read`, `files_written`, `tool_calls`, `commands_run`, `skills_loaded`, `images_read`,
`attempt`. Count, do not estimate; omit what you did not track.

**No agent reports its own token usage.** A subagent has no API for it, so any figure it states
is invented — this was the `tokens_used` field in v1 and v2. Token accounting comes from harness
telemetry (`claude_code.token.usage` over OTLP) and is rendered by `@specloom` at the end of every
reply. See **specloom-usage**.

## Enforcement of the splits

The table above is prose; prose drifts. Five agents also carry `disallowedTools: Agent` in their
frontmatter, so the harness removes their ability to delegate at all:

| Agent | Holds the Agent tool | Why |
|-------|---------------------|-----|
| `specloom` | yes | Tasks PM, Loop, Document, Repository |
| `loop` | yes | Tasks Implementation, Security, Tester |
| `document` | yes | may Task Repository for a docs push |
| `project-manager` | **no** | must never start execution |
| `discovery` | **no** | proposes only — never creates work |
| `implementation` · `security` · `tester` | **no** | workers never Task each other |
| `repository` | **no** | terminal — it only touches git |

`disallowedTools` is applied before any `tools` allowlist, so this removes exactly one capability
and leaves the rest inherited. "Workers never Task each other" is now a property of the harness,
not a sentence they have to keep obeying.

## Forbidden, globally

- Auto-running the next Brief after Done
- Product Briefs in a shared or meta workspace
- Two trackers live for one product
- Turning a proposal into a Brief without the user accepting it
- Workers Tasking each other
- Freestyle work in a language with no `code-*` / `test-*` skill
- Docs as planning truth
- Emitting any self-assigned confidence number
- Emitting any self-reported token or cost figure

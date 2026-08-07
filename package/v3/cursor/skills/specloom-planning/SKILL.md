---
name: specloom-planning
description: >
  INTERNAL — specloom-project-manager. Turning a scope into Phases and ordered Briefs:
  sizing, boundaries, dependency edges. Not user-invokable.
disable-model-invocation: true
---

# Planning

Turns an Overview into Phases, and a Phase into Briefs the Loop can execute unattended.

## Phase boundaries

A Phase is a coherent slice a user could see shipped. Not a layer.

| Good | Bad |
|------|-----|
| "Accounts and sign-in" | "All the database work" |
| "Budget list and detail" | "Backend" |
| "Offline sync" | "Phase 2" |

A Phase organised by layer forces every Brief in it to block on every other, which defeats the
queue.

## Brief sizing

One Brief is one work branch, one stacked PR, one pass of three gates.

| Signal it is too big | Split by |
|----------------------|----------|
| More than ~8 acceptance criteria | user-visible capability |
| Touches all three layers *and* more than ~10 files | layer, with explicit `depends_on` |
| Contains "and also" in the title | the "and" |
| Cannot state a single objective in one sentence | the objectives |

| Signal it is too small | Merge with |
|------------------------|------------|
| No acceptance criterion a user could observe | the Brief it serves |
| Only adds a type or a constant | its consumer |

Too-small is the commoner error and it is expensive: every Brief pays full gate overhead.

## Required in every Brief

- one-sentence technical objective
- measurable **functional** acceptance criteria
- measurable **visual** criteria plus Image Files when visual
- tech stack tags and Required Context (Code + Test Standards paths)
- `queue_order`, `depends_on`, `blocks`

A Brief missing any of these is not Ready. Draft validation is a `critical` finding.

## Dependency edges

Add an edge only for a **hard** dependency — B cannot compile or run without A.

Do not add an edge for: preferring an order, shared subject matter, or the same author. Soft
preferences are `queue_order`. Every unnecessary edge narrows what can be batched into a
`run_set` and serializes work that did not need it.

Cycles are a planning error, not a runtime one. Fix before Ready.

## Ordering

Lower `queue_order` first: scaffold → data → API → UI → polish. Ties break by dependency depth,
then issue id.

## Batching into a run_set

Briefs may share a `run_set` when they are in one Phase, form a chain or an independent set with
no external unmet dependency, and share a stack. Keep a set to ~5. A failure at Brief 3 of 8
leaves seven branches to reason about.

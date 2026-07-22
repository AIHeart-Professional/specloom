---
name: specloom-v2-contract
description: >
  INTERNAL — all v2 peers. Hierarchy, Linear map, independence, full-auto, persistence.
  Load first every session. Not user-invokable.
disable-model-invocation: true
---

# SpecLoom v2 contract

## Hierarchy

```
Overview (Linear Initiative) = end goal + planning_mode + languages
  └─ Phase (Project + Document) = milestone  [many work Briefs]
       └─ Brief (Issue) = work unit
```

Overview SoT = **Linear**, never GitHub app repo.

## Peers

```
@specloom-init → @specloom-brief → @specloom-build → @specloom-test → @specloom-validate
```

| Peer | Job |
|------|-----|
| **specloom-init** | NEW project orchestrator → Tasks **specloom-planner** only |
| **specloom-brief** | Later add/edit Phases & Briefs |
| **specloom-build** | Prod code |
| **specloom-test** | Tests |
| **specloom-validate** | Done auto |
| **specloom-git** | Git/GitHub |

## Internal (not user @)

| Agent | Parent |
|-------|--------|
| **specloom-planner** | init — dialogue, Overview, Phases/Briefs, git + advisory Tasks |
| **specloom-build-worker** | build |
| **specloom-test-loop** | test |
| **specloom-validate-loop** | validate |

## Allowed Tasks

- `specloom-init` → `specloom-planner` only  
- `specloom-planner` → `specloom-git` (`GIT_HANDOFF`)  
- `specloom-planner` → `specloom-frontend|backend|database` (`INIT_ADVISORY_HANDOFF` / `read_standards_only`)  

No other peer→peer Task.

## planning_mode

On Overview: `high` | `low`. Sticky. High = agent owns tech defaults. Low = user owns tech.

## Work Brief states

`Backlog → Ready → Building → Testing → Validating → Done`

Ready only if unblocked. Init may leave Backlog + `blocks: Qx`.

## Layers

`frontend` | `backend` | `database` only.

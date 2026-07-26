---
name: specloom-v2-contract
description: >
  INTERNAL — all v2 peers. Hierarchy, queue, Linear map, docs repo, full-auto chain.
  Not user-invokable.
disable-model-invocation: true
---

# SpecLoom v2 contract

## Hierarchy

```
Overview (Linear Initiative)
  └─ Phase (Project + Document)
       └─ Brief (Issue) + Queue fields
```

Overview SoT = **Linear**.  
Docs repo = browseable mirror (architecture / system / workflow / specs) — **not** planning SoT.

## Peers

```
@specloom-init → @specloom-brief → @specloom-build → @specloom-test → @specloom-validate
@specloom-document · @specloom-git
```

## Allowed Tasks

| From | To | When |
|------|-----|------|
| init | planner | always |
| planner | git, document bootstrap, layer advisory | bootstrap |
| **brief** | **document** sync_brief; **build** | plan done |
| **build** | **test** | build pass |
| **test** | **validate** | test pass |
| **validate** | **document** closeout; **build** next | Brief Done |

## Docs repo (lightweight)

Only: `README.md` · `architecture/` · `system/` · `workflow/` · `specs/{active,archived}/`  
Skill: **specloom-document**. App branch `ai-workflow`; docs branch `main`.

## Queue

Every Brief: `queue_order`, `depends_on`, `blocks`. See **specloom-queue**.  
One Ready head by default. Status via labels if custom workflow states missing.

## Stages

`Backlog → Ready → Building → Testing → Validating → Done`  
Mapped with `specloom:*` labels when needed.

## Layers

`frontend` | `backend` | `database` only.

---
name: specloom-v2-contract
description: >
  INTERNAL — all v2 peers. Hierarchy, queue, single run orchestrator, docs repo.
  Not user-invokable.
disable-model-invocation: true
---

# SpecLoom v2 contract

## Hierarchy

```
Product Linear Team (not Specloom meta-team)
  └─ Overview (Project + Document)
       └─ Phase (Project + Document)
            └─ Brief (Issue) + Queue fields
```

Overview SoT = **Linear** on the **product team**.  
Docs repo = browseable mirror — **not** planning SoT.

## Linear team

Init runs **specloom-linear-team**: one Team per product; Issues keyed `{KEY}-n`.  
Specloom team = SpecLoom meta only.

## User-facing peers

```
@specloom-init → @specloom-brief → @specloom-run
@specloom-document · @specloom-git
```

**Execution:** one orchestrator **`@specloom-run`** completes **one SPE** via internal build / validate / test.

## Internal (not user entry)

`specloom-build` · `specloom-test` · `specloom-validate` · workers / loops / layer agents

## Allowed Tasks

| From | To | When |
|------|-----|------|
| init | planner | always |
| planner | git, document, lang-ensure, linear-team, advisory | bootstrap |
| **brief** | **document** sync; **specloom-run** | plan done (unless `manual`) |
| **run** | **build**, **validate**, **test**, **document** | per run-protocol gates |
| build / test / validate | only their workers | never peer-chain |

## Run gates

1. Build → validate `code_quality` ≥ **99%** confidence (≤5 retries)  
2. Test → validate `test_quality` ≥ **99%** + **100%** coverage (≤5 retries)  
3. Push `ai-workflow` → Done → docs closeout → promote next Ready (**no** auto-run next)

## Docs / queue / layers / languages / Linear

Docs repo lightweight; queue via **specloom-queue**; layers frontend|backend|database; **specloom-lang-ensure** for `code-*`/`test-*`; **specloom-linear-team** for per-product Team.

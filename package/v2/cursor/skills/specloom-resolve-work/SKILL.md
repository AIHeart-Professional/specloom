---
name: specloom-resolve-work
description: >
  INTERNAL — v2 peers. Resolve Overview/Phase/Brief from product Linear team + queue.
  Not user-invokable.
disable-model-invocation: true
---

# Resolve work

Load **specloom-queue** for stage labels + ordering.

## Algorithm

1. Linear MCP required. Fail if missing.
2. Resolve **product team** from Overview Linear section (`team_name` / `team_id`). Prefer filter all lists by that team. Never default to Specloom meta-team for app work.
3. If peer is **specloom-init**: bootstrap — no Brief required (still will create team via specloom-linear-team).
4. If user names Issue key → that Brief (verify team matches Overview when possible).
5. Else resolve by **pipeline stage** (label preferred — see specloom-queue) **on product team**:
   - **run / build:** `specloom:building` OR (`specloom:ready` / Ready) — pick **lowest queue_order**
   - **test:** `specloom:testing`
   - **validate:** `specloom:validating`
6. If none in-flight: promote/find queue head via **specloom-queue** (deps Done, no blocks).
7. If peer is **specloom-brief**: Overview + active Phase on product team; plan full queue.
8. Load Brief + Phase Document (+ Overview if needed).
9. Branch: **always** `ai-workflow` (fetch + pull). Never `task/*`.
10. Tasks: unchecked remaining; checked → verify commits on `ai-workflow`.
11. `standards_ref` from Brief / pin (**specloom-standards-fetch**).

## Multiple Briefs

Never ask user to pick when queue_order + depends_on define a unique head.

## no_work

- No runnable Brief on product team  
- Done/Blocked without override  
- specloom-brief with no Overview → `@specloom-init`

## Output pointers

```
team_name, team_key, brief_key, queue_order, depends_on, stage, phase_project, overview_id, branch=ai-workflow, open_tasks[], standards_root
```

---
name: specloom-resolve-work
description: >
  INTERNAL — v2 peers. Resolve Overview/Phase/Brief from Linear + queue. Not user-invokable.
disable-model-invocation: true
---

# Resolve work

Load **specloom-queue** for stage labels + ordering.

## Algorithm

1. Linear MCP required. Fail if missing.
2. If peer is **specloom-init**: bootstrap — no Brief required.
3. If user names Issue key → that Brief.
4. Else resolve by **pipeline stage** (label preferred — see specloom-queue):
   - **build:** `specloom:building` OR (`specloom:ready` / Ready) — pick **lowest queue_order**
   - **test:** `specloom:testing`
   - **validate:** `specloom:validating`
5. If none in-flight for build: promote/find queue head via **specloom-queue** (deps Done, no blocks).
6. If peer is **specloom-brief**: Overview + active Phase; plan full queue.
7. Load Brief + Phase Document (+ Overview if needed).
8. Branch: **always** `ai-workflow` (fetch + pull). Never `task/*`. See **specloom-git-workflow**.
9. Tasks: unchecked remaining; checked → verify commits on `ai-workflow`.
10. `standards_ref` from Brief / pin (**specloom-standards-fetch**).

## Multiple Briefs

Never ask user to pick when queue_order + depends_on define a unique head.  
Ask only if `parallel` mode and ambiguous.

## no_work

- No runnable Brief for this peer  
- Done/Blocked without override  
- specloom-brief with no Overview → `@specloom-init`

## Output pointers

```
brief_key, queue_order, depends_on, stage, phase_project, overview_id, branch=ai-workflow, open_tasks[], standards_root
```

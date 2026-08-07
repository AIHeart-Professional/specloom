---
name: specloom-resolve-work
description: >
  INTERNAL — Project Manager and the run-set workflow. Resolve the product and next Brief
  from the tracker + queue. Not user-invokable.
disable-model-invocation: true
---

# Resolve work

Load **specloom-queue** for stage labels and ordering, and **specloom-tracker** to resolve this product's tracker and its adapter.

## Who uses this

- **Project Manager** — pick Ready head / named Brief → build Task Spec  
- **run-set workflow** — confirm Brief + stage while executing  

**The main thread does not run this** — it Tasks PM instead.

## Algorithm

1. Resolve the tracker from the Overview via **specloom-tracker**, then load its adapter. See **Tracker unavailable** below.  
2. Resolve the product via the adapter's `resolve_product`. Never default to a shared or meta workspace.  
3. User names Issue key → that Brief (verify team).  
4. Else queue head via **specloom-queue** (deps Done, no blocks, lowest `queue_order`).  
5. In-flight: prefer `specloom:building` / `testing` / `validating` labels on product team.  
6. Load Brief + Phase (+ Overview if needed).  
7. Work branch name: `specloom/<brief-key>` branched from **`ai-workflow`** (run-set workflow / Repository).  
8. `standards_ref` from Brief / **specloom-standards-fetch**.  

## Multiple Briefs

Never ask user to pick when queue defines a unique head.

## no_work

- No runnable Brief on product team  
- Done/Blocked without override  
- No Overview → hand off to PM bootstrap / new product  

---

## Tracker unavailable

v2 said "fail if missing" for Linear, which halted everything — including work already merged that only
needed a status transition.

| Operation | Tracker unreachable |
|-----------|----------------|
| Resolve the next Brief | **halt** — the queue is the plan |
| Create or edit a Brief | **halt** |
| Mark Done, promote the head | **defer** — queue it, apply on reconnect |
| Continue a Brief already in flight | **proceed** — the Task Spec is in the handoff |
| `merge_stack` for a green run_set | **proceed**, then defer the Done transitions |
| Report status to the user | **proceed** from manifests and git |

Deferred transitions go to `.specloom/pending-tracker.json` in the product repo:

```json
{ "pending": [ { "op": "done", "brief": "BUD-11", "at": "..." } ] }
```

PM drains it on the next successful tracker call, oldest first, and reports what it applied.

The rule: **never lose completed work to an unavailable tracker.** Code that passed three gates
and merged is done whether or not a label moved. Deferring the label is recoverable; discarding
the run is not.

---
name: specloom-resolve-work
description: >
  INTERNAL — Project Manager and Loop. Resolve product team + Brief from Linear + queue.
  Not user-invokable. Not for Orchestrator.
disable-model-invocation: true
---

# Resolve work

Load **specloom-queue** for stage labels + ordering.

## Who uses this

- **Project Manager** — pick Ready head / named Brief → build Task Spec  
- **Loop** — confirm Brief + stage while executing  

**Orchestrator does not run this** — it Tasks PM/Loop instead.

## Algorithm

1. Linear MCP required. Fail if missing.  
2. Resolve **product team** from Overview (`team_name` / `team_id`). Never default to Specloom meta-team.  
3. User names Issue key → that Brief (verify team).  
4. Else queue head via **specloom-queue** (deps Done, no blocks, lowest `queue_order`).  
5. In-flight: prefer `specloom:building` / `testing` / `validating` labels on product team.  
6. Load Brief + Phase (+ Overview if needed).  
7. Work branch name: `specloom/<brief-key>` branched from **`ai-workflow`** (Loop/Repository).  
8. `standards_ref` from Brief / **specloom-standards-fetch**.  

## Multiple Briefs

Never ask user to pick when queue defines a unique head.

## no_work

- No runnable Brief on product team  
- Done/Blocked without override  
- No Overview → Orchestrator should hand off PM bootstrap / new product  

---
name: specloom-loop-protocol
description: >
  INTERNAL — Loop Controller. Sequential Briefs in a run set; each Brief full
  Impl→Security→Test before next; stacked branches. Not user-invokable.
disable-model-invocation: true
---

# Loop protocol

## Input

From Orchestrator / PM:

- **run_set**: ordered Brief keys (1..N) — may be one Brief or many related (e.g. 5 base-UI tabs)  
- Task Spec(s) / tech_stack / visual flags  

Default if only one Ready head: `run_set = [that head]`.

## Per Brief (strict sequence)

For each Brief in `run_set` **one at a time**:

```
1. Base branch:
   - first Brief → branch from ai-workflow
   - later Brief → branch from previous Brief's work branch tip (stack)
2. Work branch: specloom/<brief-key>
3. If UI/visual → UX ensure (ingest/generate; style-match existing refs)
4. Implementation → Security → Tester
5. Gate: confidence≥0.99, ux≥0.99 if visual, coverage≥0.99, zero High/Critical
6. Retry ≤5 via remediation; else FAILED → stop entire run_set (do not start next Brief)
7. On SUCCESS for this Brief:
   - Push work branch
   - Ask Orchestrator to Task Repository: open/update stacked PR
     (base = ai-workflow for first; else previous specloom/<prior-brief>)
   - Do NOT merge to ai-workflow yet if more Briefs remain in run_set
8. Next Brief in run_set
```

## After last Brief SUCCESS

Return batch SUCCESS payload listing all Briefs + branches + stacked PR refs.  
Orchestrator then Tasks Repository to **merge stack → ai-workflow** (bottom-up), then PM Done for each, then Document closeout.

## Forbidden

- Starting Brief N+1 before Brief N passed all gates  
- Parallel Loops on the same run_set  
- Merging mid-set to ai-workflow (unless run_set length is 1)  
- Skipping UX ensure on UI Briefs  

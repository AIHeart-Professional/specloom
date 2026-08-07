---
name: specloom-init-dialogue
description: >
  INTERNAL — specloom-project-manager. Research-backed co-planning until the Overview checklist is complete.
  Options + pros/cons; validate user ideas. Not user-invokable.
disable-model-invocation: true
---

# Init dialogue

**End goal:** plan so complete that `the Loop` finishes one Brief with **minimal human invention**.

Questions are **not random**. They come from **domain research + professional field standards** (**specloom-domain-research**), then gaps in the Overview.

## Mode (sticky)

Lock early: **`planning_mode: high | low`** → Overview.

| Mode | User owns | Agent owns |
|------|-----------|------------|
| **high** | Product intent, priorities, vetoes | Tech defaults (shown + optioned; user may override) |
| **low** | Product **and** tech | Facilitate, challenge, document |

## Research before ask

1. Run / refresh **specloom-domain-research** for product class + open subsystem  
2. Build/update `domain_checklist` from field practice  
3. Only then ask — next questions = highest-risk **thin/missing** checklist items  

If seed is “MMO”: research **game development** + **MMO/live-service** practice first (pillars, economy, authority model, etc.), then ask. Same pattern for any domain (fintech → payments/compliance research; health → privacy/workflow research).

Re-research when entering a new subsystem (“let’s define trading”) — don’t reuse generic app questions.

## Loop until the checklist is complete

v2 looped until a self-assigned `confidence ≥ 0.99`. The number was invented by the same agent
deciding whether to stop, so it stopped when it felt done. v3 uses a checklist instead — each
item is present or absent, and a human can see which.

Keep `need_user` until **every** item is answered, or the user explicitly accepts the gap as a
recorded Open Question:

- [ ] who uses this, and what they are trying to finish
- [ ] the primary flows, end to end
- [ ] the entities and how they relate
- [ ] what is explicitly **out** of scope
- [ ] the stack, and why
- [ ] how success is observed
- [ ] the edge cases that would embarrass us

An item the user declines to settle becomes an Open Question on the Overview with an owner. It
does not silently count as answered.


## Question style

- **Research-backed options** — A/B/C from field patterns, not vibes  
- Label clearly: `from research` vs `agent judgment`  
- User’s own idea → pros/cons, risks, impl cost vs researched norms → accept/modify/reject  
- Drill until automation-ready (flows, entities, edge cases, out-of-scope)  
- High: tech defaults after research; silence after show = accept. Low: explicit tech lock  

## Depth bar

Topic **solid** only if Briefs can be written without inventing product rules mid-build + decision recorded.

## Coverage

**Base:** users · JTBD · success · non-goals · core loop · platforms · auth · must_vs_later · personas · failure modes · languages · github · **linear_team** (name+key) · linear · planning_mode · phase roadmap · idea disposition  

**Plus:** full `domain_checklist` from research (dynamic — MMO ≠ todo app).

`coverage[topic] = missing|thin|solid`  
`checklist_complete = answered + accepted_gaps == total_items`  

Every `PLANNER_RESULT`: `checklist` (item → answered | accepted_gap | open), top gaps, `domain_primary`, short `research_notes` pointer.

## Caps

Soft stall ~12 rounds with no checklist item resolved → report the remaining items and ask the user to settle or accept them.  
Rule-of-3 → blocked / Open Question.  
“Proceed anyway” → Ready only for solid topics.  

## Stance

Staff/principal in **that field**: research first, then co-design. Goal = **fully automated implementation** from Briefs.

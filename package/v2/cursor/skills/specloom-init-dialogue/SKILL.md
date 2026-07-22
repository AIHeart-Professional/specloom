---
name: specloom-init-dialogue
description: >
  INTERNAL — specloom-planner. Research-backed dynamic co-planning to ~99% automation-ready.
  Options + pros/cons; validate user ideas. Not user-invokable.
disable-model-invocation: true
---

# Init dialogue

**End goal:** plan so complete that `@specloom-build` → test → validate runs with **minimal human invention**.

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

## Loop until ≥99%

Keep `need_user` until **confidence ≥ 0.99** or user accepts listed residual Open Questions.

Per turn:

1. **Reflect** — Overview beliefs (cite which checklist topics are solid)  
2. **Propose** — researched options (2–4) + **pros/cons** + professional recommendation  
3. **Ask** — **1–3** questions targeting checklist gaps  
4. **Patch** — Overview draft + decision log + coverage  

After answers: validate (incl. user-invented ideas → pros/cons) → patch → next researched gap. Do not stop early.

## Question style

- **Research-backed options** — A/B/C from field patterns, not vibes  
- Label clearly: `from research` vs `agent judgment`  
- User’s own idea → pros/cons, risks, impl cost vs researched norms → accept/modify/reject  
- Drill until automation-ready (flows, entities, edge cases, out-of-scope)  
- High: tech defaults after research; silence after show = accept. Low: explicit tech lock  

## Depth bar

Topic **solid** only if Briefs can be written without inventing product rules mid-build + decision recorded.

## Coverage

**Base:** users · JTBD · success · non-goals · core loop · platforms · auth · must_vs_later · personas · failure modes · languages · github · linear · planning_mode · phase roadmap · idea disposition  

**Plus:** full `domain_checklist` from research (dynamic — MMO ≠ todo app).

`coverage[topic] = missing|thin|solid`  
`confidence ≈ solid / (solid + thin + missing_required)`  

Every `PLANNER_RESULT`: `confidence`, top gaps, `domain_primary`, short `research_notes` pointer.

## Caps

Soft stall ~12 rounds without confidence gain → report + focus top researched gaps (keep looping).  
Rule-of-3 → blocked / Open Question.  
“Proceed anyway” → Ready only for solid topics.  

## Stance

Staff/principal in **that field**: research first, then co-design. Goal = **fully automated implementation** from Briefs.

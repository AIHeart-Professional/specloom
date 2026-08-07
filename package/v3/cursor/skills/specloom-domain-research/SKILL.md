---
name: specloom-domain-research
description: >
  INTERNAL — specloom-project-manager. Research product domain + professional field standards
  before questioning. Not user-invokable.
disable-model-invocation: true
---

# Domain research

Questions must come from **researched professional practice**, not random brainstorming.

## When

1. **Once early** after seed (classify domain)  
2. **Again** when a major subsystem opens (e.g. user says “trading”)  
3. **Refresh** if domain pivots  

## Classify

From user seed, set:

```
domain_primary: e.g. mmo_game | saas_b2b | marketplace | mobile_consumer | …
domain_fields: e.g. [game_dev, mmo_ops, live_service, economy_design]
```

## Research actions (required)

Use available tools (**WebSearch** / **WebFetch** / docs) to gather:

| Layer | Look for |
|-------|----------|
| Field standards | How pros build this class of product (pipelines, pillars, non-negotiables) |
| Domain playbooks | Subsystem checklists (MMO → persistence, authority server, economy sinks/faucets, anti-cheat, sharding…) |
| Common failure modes | What kills projects / launches in this field |
| Reference patterns | 2–4 industry patterns with tradeoffs (not copy brands blindly) |
| Compliance / platform | If relevant (stores, age, gambling-like economy, privacy) |

Prefer **primary/credible** sources: engine docs, platform docs, known GDC/postmortems, OWASP for auth apps, etc. Note sources in `research_notes`.

## Output → planning

Build a **domain checklist** (topics pros always decide). That checklist **feeds** dialogue coverage — it is the spine of what to ask.

Example MMO spine (illustrative — always re-research, don’t hardcode only this):

- Client/server authority · persistence · character progression · combat loop · inventory · **economy/trading** · social/guilds · chat/moderation · world/instancing · matchmaking · monetization · live ops · anti-cheat · performance budgets · content pipeline  

SaaS example spine: tenants · roles · billing · audit · onboarding · SLAs · data residency · …

## Forbidden

- Ask subsystem questions with **no** research pass for that domain/subsystem  
- Invent “industry standard” claims without a source or clear reasoning labeled as agent judgment  
- Random feature laundry lists unrelated to researched pillars  

## Hand back to dialogue

Pass into Overview draft / PLANNER_RESULT:

```
domain_primary, domain_fields, research_notes[], domain_checklist[] (topic + why_it_matters + typical_options)
```

Dialogue picks next 1–3 questions from **thin/missing checklist items**, using researched typical_options for A/B/C + pros/cons.

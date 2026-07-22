---
name: specloom-init-protocol
description: >
  INTERNAL — specloom-init + specloom-planner. Handoff/result schemas and orchestration rules.
  Not user-invokable.
disable-model-invocation: true
---

# Init protocol

## PLANNER_HANDOFF (init → planner)

```json
{
  "type": "PLANNER_HANDOFF",
  "from": "specloom-init",
  "action": "run_until_complete|continue",
  "planning_mode_hint": "high|low|null",
  "user_seed": "",
  "user_replies": [],
  "prior_draft_summary": null,
  "iteration": 0
}
```

- `run_until_complete` — first call or resume after user answers  
- `continue` — same session follow-up with `user_replies`

## PLANNER_RESULT (planner → init)

```json
{
  "type": "PLANNER_RESULT",
  "status": "need_user|complete|blocked",
  "planning_mode": "high|low|null",
  "confidence": 0.0,
  "domain_primary": null,
  "domain_fields": [],
  "research_notes": [],
  "questions": [],
  "reflect_summary": "",
  "proposals": [],
  "options_presented": [],
  "overview_url": null,
  "repo_url": null,
  "ai_workflow_ready": false,
  "phases_created": [],
  "briefs_ready": [],
  "briefs_backlog": [],
  "open_questions": [],
  "coverage": {},
  "notes": ""
}
```

| status | When |
|--------|------|
| `need_user` | `confidence < 0.99` or need answers — **keep looping** after each reply |
| `complete` | `confidence >= 0.99` (or user accepted holes) **and** Overview+git+Phases/Briefs committed |
| `blocked` | Rule-of-3 / hard cap with gaps remaining |

`coverage`: topic → `missing|thin|solid` (includes **research domain_checklist**).  
Init shows confidence, **domain**, top gaps, and options/pros-cons each `need_user` turn.  
Questions must trace to researched checklist items (**specloom-domain-research**).

## Responsibility split

| Actor | Does |
|-------|------|
| **specloom-init** | User I/O; Task planner only; translate results to NL |
| **specloom-planner** | Dialogue skills; Linear Overview/Phases/Briefs; Task git + advisory |

## Caps

Planner outer loop ≤15 per HANDOFF burst; init **re-invokes** planner after each user reply until `complete`/`blocked`.  
Dialogue continues until **confidence ≥ 0.99** (see **specloom-init-dialogue**). Soft stall report ~12 rounds without confidence gain. Rule-of-3 same blocker → `blocked`.

**complete requires:** automation-ready Overview + git + Phases + Briefs whose Ready set matches solid coverage.

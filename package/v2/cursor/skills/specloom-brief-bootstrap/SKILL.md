---
name: specloom-brief-bootstrap
description: >
  INTERNAL — specloom-planner. Coverage map; commit Overview/GitHub; Phases/Briefs; advisory.
  Not user-invokable.
disable-model-invocation: true
---

# Init bootstrap commit

## Coverage map (track; do not recite)

Must be **solid** (automation-ready detail) before Ready Briefs for that scope — loop dialogue until **≥99%** confidence:

`users | JTBD | success | non-goals | core_loop | platforms | auth_need | must_vs_later | languages | github | linear | planning_mode`

Plus product-class systems raised dynamically (e.g. MMO → trading/economy/progression/…). See **specloom-init-dialogue**.

Plus deep Overview sections from **specloom-init-foundation**.

## Languages

- **low:** ask until explicit  
- **high:** propose table; silence after show = accept  

Record on Overview:

```
# Engineering defaults
planning_mode: high|low
| Layer | Language / stack |
|-------|------------------|
| frontend | … |
| backend | … |
| database | … |
```

## Standards advisory (after languages)

Per layer present, Task once:

```json
{
  "type": "INIT_ADVISORY_HANDOFF",
  "from": "specloom-planner",
  "action": "read_standards_only",
  "layer": "frontend|backend|database",
  "language": "",
  "mode": "high|low"
}
```

Expect paths + must/forbid bullets. Attach to Overview + each work Brief Required Context. **No code writes.**

## Linear Overview

Create/update **Initiative** = full Overview (Linear — not GitHub). Labels: `brief`, `frontend`, `backend`, `database`.

## Git (specloom-git only)

```json
{
  "type": "GIT_HANDOFF",
  "from": "specloom-planner",
  "actions": ["ensure_repo", "ensure_default_branch", "ensure_ai_workflow_branch", "push_if_needed"],
  "github": {
    "owner": "",
    "name": "",
    "visibility": "private|public",
    "create_if_missing": true,
    "existing_remote": null
  }
}
```

Then Linear↔GitHub link or document steps.

## Phases + work Briefs

Use **specloom-brief-plan**. Almost always multiple Briefs per Phase.  
**Ready** only if no blocking Open Questions. Else **Backlog** + `blocks: Qx`.

## Done

- [ ] Overview on Linear  
- [ ] `planning_mode` + languages recorded  
- [ ] Advisory paths attached  
- [ ] GitHub + `ai-workflow`  
- [ ] Phases + Briefs created  
- [ ] Next: `@specloom-build` on first Ready (ongoing edits: `@specloom-brief`)

## Forbidden

- Static question-script only (must be dynamic dialogue)  
- Overview as files in GitHub app repo as SoT  
- Domain agents writing code  
- Replacing specloom-brief peer (init bootstraps; brief maintains)

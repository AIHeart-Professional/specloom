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
  "actions": [
    "ensure_repo",
    "ensure_default_branch",
    "ensure_ai_workflow_branch",
    "ensure_docs_repo",
    "push_if_needed"
  ],
  "github": {
    "owner": "",
    "name": "",
    "docs_name": "",
    "visibility": "private|public",
    "create_if_missing": true,
    "existing_remote": null
  }
}
```

`docs_name` default: `<name>-docs`. Then Linear↔GitHub link or document steps.

## Docs bootstrap

After git OK, Task **specloom-document** once:

```json
{
  "type": "DOCUMENT_HANDOFF",
  "from": "specloom-planner",
  "mode": "bootstrap",
  "app_repo_url": "",
  "docs_repo_url": "",
  "linear_overview_url": "",
  "product_name": "",
  "planning_mode": "high|low"
}
```

Expect stubs: README + architecture/system/workflow/specs per **specloom-document**.

## Phases + work Briefs

Use **specloom-brief-plan** + **specloom-queue**. Almost always multiple Briefs per Phase.  
Every Brief: `queue_order` + `depends_on` + `blocks`.  
Promote **one** queue head → `specloom:ready` (label fallback OK). Others Backlog.  
Optional: Task **specloom-document** `sync_brief` for each new Brief (or batch once).

## Done

- [ ] Overview on Linear  
- [ ] `planning_mode` + languages recorded  
- [ ] Advisory paths attached  
- [ ] GitHub app + `ai-workflow`  
- [ ] Docs repo + **specloom-document** bootstrap  
- [ ] Phases + **all** Briefs with Queue fields  
- [ ] Queue head Ready → init **Tasks specloom-build** (unless `manual`)

## Forbidden

- Static question-script only (must be dynamic dialogue)  
- Overview as files in GitHub app repo as SoT  
- Domain agents writing code  
- Blocking on custom Linear workflow states (use labels)  
- Replacing specloom-brief peer (init bootstraps; brief maintains)
- Fat v1 docs tree inside app repo

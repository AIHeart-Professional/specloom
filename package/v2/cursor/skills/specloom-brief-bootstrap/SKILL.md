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

`users | JTBD | success | non-goals | core_loop | platforms | auth_need | must_vs_later | languages | github | linear_team | linear | planning_mode`

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

## Language skills (required after languages)

Run **specloom-lang-ensure** for every locked stack slug:

- Create missing `code-{slug}` + `test-{slug}` under `~/.cursor/skills/` (research-backed from official docs)
- Stub standards `CORE.md` when standards repo writable
- Record skill names on Overview Standards paths table

**Do not** Task layer advisory until lang-ensure returns `ok` or `partial` with explicit gaps.

## Standards advisory (after lang-ensure)

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

## Linear team (required before Overview)

Run **specloom-linear-team**:

- One **Team per product** (not meta team Specloom)  
- Derive `team_name` + `team_key` (2–5 letters); confirm with user if ambiguous  
- Create via GraphQL if missing; else `need_user` to create in UI  
- Ensure SpecLoom labels on that team  

Do **not** create Overview/Phases/Briefs until `LINEAR_TEAM_RESULT.status = ok`.

## Linear Overview

On the **product team** only:

1. Project `Overview — {Product}` (+ Document = full Overview body)  
2. Record `team_name` / `team_key` / `team_id` in Overview  
3. Labels available: `brief`, `frontend`, `backend`, `database`, `specloom:*`

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

Use **specloom-brief-plan** + **specloom-queue**.  
Every Phase Project + every Issue: **`team` = product team** from Overview.  
Almost always multiple Briefs per Phase.  
Every Brief: `queue_order` + `depends_on` + `blocks`.  
Promote **one** queue head → `specloom:ready`. Others Backlog.  
Optional: Task **specloom-document** `sync_brief`.

## Done

- [ ] **Product Linear team** ensured (not Specloom default)  
- [ ] Overview on that team  
- [ ] `planning_mode` + languages recorded  
- [ ] **code-* / test-* skills ensured** (lang-ensure)  
- [ ] Advisory paths attached  
- [ ] GitHub app + `ai-workflow`  
- [ ] Docs repo + **specloom-document** bootstrap  
- [ ] Phases + **all** Briefs on product team  
- [ ] Queue head Ready → init **Tasks specloom-run** (unless `manual`)

## Forbidden

- Static question-script only (must be dynamic dialogue)  
- Overview as files in GitHub app repo as SoT  
- Domain agents writing code  
- Blocking on custom Linear workflow states (use labels)  
- Putting product work on **Specloom** meta-team  
- Replacing specloom-brief peer (init bootstraps; brief maintains)  
- Fat v1 docs tree inside app repo

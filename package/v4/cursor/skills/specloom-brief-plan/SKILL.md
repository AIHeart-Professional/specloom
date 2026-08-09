---
name: specloom-brief-plan
description: >
  INTERNAL — specloom-project-manager (+ planner). Phases + ordered work Briefs on product Linear team.
  Not user-invokable.
disable-model-invocation: true
---

# Phase / work-Brief planning

## Team

Read Overview **Linear** section → `team_name` / `team_id`.  
All Projects + Issues use that team. Never Specloom meta-team for product work.

## Create Phase (from Overview)

1. Read Overview Project/Document on product team  
2. Create Linear Project + Document (Reason · Goal · In/Out · Quality · Completion) with `setTeams: [team_name]` — Project name `P<n> — <name>`, numbered from P0 (**specloom-planning**)  
3. One Project **In Progress**; rest Planned  
4. Multiple Briefs per Phase — never one mega-Brief  

## Create Brief (from Phase)

Every Issue must be **implementation-complete** as a spec:

1. `team`: product `team_name` (Linear assigns `{KEY}-n`)  
2. Title: `P<phase>-<i>: <clear slice>` — naming rule in **specloom-planning** (e.g. `P0-1: Scene manager`)  
3. Labels: `brief` + layers (`frontend`|`backend`|`database`)  
4. Body sections:
   1. Reason  
   2. Goal  
   3. **Queue** (`queue_order`, `depends_on`, `blocks`) — **required**  
   4. Required Context (Code + Test Standards + **UX refs** + assets)  
   5. Requirements (incl. UX when mockups exist)  
   6. Task Directives (Language, layer, **Image Files**, **Asset Files**, source files)  
   7. Task checklist  
   8. Acceptance criteria  
5. `project`: Phase Project  

UX: load **specloom-ux-refs**. Link `ux/refs/…` and/or Linear attachments. Image Files ≠ Asset Files.

## Ordering (with specloom-queue)

1. Assign `queue_order` + `depends_on`  
2. Validate no cycles  
3. Promote **only queue head** → `specloom:ready`  
4. Others → Backlog  

## Edit rules

- Align to Phase In scope  
- Reason ≤ ~3 sentences  
- No invented architecture outside Overview/Phase  
- Stay on product team  

## Templates

`brief-body.md` · `phase-document.md`

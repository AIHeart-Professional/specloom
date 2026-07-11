---
name: specloom-work-creator-create-feature
description: >-
  INTERNAL - specloom-work-creator agent only. Author features in docs/features/. Not user-invokable.
disable-model-invocation: true
---

# SDD Create Feature

Creates **high-level WHAT** as **`docs/features/NNN_short-description.md`**. Specs (`docs/specs/`) are **low-level HOW** spawned from features.

Load **specloom-work-creator-docs-planning** and **specloom-phase-alignment** before acting.

## Four layers

| Layer | Location | Meaning |
|-------|----------|---------|
| **Phase** | `docs/phases/NN-Name/` | Product focus � in/out of scope |
| **Idea** | `docs/ideas/` | Backlog � **specloom-work-creator-create-idea** |
| **Feature** | `docs/features/` | Promoted WHAT � this skill |
| **Spec** | `docs/specs/` | HOW � one Spec Queue row each |

Flow: **Phase ? Idea ? Feature file ? Spec files ? implement + validate ? archive ? feature Complete ? phase Complete**.

## Feature vs Spec

| | Feature | Spec |
|---|---------|------|
| **Level** | High � WHAT | Low � HOW |
| **Location** | `docs/features/` | `docs/specs/` |
| **Naming** | `NNN_short-description.md` | `MMDDYY_short-description.md` |
| **Complete** | `docs/features/archived/` | `docs/specs/archived/` |

## Promotion rule

When promoting an idea, **never convert the idea file in place**.

1. Read source `docs/ideas/NNN_slug.md`
2. Create `docs/features/NNN_slug.md` from [feature-template.md](feature-template.md)
3. Set `source_idea` to the idea path
4. Validate/revise until format passes **qa-tester-feature-validation**
5. **promote_feature:** set `status: Ready` if deps met, else `Draft`
6. Move idea to `docs/ideas/archived/` with `status: promoted`

## Critical rules

1. **`priority` / `spec_id`:** 3-digit NNN (`001` = higher priority for spec creation)
2. **`phase`:** must match `activeProductPhase` in `active_work.json` (or user-named phase)
3. **Filename:** `NNN_short-description.md` matches `id` in frontmatter
4. **Dependencies:** list feature IDs; verify archived Complete before Ready
5. **Phase Alignment section:** required � map to phase In/Out of scope
6. **Spec Queue:** ordered table; next spec = lowest pending row
7. **Token Budget:** required in frontmatter and body
8. **Phase roster:** add feature row to parent `PHASE.md` Feature roster table
9. **docs/README.md:** update Feature Queue after create/promote

## Status values

| Status | Meaning |
|--------|---------|
| **Draft** | Needs answers, dependencies, or revision |
| **Ready** | Can spawn next Spec Queue row |
| **In Progress** | One or more active specs reference this feature |
| **Complete** | All criteria met, specs archived � move to `archived/` |

## Create workflow

```
- [ ] Step 1: Next feature NNN via specloom-work-creator-docs-planning
- [ ] Step 2: If from idea: read source idea file
- [ ] Step 3: Read active phase `PHASE.md`, architecture, decisions, knowledge, existing features
- [ ] Step 4: Fill feature-template.md ? docs/features/NNN_slug.md
- [ ] Step 5: Update docs/README.md Feature Queue
```

## During spec work

When spawning a spec from Spec Queue row:

1. Update **Spawned Specs** table
2. Mark Spec Queue row in progress
3. Set `status: In Progress`

## On feature complete

1. All Acceptance Criteria checked
2. All spawned specs archived
3. Token Budget synced
4. **specloom-update-knowledgebase** moves file to `docs/features/archived/`, `status: Complete`
5. Update phase **Feature roster** status; if last feature in phase ? trigger `archive_phase` check

## On phase complete

When all features for `phase` are archived:

1. Check phase **Completion criteria** in `PHASE.md`
2. **specloom-update-knowledgebase** `archive_phase` ? `docs/phases/archived/NN-Name/`
3. Update `docs/README.md` Phase Queue
4. User activates next phase via **specloom-work-creator** `create_phase` / activate

## Related

- Template: [feature-template.md](feature-template.md)
- Planning: **specloom-work-creator-docs-planning**
- Specs: **specloom-work-creator-create-spec**

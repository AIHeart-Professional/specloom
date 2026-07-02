---
name: specloom-work-creator-docs-structure
description: >-
  INTERNAL ? specloom-work-creator and sdd-records-keeper agents only. Doc tree reference. Not user-invokable.
disable-model-invocation: true
---

# SDD Docs Structure

Repo root `docs/`. One tree per repo.

## Ideas vs Features vs Specs

| | Idea | Feature | Spec |
|---|------|---------|------|
| Location | `docs/ideas/NNN_*.md` | `docs/features/NNN_*.md` | `docs/specs/MMDDYY_*.md` |
| Meaning | May be valuable | Approved outcome | Exactly how we build |
| Archive | `docs/ideas/archived/` | `docs/features/archived/` | `docs/specs/archived/` |

Skill: **specloom-work-creator-docs-planning** for queue rules.

Promotion (manual): user request ? **specloom-work-creator** `create_feature` ? **spec_creation** when feature is Ready.

## Token Budget (required)

Every **feature** and **spec** must include a **Token Budget** section:

| Field | When set |
|-------|----------|
| **Estimated tokens** | At creation |
| **Tokens used** | At sign-off / feature Complete |
| **Variance** | `tokens_used - estimated_tokens` |

- Specs: per-task breakdown; sum tasks ? spec totals
- Features: per-spec rollup; sum specs ? feature totals
- Positive variance = over budget; negative = under budget
- Frontmatter mirrors section: `estimated_tokens`, `tokens_used`, `token_variance`

Reject sign-off or feature archive if Used/Variance still `_pending_`.

## Work records (per-spec audit folder)

Path: `docs/specs/work-records/SPEC-{spec_id}/`

**Not a separate git repo** ? same project repo, permanent audit trail.

| File | When | Agents read? |
|------|------|--------------|
| **manifest.json** | First task ? updated each task | **Yes** ? specloom-validator, specloom-validator(work) |
| **work-done.md** | Appended each task | **No** ? humans / orchestrator summary only |
| implementation.md | After tests pass | No |
| testing.md | After tests pass | No |
| completion.json | After tests pass | No |

Schema: **records-keeper-work-records** skill. **sdd-records-keeper** writes manifest + work-done per task.

Created incrementally on first task. Finalized after **specloom-validator** passes.

## `docs/code/` ? universal skills + repo extensions

Universal standards live in user-level **code-*** skills (loaded by domain agents).

Repo `docs/code/` holds **project extensions only** (e.g. `react-native-ui.md`, `integrations/entra-id.md`).

| Skill | Agent |
|-------|-------|
| frontend-developer-typescript | sdd-frontend-developer, sdd-backend-developer |
| frontend-developer-react, frontend-developer-react-native | sdd-frontend-developer |
| backend-developer-python | sdd-backend-developer |
| database-developer-postgres | sdd-database-developer |

Spec **Required Context** lists repo extension paths. Skills load automatically per layer.

## `docs/code/` ? repo extensions (project-specific)

Universal standards: user-level **code-*** skills (see table above).

Repo holds **extensions only**:

```
docs/code/
  typescript/react-native-ui.md   # app UI patterns
  integrations/entra-id.md        # project integration config
  python/fastapi-routes.md        # stack-specific topics
```

- **Topic files** ? listed in spec **Required Context** only when needed
- Spec Task Code Standards reference repo extension paths; must ? Required Context
- Do not duplicate universal CORE content ? skills are source of truth

## Spec sections

Goal ? **Required Context** ? Requirements ? Task Directives ? **Changes** ? Validation ? **Sign-off** ? Completion Status

### Required Context

Explicit path table. **Only** listed paths may be read. Sources:

`code/`, `architecture/`, `knowledge/`, `images/` (design refs), `images/assets/` (application assets), `workflows/`, `decisions/`, `specs/archived/`, parent feature (`docs/features/NNN_*.md`).

## Tree

| Path | Purpose |
|------|---------|
| `docs/ideas/` | Backlog ideas |
| `docs/ideas/archived/` | Promoted ideas |
| `docs/features/` | Active WHAT |
| `docs/features/archived/` | Complete features |
| `docs/specs/` | Active HOW |
| `docs/specs/archived/` | Complete specs |
| `docs/specs/work-records/` | Per-spec audit (`SPEC-{id}/manifest.json`, `work-done.md`, ?) |
| `docs/code/` | Coding styles (CORE + topic `.md`) |
| `docs/images/` | Design/reference images only, except `docs/images/assets/` |
| `docs/images/assets/` | Application assets to copy/import/use in the app |
| `docs/architecture/` | System shape |
| `docs/decisions/` | Durable Q&A ? search before asking user |
| `docs/workflows/` | Execution rules |
| `docs/automation/` | Loops, state, reports |
| `docs/knowledge/` | App memory |

## Skills (internal ? agent-loaded)

| Skill | Loaded by |
|-------|-----------|
| **specloom-work-creator-docs-planning** | **sdd-workflow-coordinator**, **specloom-work-creator**, **specloom-validator**, **sdd-records-keeper** |
| **specloom-work-creator-create-idea/feature/spec** | **specloom-work-creator** |
| **specloom-work-creator-workflow-setup** | **specloom-work-creator** (bootstrap) |
| **specloom-work-creator-docs-structure** | **specloom-work-creator**, **sdd-records-keeper** |
| **records-keeper-work-records** | **sdd-records-keeper**, **specloom-validator**, **specloom-validator** |
| **sdd-work/feature/spec-validation** | **specloom-validator** |
| **project-lead-protocol** | **sdd-workflow-coordinator** |
| **workflow-coordinator-loops** | **sdd-workflow-coordinator** |
| **system-advisor-reference** | **sdd-system-advisor** |
| **system-advisor-reference** | **sdd-system-advisor** (user asks **specloom-work-creator**) |

## Task status

Each task: `Status: Ready | Blocked | Complete`. Coordinator runs **Ready** only.

## Validation pipeline

```
tasks Complete ? specloom-validator(work) ?3 ? specloom-validator(test) ?3 ? finalize work-records ? sign-off ? git
```

Draft: **specloom-work-creator** ? **specloom-validator**(feature|spec) ?3.

---
name: sdd-docs-structure
description: >-
  INTERNAL — sdd-docs and sdd-updates agents only. Doc tree reference. Not user-invokable.
---


# SDD Docs Structure

Repo root `docs/`. One tree per repo.

## Ideas vs Features vs Specs

| | Idea | Feature | Spec |
|---|------|---------|------|
| Location | **GitHub Issue** (`sdd:idea`) | **GitHub Issue** (`sdd:feature`) | `docs/specs/MMDDYY_*.md` |
| Meaning | May be valuable | Approved outcome | Exactly how we build |
| Archive | Close + `sdd:status:promoted` | Close + `sdd:status:complete` | `docs/specs/archived/` |

Config: `docs/automation/github-planning.json`. Skill: **sdd-github-planning**.

Promotion: earliest idea → **feature_definition_loop** → feature → **spec_creation_loop** → spec → **task_execution_loop**.

## Token Budget (required)

Every **feature** and **spec** must include a **Token Budget** section:

| Field | When set |
|-------|----------|
| **Estimated tokens** | At creation |
| **Tokens used** | At sign-off / feature Complete |
| **Variance** | `tokens_used − estimated_tokens` |

- Specs: per-task breakdown; sum tasks → spec totals
- Features: per-spec rollup; sum specs → feature totals
- Positive variance = over budget; negative = under budget
- Frontmatter mirrors section: `estimated_tokens`, `tokens_used`, `token_variance`

Reject sign-off or feature archive if Used/Variance still `_pending_`.

## Work records (per-spec audit folder)

Path: `docs/specs/work-records/SPEC-{spec_id}/`

**Not a separate git repo** — same project repo, permanent audit trail.

| File | When | Agents read? |
|------|------|--------------|
| **manifest.json** | First task → updated each task | **Yes** — sdd-validation, sdd-validation(work) |
| **work-done.md** | Appended each task | **No** — humans / orchestrator summary only |
| implementation.md | After tests pass | No |
| testing.md | After tests pass | No |
| completion.json | After tests pass | No |

Schema: **sdd-work-records** skill. **sdd-updates** writes manifest + work-done per task.

Created incrementally on first task. Finalized after **sdd-validation** passes.

## `docs/code/` — universal skills + repo extensions

Universal standards live in user-level **code-*** skills (loaded by domain agents).

Repo `docs/code/` holds **project extensions only** (e.g. `react-native-ui.md`, `integrations/entra-id.md`).

| Skill | Agent |
|-------|-------|
| code-typescript | sdd-frontend, sdd-backend |
| code-react, code-react-native | sdd-frontend |
| code-python | sdd-backend |
| code-postgres | sdd-database |

Spec **Required Context** lists repo extension paths. Skills load automatically per layer.

## `docs/code/` — repo extensions (project-specific)

Universal standards: user-level **code-*** skills (see table above).

Repo holds **extensions only**:

```
docs/code/
  typescript/react-native-ui.md   # app UI patterns
  integrations/entra-id.md        # project integration config
  python/fastapi-routes.md        # stack-specific topics
```

- **Topic files** — listed in spec **Required Context** only when needed
- Spec Task Code Standards reference repo extension paths; must ⊆ Required Context
- Do not duplicate universal CORE content — skills are source of truth

## Spec sections

Goal · **Required Context** · Requirements · Task Directives · **Changes** · Validation · **Sign-off** · Completion Status

### Required Context

Explicit path table. **Only** listed paths may be read. Sources:

`code/`, `architecture/`, `knowledge/`, `images/` (design refs), `images/assets/` (application assets), `workflows/`, `decisions/`, `specs/archived/`, parent feature (GitHub issue or legacy path).

## Tree

| Path | Purpose |
|------|---------|
| `docs/automation/github-planning.json` | GitHub repo + labels for ideas/features |
| `docs/specs/` | Active HOW |
| `docs/specs/archived/` | Complete specs |
| `docs/specs/work-records/` | Per-spec audit (`SPEC-{id}/manifest.json`, `work-done.md`, …) |
| `docs/code/` | Coding styles (CORE + topic `.md`) |
| `docs/images/` | Design/reference images only, except `docs/images/assets/` |
| `docs/images/assets/` | Application assets to copy/import/use in the app |
| `docs/architecture/` | System shape |
| `docs/decisions/` | Durable Q&A — search before asking user |
| `docs/workflows/` | Execution rules |
| `docs/automation/` | Loops, state, reports |
| `docs/knowledge/` | App memory |

## Skills (internal — agent-loaded)

| Skill | Loaded by |
|-------|-----------|
| **sdd-github-planning** | **sdd-loop**, **sdd-docs**, **sdd-validation**, **sdd-updates** |
| **sdd-create-idea/feature/spec** | **sdd-docs** |
| **sdd-workflow-setup** | **sdd-docs** (bootstrap) |
| **sdd-docs-structure** | **sdd-docs**, **sdd-updates** |
| **sdd-work-records** | **sdd-updates**, **sdd-validation**, **sdd-validation** |
| **sdd-work/feature/spec-validation** | **sdd-validation** |
| **sdd-orchestrator-protocol** | **sdd-loop** |
| **sdd-automation-loops** | **sdd-loop** |
| **sdd-system-reference** | **sdd-help** |
| **sdd-system-reference** | **sdd-help** (user asks **sdd-orchestrator**) |

## Task status

Each task: `Status: Ready | Blocked | Complete`. Coordinator runs **Ready** only.

## Validation pipeline

```
tasks Complete → sdd-validation(work) ×3 → sdd-validation(test) ×3 → finalize work-records → sign-off → git
```

Draft: **sdd-docs** → **sdd-validation**(feature|spec) ×3.

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `sdd-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

---
name: sdd-workflow-setup
description: >-
  INTERNAL — sdd-docs agent only. Bootstrap repo docs/ tree and automation stubs.
  Not user-invokable.
---


# SDD Workflow Setup

Scaffolds root-level SDD + Loop Engineering document tree.

## When To Use

- New project needs SDD Loop Engineering
- User asks to "set up SDD", "create docs structure", "add automation loops"
- Migrating to dated specs + Codex automations

## Prerequisites

Confirm (if unknown):

1. Project root path
2. Build/test/dev commands for `AGENTS.md`
3. Languages in use (for `docs/code/` **extensions** + which **code-*** / **test-*** skills apply)
4. Stack (for `docs/architecture/` stubs)

Universal coding + testing standards: user-level `~/.agents/skills/code-*` and `test-*` — **not** copied into repo.

## Scaffold Workflow

```
- [ ] Step 1: Create directory tree
- [ ] Step 2: Write AGENTS.md (include test commands)
- [ ] Step 3: Write docs/README.md
- [ ] Step 4: Copy automation/ (loops, state, reports)
- [ ] Step 5: Write stubs (architecture, decisions, knowledge, code extensions, workflows)
- [ ] Step 6: Copy work-records templates
- [ ] Step 7: Update .gitignore
- [ ] Step 8: Create local-only folders
- [ ] Step 9: Verify + commit
```

### Step 1: Directory Tree

Per [structure-tree.md](structure-tree.md). **Always repo root.**

```
docs/automation/github-planning.json
docs/specs/
docs/specs/archived/
docs/specs/work-records/
docs/automation/loops/
docs/automation/state/
docs/automation/reports/
docs/images/
docs/images/assets/
docs/code/
docs/architecture/
docs/decisions/
docs/workflows/
docs/knowledge/
automation_inputs/
automation_outputs/
local_data/
```

### Step 2: AGENTS.md

Copy [AGENTS.template.md](AGENTS.template.md). Fill:

- Build/lint/typecheck commands
- **Unit, integration, E2E test commands** (required for **sdd-validation** test gate)
- Coverage command flags

### Step 3: docs/README.md

Copy [docs-readme.template.md](docs-readme.template.md).

### Step 4: Automation (Loop Engineering)

Copy entire [automation/](automation/) folder to `docs/automation/`:

| Source | Destination |
|--------|-------------|
| `automation/README.md` | `docs/automation/README.md` |
| `automation/git-workflow.md` | `docs/automation/git-workflow.md` |
| `automation/cursor-schedules.md` | `docs/automation/cursor-schedules.md` |
| `automation/github-planning.template.json` | `docs/automation/github-planning.json` |
| `automation/loops/*.md` | `docs/automation/loops/` |
| `ideas/idea-template.md` | Deprecated — use **sdd-github-planning** issue template |
| `automation/state/active_work.json` | `docs/automation/state/active_work.json` |
| `automation/state/blocked_work.json` | `docs/automation/state/blocked_work.json` |
| `automation/reports/*.md` | `docs/automation/reports/` |

Loops: coordinator, feature_definition, spec_creation, task_execution, validation, review.

### Step 5: Stubs

| File | Content |
|------|---------|
| `docs/workflows/daily-spec-automation.md` | [daily-spec-automation.template.md](daily-spec-automation.template.md) |
| `docs/workflows/agent-orchestration.md` | Point to user-level SDD + **sdd-orchestrator** |
| `docs/architecture/*.md` | System stubs |
| `docs/decisions/*.md` | Empty Q&A tables |
| `docs/knowledge/*.md` | Memory stubs |
| `docs/code/README.md` | [code/README.template.md](code/README.template.md) — extensions only |

**Do not** scaffold `docs/code/{lang}/CORE.md` — universal standards are **code-*** skills.

### Step 6: Work-records templates

Copy [work-records/](work-records/) to `docs/specs/work-records/`:

| Template | Purpose |
|----------|---------|
| `manifest.template.json` | Machine-readable work done (agents read) |
| `work-done.template.md` | Human log (agents never read) |
| `implementation.template.md` | After test validation passes |
| `testing.template.md` | From VALIDATION_RESULT.test_run |
| `completion.template.json` | Sign-off metadata |
| `README.md` | Lifecycle docs |

### Step 7: .gitignore

```
automation_inputs/
automation_outputs/
local_data/
docs/images/private/
# keep docs/images/assets/ committed when assets are app inputs
```

`docs/automation/state/` is **committed**.

### Step 8–9: Verify

- `docs/images/` exists for design/reference images
- `docs/images/assets/` exists for application assets
- 6 loop files in `docs/automation/loops/`
- `active_work.json` has `workValidationAttempts`, `testingAttempts`
- `docs/automation/github-planning.json` present
- Work-records templates present
- `gh auth status` succeeds (for planning issues)
- `AGENTS.md` has test commands
- Commit before Codex automations reference paths

## Gate order (orchestrator)

```
tasks → manifest per task → sdd-validation(work)×3 → sdd-validation(test)×3 → finalize work-records → sign-off → git
```

## Models

| Layer | Location | Skill |
|-------|----------|-------|
| Ideas | GitHub Issues | sdd-create-idea + sdd-github-planning |
| Features | GitHub Issues | sdd-create-feature + sdd-github-planning |
| Specs | `docs/specs/` | sdd-create-spec |
| Work done | `docs/specs/work-records/SPEC-{id}/manifest.json` | sdd-work-records |
| Loops | `docs/automation/loops/` | sdd-automation-loops |
| Execute | — | **sdd-orchestrator** → sub-agents |
| Validate + test | — | **sdd-validation** (work + test types) |

## Multi-repo

One root `docs/` per repo. Universal skills in `~/.agents/skills/`.

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `sdd-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

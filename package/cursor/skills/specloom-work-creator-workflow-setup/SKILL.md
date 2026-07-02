---
name: specloom-work-creator-workflow-setup
description: >-
  INTERNAL — specloom-work-creator agent only. Bootstrap repo docs/ tree and automation stubs.
  Not user-invokable.
disable-model-invocation: true
---

# SDD Workflow Setup

Scaffolds root-level SDD + Loop Engineering document tree.

## When To Use

- New project needs SDD Loop Engineering
- User asks to "set up SDD", "create docs structure", "add automation"
- Migrating to dated specs + Cursor Automations

## Prerequisites

Confirm (if unknown):

1. Project root path
2. Build/test/dev commands for `AGENTS.md`
3. Languages in use (for `docs/code/` extensions)
4. Stack (for `docs/architecture/` stubs)

## Scaffold Workflow

```
- [ ] Step 1: Create directory tree
- [ ] Step 2: Write AGENTS.md
- [ ] Step 3: Write docs/README.md
- [ ] Step 4: Copy automation/ stubs
- [ ] Step 5: Write stubs (architecture, decisions, knowledge, code, workflows)
- [ ] Step 6: Copy ideas/, features/, work-records templates
- [ ] Step 7: Update .gitignore
- [ ] Step 8: Create local-only folders
- [ ] Step 9: Verify + commit
```

### Step 1: Directory Tree

Per [structure-tree.md](structure-tree.md). **Always repo root.**

```
docs/ideas/
docs/ideas/archived/
docs/features/
docs/features/archived/
docs/specs/
docs/specs/archived/
docs/specs/work-records/
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

Copy [AGENTS.template.md](AGENTS.template.md). Fill build/lint/test commands.

### Step 3: docs/README.md

Copy [docs-readme.template.md](docs-readme.template.md).

### Step 4: Automation

Copy entire [automation/](automation/) folder to `docs/automation/`:

| Source | Destination |
|--------|-------------|
| `automation/README.md` | `docs/automation/README.md` |
| `automation/git-workflow.md` | `docs/automation/git-workflow.md` |
| `automation/cursor-schedules.md` | `docs/automation/cursor-schedules.md` |
| `automation/state/active_work.json` | `docs/automation/state/active_work.json` |
| `automation/state/blocked_work.json` | `docs/automation/state/blocked_work.json` |
| `automation/reports/*.md` | `docs/automation/reports/` |

Workflow procedures: global **workflow-coordinator-*** skills (not repo markdown).

### Step 5: Ideas + features stubs

| Source | Destination |
|--------|-------------|
| `ideas/README.md` | `docs/ideas/README.md` |
| `ideas/idea-template.md` | `docs/ideas/idea-template.md` |
| `features/README.md` | `docs/features/README.md` |

Feature body template: **specloom-work-creator-create-feature** ? `feature-template.md`.

### Step 6: Work-records templates

Copy [work-records/](work-records/) to `docs/specs/work-records/`.

### Step 7: .gitignore

```
automation_inputs/
automation_outputs/
local_data/
docs/images/private/
```

`docs/automation/state/` is **committed**.

### Step 8–9: Verify

- `active_work.json` uses `workflow` id (e.g. `coordinator`)
- Idea/feature folders exist
- Work-records templates present
- `AGENTS.md` has test commands
- Commit before Cursor Automations reference paths

## Gate order

```
tasks ? manifest ? qa-tester(work)×3 ? qa-tester(test)×3 ? finalize ? auto_closeout ? git
```

## Models

| Layer | Location | Skill |
|-------|----------|-------|
| Ideas | `docs/ideas/` | specloom-work-creator-create-idea + specloom-work-creator-docs-planning |
| Features | `docs/features/` | specloom-work-creator-create-feature + specloom-work-creator-docs-planning |
| Specs | `docs/specs/` | specloom-work-creator-create-spec |
| Work done | `docs/specs/work-records/SPEC-{id}/manifest.json` | records-keeper-work-records |
| Workflows | Global **workflow-coordinator-*** skills | workflow-coordinator-loops |
| Execute | — | **specloom-work-creator** ? sub-agents |

# SDD Loop Automation

Workflow procedures live in **global skills** (`workflow-coordinator-*`), not repo markdown.

**specloom-work-creator** is user entry. Ideas/features live in `docs/ideas/` and `docs/features/`.

## Repo automation folder

```
docs/automation/
  state/active_work.json
  state/blocked_work.json
  reports/
  cursor-schedules.md
  README.md
```

## Workflow ids

| id | Skill |
|----|-------|
| `coordinator` | workflow-coordinator-coordinator |
| `task_execution` | workflow-coordinator-task-execution |
| `spec_creation` | workflow-coordinator-spec-creation |
| `feature_definition` | workflow-coordinator-feature-definition (manual only) |
| `validation` | workflow-coordinator-validation |
| `auto_closeout` | workflow-coordinator-auto-closeout |

Index: **workflow-coordinator-loops** skill.

Git base: **`ai-workflow`**.

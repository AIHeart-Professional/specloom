# SDD Loop Automation

Workflow procedures live in **global skills** (`specloom-worker-*`), not repo markdown.

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
| `coordinator` | specloom-orchestrator-session |
| `task_execution` | specloom-worker-task-execution |
| `spec_creation` | specloom-work-creator-create-spec |
| `feature_definition` | specloom-work-creator-create-feature (manual only) |
| `validation` | specloom-validator-orchestration |
| `auto_closeout` | specloom-update-knowledgebase |

Index: **specloom-worker-loops** skill.

Git base: **`ai-workflow`**.

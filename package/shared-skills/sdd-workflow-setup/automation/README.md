# SDD Loop Automation

Codex automations read loops from `docs/automation/loops/`, update state, write reports, and use **`ai-workflow`** git model.

## Three layers

| Layer | Location |
|-------|----------|
| Idea | GitHub Issue (`sdd:idea`) |
| Feature | GitHub Issue (`sdd:feature`) |
| Spec | `docs/specs/` |

Config: `docs/automation/github-planning.json`. Skill: **sdd-github-planning**.

## Git

All AI work branches from **`ai-workflow`**. Spec branches: `feature/<spec-slug>`.

See [git-workflow.md](git-workflow.md).

## Codex Automation mapping

| Automation | Schedule (example) | Loop | Git base |
|------------|-------------------|------|----------|
| Daily Coordinator | Daily 8 AM | coordinator_loop.md | **`ai-workflow`** |
| Task Execution | Weekdays every 2h | task_execution_loop.md | **`ai-workflow`** -> `feature/*` |
| Nightly Validation | Daily 11 PM | validation_loop.md | **`ai-workflow`** |

Set **repository branch** to **`ai-workflow`** in each Codex Automation.

Prompts: [cursor-schedules.md](cursor-schedules.md)

## Loops

| File | Purpose |
|------|---------|
| `coordinator_loop.md` | Route one action; finish approved work before ideas |
| `feature_definition_loop.md` | Earliest idea issue → feature issue |
| `spec_creation_loop.md` | Feature Spec Queue row → spec draft |
| `task_execution_loop.md` | One approved spec task + code |
| `validation_loop.md` | Prove implementation |
| `review_loop.md` | Approval gate |

## Loop routing

```
coordinator_loop → task_execution | spec_creation | review | validation | feature_definition
```

Skill: **sdd-automation-loops**. GitHub planning: **sdd-github-planning**. Git: **sdd-github**.

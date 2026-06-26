# Codex Automation Prompts

Draft prompts for Codex automations. **Set git base branch to `ai-workflow`** in each automation.

Commit `docs/automation/` before referencing paths in automations.

See [git-workflow.md](git-workflow.md) for branch naming.

## Daily Coordinator

**Name:** SDD Daily Coordinator  
**Schedule:** Daily 8:00 AM (`0 8 * * *`)  
**Git base branch:** `ai-workflow`

**Prompt:**

```
Read and execute docs/automation/loops/coordinator_loop.md.

Use skill sdd-automation-loops and sdd-github-planning. Read docs/automation/state/active_work.json and docs/automation/state/blocked_work.json. Query GitHub for ideas/features per docs/automation/github-planning.json. Update state and docs/automation/reports/daily_summary.md. Route to one loop only. Prefer finishing approved work before promoting backlog ideas. Stop after one bounded action. All git work uses ai-workflow as base per docs/automation/git-workflow.md.
```

## Task Execution

**Name:** SDD Task Execution  
**Schedule:** Weekdays 9/11/1/3/5 PM (`0 9,11,13,15,17 * * 1-5`)  
**Git base branch:** `ai-workflow`

**Prompt:**

```
Read docs/automation/state/active_work.json. If workflow is docs/automation/loops/task_execution_loop.md and humanApprovalRequired is false, execute docs/automation/loops/task_execution_loop.md using sdd-automation-loops and sdd-orchestrator.

Git: checkout ai-workflow, create/push spec branch `feature/<spec-slug>` before spec authoring, link it on the parent feature issue, create PR after validation passes, merge to ai-workflow, push, delete branch. See docs/automation/git-workflow.md.

Stop after one task or when blocked/awaiting review.
```

## Nightly Validation

**Name:** SDD Nightly Validation  
**Schedule:** Daily 11:00 PM (`0 23 * * *`)  
**Git base branch:** `ai-workflow`

**Prompt:**

```
Read docs/automation/state/active_work.json. If active work exists in validation or post-implementation phase, execute docs/automation/loops/validation_loop.md using sdd-automation-loops. Update docs/automation/reports/latest_validation.md and active_work.json. Max 3 retries. Stop when validation passes, fails with correction needed, or human review required.
```

## Setup

1. Commit `docs/automation/` (including `github-planning.json`) to repo
2. Create remote branch **`ai-workflow`** from last stable AI snapshot
3. Codex automations → set **repository branch** to **`ai-workflow`**
4. Save each automation; manual test before enabling schedule

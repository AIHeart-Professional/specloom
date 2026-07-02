---
name: specloom-git-workflow
description: >-
  INTERNAL — specloom-git only. Git branch workflow, naming, push/merge rules.
  Not user-invokable.
disable-model-invocation: true
---

# SpecLoom Git Workflow

**Base branch:** `ai-workflow` — never `main` for automation.

## Orchestrator session bookends

Every session owner orchestrator:

1. **`task_start`** — fetch, checkout `ai-workflow`, pull, create **new** branch, push upstream
2. All work on that branch only
3. **`task_push`** — commit session changes before merge
4. **`merge_to_ai_workflow`** — merge to `ai-workflow`, push — **required before user reply**

Skip all git steps when orchestrator returns `no_work`.

Delegated sub-agents use parent's `git_task_branch` — no start/merge.

## Branch naming

```
task/<specId>-<taskSeq>-<taskSlug>
```

| Part | Rule |
|------|------|
| `specId` | 3-digit feature NNN or spec `spec_id` |
| `taskSeq` | Task ID padded: `T1`→`001` |
| `taskSlug` | Kebab-case from task title |

## task_start

1. `git fetch origin ai-workflow`
2. `git checkout ai-workflow` (create tracking if missing)
3. `git pull origin ai-workflow`
4. `git checkout -b task/<spec>-<task>-<name>`
5. Commit if docs-only setup; **`git push -u origin HEAD`**

## task_push

1. Stay on `git_task_branch`
2. Stage changes (no secrets, no `local_data/`)
3. Conventional commit referencing spec + task
4. **`git push origin HEAD`**

## merge_to_ai_workflow

1. `git fetch origin`
2. `git checkout ai-workflow`
3. `git pull origin ai-workflow`
4. `git merge --no-ff <git_task_branch>`
5. Conflicts → `status: blocked`
6. **`git push origin ai-workflow`**

## docs_only

Docs/planning changes: still branch from `ai-workflow`. Used by **specloom-work-creator**.

## open_pr

Use `gh pr create` when handoff requests PR instead of direct merge.

## Safety

- Never force-push `ai-workflow` or `main`
- Never commit `.env`, credentials, `local_data/`

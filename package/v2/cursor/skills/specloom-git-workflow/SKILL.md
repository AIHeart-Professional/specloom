---
name: specloom-git-workflow
description: >
  INTERNAL — specloom-git + peers. Bootstrap repo/ai-workflow; task branches; PRs. Not user-invokable.
disable-model-invocation: true
---

# Git workflow

Base for SpecLoom work: **`ai-workflow`** (never merge SpecLoom task work to `main` as integration base).

## Bootstrap (specloom-git from GIT_HANDOFF)

| Action | Do |
|--------|-----|
| `ensure_repo` | If `create_if_missing`: `gh repo create <owner>/<name> --<visibility> --confirm` (add `--source=.` if local path). Else verify `gh repo view`. Set remote `origin`. |
| `ensure_default_branch` | Prefer `main` as default. Commit initial README if empty repo requires it. |
| `ensure_ai_workflow_branch` | From default: `git checkout -B ai-workflow` · `git push -u origin ai-workflow`. Create branch on GitHub if needed. |
| `push_if_needed` | Push default + `ai-workflow` when local commits exist. |

Idempotent: skip create if repo/branch already exists and matches.

Auth: `gh auth status` must be ok; else fail `GIT_RESULT` with clear error.

## Task work (build/test/validate peers — self-run shell OK)

| Step | Action |
|------|--------|
| start | fetch · checkout `ai-workflow` · pull · branch `task/<KEY>-<slug>` |
| during | focused commits; no secrets |
| push | push `-u` · PR → `ai-workflow` · link on Linear Issue |
| done | merge when policy says · delete task branch |

## Peer Task rules

- **specloom-planner → specloom-git** allowed for bootstrap `GIT_HANDOFF` only  
- Other peers: run task-branch steps themselves; do **not** Task specloom-git unless user said so

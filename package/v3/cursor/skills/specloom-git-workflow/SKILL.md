---
name: specloom-git-workflow
description: >
  INTERNAL — specloom-git + peers. Bootstrap app + docs repos; app work on ai-workflow only.
  Not user-invokable.
disable-model-invocation: true
---

# Git workflow

## Rule (non-negotiable) — app repo

**Every** build / test / validate app code change runs on **`ai-workflow` only**.

- Cloud Automations pin **one** app branch: `ai-workflow`  
- **Never** create `task/*` for SpecLoom pipeline  
- `main` (app) = production release only  

## Docs repo

Separate GitHub repo `<app>-docs`. All docs commits on **`main`**.  
Automations that update docs pin **`main`**. See **specloom-document**.

## Bootstrap (specloom-git from GIT_HANDOFF)

| Action | Do |
|--------|-----|
| `ensure_repo` | Create/verify **app** repo; set `origin`. |
| `ensure_default_branch` | Prefer `main`. Initial README if empty. |
| `ensure_ai_workflow_branch` | `checkout -B ai-workflow` · push `-u`. |
| `ensure_docs_repo` | Create/verify **`<app>-docs`** (same owner/visibility). Prefer `main` only. Return `docs_repo_url`. Do **not** invent content — **specloom-document** `bootstrap` writes tree. |
| `push_if_needed` | Push app `main` + `ai-workflow`; push docs `main` if commits exist. |

Idempotent. Auth: `gh auth status` ok or fail `GIT_RESULT`.

`GIT_RESULT` may include:

```json
{
  "type": "GIT_RESULT",
  "status": "ok|failed",
  "repo_url": "",
  "docs_repo_url": "",
  "default_branch": "main",
  "ai_workflow_ready": false,
  "commands": [],
  "error": null
}
```

## Peer work — app (build / test / validate)

```
git fetch origin
git checkout ai-workflow
git pull --ff-only origin ai-workflow
```

Commit on `ai-workflow` · push · Linear comment with SHAs. No task-branch PRs.

## Peer work — docs (specloom-document)

```
git fetch origin
git checkout main
git pull --ff-only origin main
```

Commit · push `main`.

## Resume

App SoT branch = `ai-workflow`. Merge stray `task/*` into it, then delete.  
Docs SoT branch = `main`.

## Peer Task rules

- **specloom-project-manager → specloom-git** for bootstrap `GIT_HANDOFF`  
- **specloom-document → specloom-git** only for `ensure_docs_repo` if missing  
- Never `git checkout -b task/…` for SpecLoom app work

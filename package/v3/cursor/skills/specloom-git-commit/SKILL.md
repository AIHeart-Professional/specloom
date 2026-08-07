---
name: specloom-git-commit
description: >
  INTERNAL — specloom-repository. Commit and push on a Brief work branch. Message format,
  staging rules, what never gets committed. Not user-invokable.
disable-model-invocation: true
---

# Commits on a work branch

## Branch

Only `specloom/<brief-key>`. Never commit to `ai-workflow` or `main` — those arrive by merge.

## Staging

Stage the files in the gate result's `changes[]`. Never `git add -A`.

**Never stage:**

- `.env`, `.env.*`, anything matched by the repo's secret allowlist patterns
- `local_data/`, `node_modules/`, `target/`, `dist/`, `.venv/`
- Coverage output, editor state, OS metadata
- Binary media over 1 MB outside `ux/refs/` — those belong in the docs repo

A file staged against this list is a `critical` finding and the commit is abandoned.

## Message

```
<type>(<brief-key>): <summary>

<what changed and why, wrapped at 72>

Gate: implementation | tester
Brief: <linear-url>
```

`type` is `feat`, `fix`, `refactor`, `test`, `chore` or `docs`. Summary is imperative, lower
case, no trailing period.

One commit per green gate, not per file. Gate 1 produces the feature commit; gate 3 produces the
test commit. Security produces none — it never edits.

## Push

`git push origin HEAD`. On rejection, fetch and rebase the work branch — **never** force-push a
branch with an open PR unless the rebase is a fast-forward of your own commits.

## Output

```json
{ "type":"GIT_RESULT","from":"specloom-repository","state":"green|red",
  "action":"commit","branch":"","sha":"","files":0,"issues":[] }
```

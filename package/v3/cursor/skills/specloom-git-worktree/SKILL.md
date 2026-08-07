---
name: specloom-git-worktree
description: >
  INTERNAL — specloom-repository and specloom-loop. Isolated worktrees when parallel N is on.
  Unused at the single-head default. Not user-invokable.
disable-model-invocation: true
---

# Worktrees

Only relevant when the product opts into `parallel N`. At the default single Ready head there is
one Loop and one branch; a worktree adds nothing.

## Why

Two Loops in one checkout will overwrite each other's files. A worktree gives each its own
working directory over the same object store.

```bash
git worktree add ../.specloom-wt/<brief-key> -b specloom/<brief-key> <base>
```

## Rules

| Rule | Reason |
|------|--------|
| One worktree per Brief, named for the Brief key | traceability when several are live |
| Created by **Repository**, never by a Loop | Loops do not own git |
| Under `../.specloom-wt/`, outside the main checkout | keeps the product tree clean |
| Removed on Brief completion **or** abandonment | orphans accumulate silently |
| Never two worktrees on one branch | git refuses, and the error is obscure |

## Cleanup

```bash
git worktree remove ../.specloom-wt/<brief-key>
git worktree prune
```

Run on green **and** on red. A failed Brief leaves its branch for inspection but not its
worktree — the branch is on the remote, the worktree is local clutter.

## Still serialized

Worktrees allow parallel *building*. They do not allow parallel *merging*. Repository serializes
every merge into `ai-workflow` regardless of how many worktrees are live. See
**specloom-git-merge-trunk**.

---
name: specloom-git-merge-trunk
description: >
  INTERNAL — specloom-repository. Stacked PRs per Brief, merge_stack into ai-workflow,
  and revert_stack when a merged set proves wrong. Not user-invokable.
disable-model-invocation: true
---

# Stacked PRs → `ai-workflow`

## Per Brief green, mid run_set

1. Push `specloom/<brief-key>`
2. Open or update the PR
   - first Brief: `base = ai-workflow`
   - later Brief: `base = specloom/<previous-brief>`
3. PR body links the Linear Brief and states stack position `n of N`
4. **Do not** merge until the Orchestrator requests `merge_stack`

## merge_stack — run_set green

```
1. git fetch origin
2. for i = 1..N in order:
     merge specloom/<brief-i> into ai-workflow
     record the merge sha
3. git push origin ai-workflow
4. close the stacked PRs as merged
5. return the shas, in order
```

Bottom-up, in dependency order, never skipping. Conflicts → stop, report `file:line`, leave
`ai-workflow` as it was. Never force-push the trunk.

## revert_stack — new in v3

v2 could merge a five-Brief stack and had no way to undo it.

```
revert_stack:
  shas: ["a1b2c3d", "e4f5a6b"]     # from merge_stack, in merge order
  scope: all | from:<sha>
```

```
1. git fetch origin && git checkout ai-workflow && git pull
2. revert in REVERSE merge order:
     git revert -m 1 <sha>          # -m 1: keep the trunk parent
3. push ai-workflow
4. reopen the affected PRs, comment with the revert shas
5. return the revert shas
```

| Rule | Reason |
|------|--------|
| Reverse order, always | reverting Brief 2 before Brief 3 conflicts when 3 built on 2 |
| `-m 1` on every revert | these are merge commits; without it git cannot pick a parent |
| Revert, never reset or force-push | `ai-workflow` is shared; history stays intact |
| A conflicted revert stops the whole operation | a half-reverted stack is worse than the bad merge |

Reverting Brief 2 of 3 alone is not supported — later Briefs sit on it. Use `scope: from:<sha>`
to revert it and everything after.

Linear stays Done. A revert is a code decision; PM reopens the Brief only if the Orchestrator
says so.

## Single-Brief run_set

Same as a stack of one: PR into `ai-workflow`, merge on green, `revert_stack` with one sha.

## Serialization

One merge into `ai-workflow` at a time, however many Loops or worktrees are live. Loops never
push the trunk.

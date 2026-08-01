---
name: specloom-git-merge-trunk
description: >
  INTERNAL — Repository. Stacked PRs per Brief; merge stack into ai-workflow when
  run set completes. See GitHub stacked pull requests. Not user-invokable.
disable-model-invocation: true
---

# Stacked PRs → ai-workflow

Canonical: `package/v2/WORKFLOW-V2.md` + [GitHub stacked PRs](https://docs.github.com/en/pull-requests/how-tos/stacked-pull-requests).

## Per Brief SUCCESS (mid run_set)

1. Ensure remote branch `specloom/<brief-key>` pushed  
2. Open or update PR:
   - **First** Brief in set: `base = ai-workflow`, `head = specloom/<brief-1>`  
   - **Later** Brief: `base = specloom/<brief-prev>`, `head = specloom/<brief-n>`  
3. PR body links Linear Brief + stack position (`n of N`)  
4. Do **not** merge into `ai-workflow` until Orchestrator requests **merge_stack**

## merge_stack (run_set complete)

Merge bottom-up into `ai-workflow`:

```
1. fetch origin
2. For i = 1..N in order:
   - merge specloom/<brief-i> into ai-workflow (ff or merge commit)
   - or merge each stacked PR in dependency order per GitHub stacked-PR flow
3. push origin ai-workflow
4. Close stacked PRs as merged
5. Return SHAs + PR URLs
```

Conflicts → stop, report file:line guidance; do not force-push trunk.

## Single Brief run_set

Same as stack of length 1: PR into `ai-workflow`, merge on SUCCESS (or merge_stack immediately).

## Forbidden

- Parallel merges to `ai-workflow`  
- Merging Brief N before Brief N-1 in the stack  
- Loops pushing `ai-workflow` themselves  

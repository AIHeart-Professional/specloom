---
name: specloom-lang-mount
description: >
  INTERNAL — specloom-loop. Verify code-*/test-* skills exist for a Brief's languages before
  dispatching a gate. Not user-invokable.
disable-model-invocation: true
---

# Mounting language skills

Runs **before** the Loop dispatches Implementation for a Brief.

## Check

For every language slug `L` in the Brief's Task Directives:

| Needed | For |
|--------|-----|
| `code-L` | Implementation |
| `test-L` | Tester |

## Missing

Stop the Brief **before** gate 1. Return `state: red`, `reason: lang_missing`, with the slugs.
The Orchestrator routes to PM's **specloom-lang-ensure**.

Never dispatch a gate for a language with no skill. v2's failure mode was a worker discovering
this mid-build and improvising rules, which then differed between runs.

## Pinning — v3 change

A generated `code-L` / `test-L` is **committed to the product repo** under
`.specloom/skills/`, not regenerated per run.

| Situation | Action |
|-----------|--------|
| Skill exists in `.specloom/skills/` | mount it, do not regenerate |
| Absent | fail up to lang-ensure, which generates **and commits** it |
| Present but its `generated_from` template version is older | mount it anyway; note as `minor` |

Regenerating per run meant two Briefs in one project could build under different rules. Pinning
makes the standards a reviewable artifact with a diff.

## Report

```json
{ "languages": ["typescript"], "mounted": ["code-typescript","test-typescript"], "missing": [] }
```

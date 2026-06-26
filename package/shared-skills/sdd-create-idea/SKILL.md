---
name: sdd-create-idea
description: >-
  INTERNAL - sdd-docs agent only. Capture ideas as GitHub Issues. Not user-invokable.
disable-model-invocation: true
---

# SDD Create Idea

Creates **"this may be valuable"** items as **GitHub Issues** (`sdd:idea`). Ideas are not features and not specs.

Load **sdd-github-planning** before acting.

## Three layers

| Layer | Location | Meaning |
|-------|----------|---------|
| **Idea** | GitHub Issue (`sdd:idea`) | Backlog problem/opportunity |
| **Feature** | GitHub Issue (`sdd:feature`) | WHAT to build |
| **Spec** | `docs/specs/` | HOW to build one implementation unit |

Promotion: **feature_definition_loop** selects earliest backlog idea issue and **sdd-create-feature** creates a separate `[FEAT-NNN]` feature issue.

## Prerequisites

- `docs/automation/github-planning.json` exists, or repo can be resolved with `gh repo view` during migration
- `gh auth status` succeeds
- Labels bootstrapped per **sdd-github-planning**

## Create workflow

```
- [ ] Step 1: Read github-planning.json or resolve REPO
- [ ] Step 2: Choose next idea sdd_id (3-digit) via sdd-github-planning
- [ ] Step 3: Search docs/decisions/ before Open Questions in body
- [ ] Step 4: Fill idea-issue-template.md -> gh issue create
- [ ] Step 5: Return DOCS_RESULT with github:owner/repo#N reference
```

## Template

Use **sdd-github-planning** -> [idea-issue-template.md](../sdd-github-planning/idea-issue-template.md).

## Rules

- No acceptance criteria, dependencies, or spec queue in ideas.
- No code references required.
- Duplicate ideas -> merge Notes or create a new issue with cross-link in body.
- Do not rename an idea issue to `[FEAT-NNN]`.
- Do not change `sdd_type: idea` to `feature` on the same issue.
- After promotion, source idea remains `sdd:idea`, changes to `sdd:status:promoted`, and closes with `Promoted to feature #N`.

## Output

`DOCS_RESULT.files` includes `github:owner/repo#<number>` - not a repo path.

## Related

- Promote: **feature_definition_loop** + **sdd-create-feature**
- Coordinator promotes ideas **last** - finish approved work first
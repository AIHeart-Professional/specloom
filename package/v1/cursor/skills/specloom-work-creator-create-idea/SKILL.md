---
name: specloom-work-creator-create-idea
description: >-
  INTERNAL - specloom-work-creator agent only. Capture ideas in docs/ideas/. Not user-invokable.
disable-model-invocation: true
---

# SDD Create Idea

Creates **"this may be valuable"** items as **`docs/ideas/NNN_short-description.md`**. Ideas are not features and not specs.

Load **specloom-work-creator-docs-planning** before acting.

## Three layers

| Layer | Location | Meaning |
|-------|----------|---------|
| **Idea** | `docs/ideas/` | Backlog problem/opportunity |
| **Feature** | `docs/features/` | WHAT to build |
| **Spec** | `docs/specs/` | HOW to build one implementation unit |

Promotion: **manual only** (user request) ? **specloom-work-creator-create-feature** ? archive idea as promoted.

Automations never promote ideas.

## Create workflow

```
- [ ] Step 1: Choose next idea NNN via specloom-work-creator-docs-planning
- [ ] Step 2: Search docs/decisions/ before Open Questions
- [ ] Step 3: Fill idea-template.md ? docs/ideas/NNN_slug.md
- [ ] Step 4: Update docs/README.md Idea Queue
- [ ] Step 5: Return DOCS_RESULT with file path
```

## Template

[idea-template.md](idea-template.md)

## Rules

- No acceptance criteria, dependencies, or spec queue in ideas.
- Duplicate ideas ? merge Notes or cross-link in body.
- Do not rename an idea file to a feature path — create a new feature file on promotion.
- After promotion, move idea to `docs/ideas/archived/` with `status: promoted`.

## Output

`DOCS_RESULT.files` includes `docs/ideas/NNN_short-description.md`.

## Related

- Promote: **manual** via **specloom-work-creator** ? **workflow-coordinator-feature-definition** or **specloom-work-creator-create-feature**

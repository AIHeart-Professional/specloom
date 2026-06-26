---
name: technical-writer-create-idea
description: >-
  INTERNAL - sdd-technical-writer agent only. Capture ideas in docs/ideas/. Not user-invokable.
disable-model-invocation: true
---

# SDD Create Idea

Creates **"this may be valuable"** items as **`docs/ideas/NNN_short-description.md`**. Ideas are not features and not specs.

Load **technical-writer-docs-planning** before acting.

## Three layers

| Layer | Location | Meaning |
|-------|----------|---------|
| **Idea** | `docs/ideas/` | Backlog problem/opportunity |
| **Feature** | `docs/features/` | WHAT to build |
| **Spec** | `docs/specs/` | HOW to build one implementation unit |

Promotion: **manual only** (user request) → **technical-writer-create-feature** → archive idea as promoted.

Automations never promote ideas.

## Create workflow

```
- [ ] Step 1: Choose next idea NNN via technical-writer-docs-planning
- [ ] Step 2: Search docs/decisions/ before Open Questions
- [ ] Step 3: Fill idea-template.md → docs/ideas/NNN_slug.md
- [ ] Step 4: Update docs/README.md Idea Queue
- [ ] Step 5: Return DOCS_RESULT with file path
```

## Template

[idea-template.md](idea-template.md)

## Rules

- No acceptance criteria, dependencies, or spec queue in ideas.
- Duplicate ideas → merge Notes or cross-link in body.
- Do not rename an idea file to a feature path — create a new feature file on promotion.
- After promotion, move idea to `docs/ideas/archived/` with `status: promoted`.

## Output

`DOCS_RESULT.files` includes `docs/ideas/NNN_short-description.md`.

## Related

- Promote: **manual** via **sdd-project-lead** → **workflow-coordinator-feature-definition** or **technical-writer-create-feature**

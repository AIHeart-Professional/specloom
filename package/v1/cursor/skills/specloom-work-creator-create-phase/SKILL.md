---
name: specloom-work-creator-create-phase
description: >-
  INTERNAL — specloom-work-creator only. Author docs/phases/ folders and PHASE.md. Not user-invokable.
disable-model-invocation: true
---

# SDD Create Phase

Creates **product phase** definitions in `docs/phases/NN-Name/PHASE.md`.

Load **specloom-phase-alignment** and **specloom-work-creator-docs-planning**.

## Naming

| Part | Rule |
|------|------|
| Folder | `NN-ShortName` — e.g. `01-Prototype`, `02-Alpha` |
| File | `PHASE.md` inside folder |
| `id` frontmatter | matches folder name |

## Next phase number

Scan `docs/phases/` and `docs/phases/archived/` for `NN-` prefix. Next = max order + 1.

## Create workflow

```
- [ ] Step 1: Copy phase-template/PHASE.md → docs/phases/NN-Name/PHASE.md
- [ ] Step 2: Fill In scope / Out of scope / Quality bar / Completion criteria
- [ ] Step 3: Set status: Active (if first phase) or Draft
- [ ] Step 4: Update docs/README.md Phase Queue
- [ ] Step 5: If Active: set active_work.json activeProductPhase
```

## Bootstrap default

**specloom-work-creator-workflow-setup** seeds `01-Prototype/` from repo template.

## Activate phase

Only **one** `status: Active` phase at a time:

1. Archive or set previous Active → Complete
2. Set new phase `status: Active`
3. `activeProductPhase` → new path

## Related

- Template: `package/repo-templates/phases/phase-template/PHASE.md`
- Alignment: **specloom-phase-alignment**

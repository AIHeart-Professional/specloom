# Phases (product focus)

**Phase** = strategic slice of the product roadmap. Phases define **what belongs** in this stage of the project and **what must wait**.

Phases are the **core focus** for ideas, features, specs, implementation, validation, and testing.

## Layout

```
docs/phases/
  README.md
  01-Prototype/
    PHASE.md          # boundaries, in/out of scope, completion criteria
  02-Alpha/
    PHASE.md
  archived/
    01-Prototype/     # when phase Complete
```

## Active phase

`docs/automation/state/active_work.json` → **`activeProductPhase`**

Example: `"activeProductPhase": "docs/phases/01-Prototype"`

Only **one** active product phase at a time unless user explicitly overrides.

## Feature membership

Every feature **must** declare its phase in frontmatter:

```yaml
phase: docs/phases/01-Prototype
```

Body section **Phase Alignment** must reference `PHASE.md` in/out of scope.

## Spec membership

Every spec inherits phase from parent feature. **Required Context** must list:

`docs/phases/<NN-Name>/PHASE.md`

## Archive

Phase is **Complete** when:

1. All features with this `phase` path are `Complete` in `docs/features/archived/`
2. All spawned specs from those features are in `docs/specs/archived/`
3. Phase **Completion Criteria** in `PHASE.md` are checked
4. **specloom-update-knowledgebase** `archive_phase` moves folder to `docs/phases/archived/`

## Skills

- Bootstrap: **specloom-work-creator-workflow-setup**
- Create phase: **specloom-work-creator-create-phase**
- Alignment: **specloom-phase-alignment** (validators, testers, work-creator)

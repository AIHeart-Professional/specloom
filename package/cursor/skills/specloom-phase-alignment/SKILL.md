---
name: specloom-phase-alignment
description: >-
  INTERNAL — specloom-work-creator, specloom-validator, specloom-tester, specloom-worker-validation.
  Product phase boundaries and alignment checks. Not user-invokable.
disable-model-invocation: true
---

# Product Phase Alignment

Phases (`docs/phases/`) define **what this stage of the product is responsible for** and **what must not ship yet**.

## Active phase

Read `docs/automation/state/active_work.json` → **`activeProductPhase`**

Example: `docs/phases/01-Prototype`

If null, infer from feature `phase` frontmatter on active work.

## Phase document

Each phase folder contains **`PHASE.md`**:

| Section | Use |
|---------|-----|
| **In scope** | Work must deliver these |
| **Out of scope** | Work must **not** include these (unless Open Questions exception) |
| **Quality bar** | Test/UX/perf expectations for this phase |
| **Completion criteria** | When to archive phase |

## Feature rules

Every feature **must** have:

```yaml
phase: docs/phases/01-Prototype
```

Body section **## Phase Alignment** — how feature scope fits phase In/Out of scope.

**Create feature:** only for `activeProductPhase` unless user names another phase.

## Spec rules

Every spec **must** list parent phase in **Required Context**:

```
docs/phases/01-Prototype/PHASE.md
```

Inherited from parent feature — verify paths match.

## Validation scoring (work + draft)

Add **phase_alignment** checks:

| Check | Fail if |
|-------|---------|
| Phase path present | Feature/spec missing phase or PHASE.md in context |
| In scope | Requirements deliver out-of-scope items from PHASE.md |
| Out of scope | Shipped capability explicitly deferred |
| Quality bar | Tests/UX/perf below phase table without documented exception |
| Roster | Feature not listed in phase Feature roster (warn → fix on create) |

**Critical:** shipping **Out of scope** work without user-approved Open Question → `critical` finding.

## Testing alignment

**specloom-tester** and test-standards agents:

1. Load phase `PHASE.md` from spec Required Context
2. System tests cover phase **Goal** outcomes where applicable
3. Do not add production features from **Out of scope** to meet coverage — extract testable units only

## Phase archive

When **specloom-update-knowledgebase** archives last feature in phase:

1. Verify all roster features in `docs/features/archived/`
2. Verify completion criteria checkboxes
3. `archive_phase` → move to `docs/phases/archived/NN-Name/`
4. Set `status: Complete` in PHASE.md frontmatter
5. Clear or advance `activeProductPhase` in `active_work.json` (user sets next phase)

## Handoff fields

```yaml
activeProductPhase: docs/phases/01-Prototype
phase_doc: docs/phases/01-Prototype/PHASE.md
```

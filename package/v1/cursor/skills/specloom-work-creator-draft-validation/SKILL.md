---
name: specloom-work-creator-draft-validation
description: >-
  INTERNAL — specloom-validator only. Draft validation for feature and spec docs.
  Pass >= 99. Not user-invokable.
disable-model-invocation: true
---

# Work Creator Draft Validation

Invoked when `validation_mode: draft` on `VALIDATOR_HANDOFF`.

Load **specloom-work-creator-docs-planning** for path conventions and **specloom-phase-alignment** for phase checks.

## Types

| `draft_type` | Source | Draft |
|--------------|--------|-------|
| `feature` | `docs/ideas/NNN_slug.md` | `docs/features/NNN_slug.md` |
| `spec` | `docs/features/NNN_slug.md` | `docs/specs/MMDDYY_*.md` |

## Feature draft checks

Critical format gates + coverage scoring (idea → feature alignment). See legacy `qa-tester-feature-validation` rubric.

**Phase gates (mandatory):**
- `phase` frontmatter points to existing `docs/phases/NN-Name/`
- **Phase Alignment** section present
- Scope does not violate phase **Out of scope** without Open Question

**Pass:** `confidence_score >= 99` AND zero `critical` findings.

## Spec draft checks

Spec Queue row scope, Requirements, Required Context, Task Directives, Token Budget. See legacy `qa-tester-spec-validation` rubric.

**Phase gates (mandatory):**
- `PHASE.md` listed in Required Context
- `parent_phase` matches feature `phase`
- Requirements stay within phase **In scope**

**Pass:** `confidence_score >= 99` AND zero `critical` findings.

## Output fields

Set `validation_mode: draft`, `draft_type: feature|spec`, `confidence_score`, `findings[]`, `rewrite_instructions[]` on fail.

On pass → return to **specloom-work-creator** for sign-off card. **Do not** auto-promote.

## Fail

Return `rewrite_instructions[]` for **specloom-work-creator** `revise_draft`.

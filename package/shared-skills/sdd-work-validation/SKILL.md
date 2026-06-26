---
name: sdd-work-validation
description: >-
  INTERNAL — sdd-validation agent only. Code alignment + quality scores 0-100.
  Pass total >= 99 before validation_type test. Not user-invokable.
---


# SDD Work Validation (implementation)

Invoked by **sdd-validation** when `validation_type: work`.

Runs **after** all spec tasks complete. **Before** `validation_type: test`.

## Handoff fields

```yaml
validation_type: work
spec: docs/specs/MMDDYY_name.md
spec_id: "014"
manifest_path: docs/specs/work-records/SPEC-014/manifest.json
attempt: 1
required_context: []
changed_files: []          # optional; manifest.files_index is primary
image_files: []
acceptance_criteria: []    # optional; manifest.acceptance_criteria is primary
standards: []
```

## Read scope

1. **`manifest.json`** at `manifest_path` — tasks, files_index, layers, acceptance_criteria
2. Spec Goal, Requirements, reference images
3. Listed `required_context` + `standards` only

**Do not** read `work-done.md` or other work-records prose.

## Scoring

| Field | 0–100 | Checks |
|-------|-------|--------|
| alignment_score | Request match | Goal, Requirements, reference images 1:1 |
| quality_score | Code grade | Readability, optimization, listed Code Standards |

**total_confidence** = `round((alignment_score + quality_score) / 2)`

**Pass:** `total_confidence >= 99` AND each score `>= 98`

## Fail — remediation

```yaml
remediation:
  layer: frontend | backend | database
  alignment_gaps: [{ requirement, expected, actual, files, fix }]
  quality_gaps: [{ file, issue, standard, fix }]
  priority_order: []
```

**sdd-orchestrator** routes to domain agents. Max **3** (`workValidationAttempts`).

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `sdd-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

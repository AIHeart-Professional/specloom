---
name: qa-tester-spec-validation
description: >-
  INTERNAL — sdd-qa-tester agent only. Validates spec draft vs parent feature file
  Spec Queue row. Coverage score 0-100, pass >= 99. Not user-invokable.
disable-model-invocation: true
---

# SDD Spec Validation (feature → spec)

Invoked by **sdd-qa-tester** when `validation_type: spec`.

Load **technical-writer-docs-planning** when resolving parent feature path.

## Inputs

- **Source:** parent feature — `docs/features/NNN_short-description.md`
- **Draft:** `docs/specs/MMDDYY_*.md`

Read parent feature file from repo.

## Checks (score 0–100 → coverage_score)

| Check | Weight |
|-------|--------|
| Spec Queue row scope exact | 25 |
| Acceptance Criteria → Requirements + Validation | 25 |
| Required Context complete; subset rule | 20 |
| Task Directives cover scope | 15 |
| Token Budget per task | 10 |
| Feature Out not violated | 5 |

**Pass:** `coverage_score >= 99` AND zero `critical` findings. Pass triggers **awaiting_sign_off** — not auto-promote. Surface open questions in `user_q` for review card.

## Fail output

Return `rewrite_instructions[]` for **sdd-technical-writer** `revise_draft`.

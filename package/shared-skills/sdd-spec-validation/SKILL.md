---
name: sdd-spec-validation
description: >-
  INTERNAL — sdd-validation agent only. Validates spec draft vs parent feature issue
  Spec Queue row. Coverage score 0-100, pass >= 99. Not user-invokable.
---


# SDD Spec Validation (feature → spec)

Invoked by **sdd-validation** when `validation_type: spec`.

Load **sdd-github-planning** when parent is a GitHub issue.

## Inputs

- **Source:** parent feature — `github:owner/repo#N` (`sdd:feature`)
- **Draft:** `docs/specs/MMDDYY_*.md`

Fetch parent feature via `gh issue view` when reference starts with `github:`.

## Checks (score 0–100 → coverage_score)

| Check | Weight |
|-------|--------|
| Spec Queue row scope exact | 25 |
| Acceptance Criteria → Requirements + Validation | 25 |
| Required Context complete; subset rule | 20 |
| Task Directives cover scope | 15 |
| Token Budget per task | 10 |
| Feature Out not violated | 5 |

**Pass:** `coverage_score >= 99` AND zero `critical` findings. `sdd-validation` must set `total_confidence = coverage_score`. On pass → **awaiting_sign_off** (human chat approval before `sdd-updates mark_ready`).

## Fail output

Same finding schema as **sdd-feature-validation**. Retry via **sdd-docs** → **sdd-validation** (max 3).

On pass: **pause for user sign-off** in chat. After approval, `sdd-updates mark_ready` marks spec `Pending`, tasks `Ready`, updates parent feature `Spawned Specs` row. No auto-promote on validation pass alone.

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `sdd-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

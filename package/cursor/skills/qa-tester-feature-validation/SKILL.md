---
name: qa-tester-feature-validation
description: >-
  INTERNAL - sdd-qa-tester agent only. Validates feature doc vs source idea doc.
  Coverage score 0-100, pass >= 99. Not user-invokable.
disable-model-invocation: true
---

# SDD Feature Validation (idea → feature)

Invoked by **sdd-qa-tester** when `validation_type: feature`.

Load **technical-writer-docs-planning** for path conventions.

## Inputs

- **Source:** `docs/ideas/NNN_slug.md` — from `VALIDATION_HANDOFF.source`
- **Draft:** `docs/features/NNN_slug.md` — from `VALIDATION_HANDOFF.draft`

Read both files from the repo. Do not use GitHub issues.

## Critical format gates

Any failure here is `critical` and validation fails even if content coverage is high.

- Source and draft are **different file paths**; idea was not converted in place.
- Source idea has `status: backlog` (or is being promoted in same session).
- Feature filename `NNN_short-description.md` matches frontmatter `id`.
- Feature frontmatter includes `id`, `priority`, `spec_id`, `status`, `source_idea`, `git_base_branch`, `estimated_tokens`, `tokens_used`, `token_variance`, `created`, `last_updated`, `dependencies`.
- Feature `source_idea` equals source idea path.
- Feature body contains required sections: Summary, Goal, User Value, Dependencies, Scope, Acceptance Criteria, UX References, Context Links, Spec Queue, Spawned Specs, Token Budget, Open Questions, Completion Status.
- Spec Queue has at least one implementable row when feature status is `Ready`.
- Token Budget includes estimated total and per-spec rollup.
- Acceptance Criteria are checkboxes.

## Coverage checks (score 0-100 each → coverage_score)

| Check | Weight |
|-------|--------|
| Idea problem/outcome reflected in feature Goal/Summary | 30 |
| User Value articulated | 15 |
| Scope in/out clear | 15 |
| Acceptance Criteria measurable | 20 |
| Spec Queue row matches idea scope | 20 |

**Pass:** `coverage_score >= 99` AND zero `critical` findings. Pass triggers **awaiting_sign_off** — not auto-promote. Include unresolved Open Questions in `user_q` for review card.

## Fail output

Return `rewrite_instructions[]` with concrete fixes for **sdd-technical-writer** `revise_draft`.

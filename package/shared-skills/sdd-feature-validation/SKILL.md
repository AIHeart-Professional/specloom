---
name: sdd-feature-validation
description: >-
  INTERNAL - sdd-validation agent only. Validates feature issue vs source idea issue.
  Coverage score 0-100, pass >= 99. Not user-invokable.
disable-model-invocation: true
---

# SDD Feature Validation (idea -> feature)

Invoked by **sdd-validation** when `validation_type: feature`.

Load **sdd-github-planning** to fetch issue bodies and validate labels/frontmatter.

## Inputs

- **Source:** `github:owner/repo#N` idea issue (`sdd:idea`) - from `VALIDATION_HANDOFF.source`
- **Draft:** `github:owner/repo#M` feature issue (`sdd:feature`) - from `VALIDATION_HANDOFF.draft`

Fetch both via `gh issue view --json number,title,body,labels,state,url`. Do not read issue comments unless `include_comments: true`.

## Critical format gates

Any failure here is `critical` and validation fails even if content coverage is high.

- Source and draft are different issue numbers; idea was not converted in place.
- Source issue title remains `[IDEA-NNN] ...` and label remains `sdd:idea`.
- Feature issue title uses `[FEAT-NNN] ...`, not `[FEATURE-NNN]`.
- Feature issue has label `sdd:feature` and exactly one `sdd:status:*` label.
- Feature frontmatter includes `sdd_type: feature`, `sdd_id`, `priority`, `spec_id`, `status`, `source_issue`, `git_base_branch`, `active_spec_branch`, `estimated_tokens`, `tokens_used`, `token_variance`, `created`, `last_updated`, `dependencies`.
- Feature `source_issue` equals source idea issue number.
- Feature frontmatter `status` matches status label (`Ready` -> `sdd:status:ready`, `Draft` -> `sdd:status:draft`, `In Progress` -> `sdd:status:in-progress`, `Complete` -> `sdd:status:complete`).
- Feature body contains required sections in order: Summary, Goal, User Value, Dependencies, Scope, Acceptance Criteria, UX References, Context Links, Spec Queue, Spawned Specs, Token Budget, Open Questions, Completion Status.
- Spec Queue has at least one implementable row when feature status is `Ready`.
- Token Budget includes estimated total and per-spec rollup.
- Acceptance Criteria are checkboxes and define feature completion, including archived specs and validation/PR merge evidence.

## Coverage checks (score 0-100 each -> coverage_score)

| Check | Weight |
|-------|--------|
| Problem -> feature Summary/Goal/Scope | 20 |
| Desired Outcome -> Acceptance Criteria | 20 |
| Notes / edge cases not dropped | 15 |
| Dependencies honest and verified | 10 |
| Scope boundaries explicit | 10 |
| Spec Queue rows ordered and implementable | 15 |
| Context Links / UX References sufficient for spec authors | 10 |

**coverage_score** = weighted average (round).

**Pass:** `coverage_score >= 99` AND zero `critical` findings. `sdd-validation` must set `total_confidence = coverage_score`. On pass → **awaiting_sign_off** before `sdd-updates mark_ready`.

## Source idea promotion check

After validation passes and feature is accepted:

- Source idea body frontmatter must become `status: promoted`.
- Source idea labels must become `sdd:idea` + `sdd:status:promoted`.
- Source idea must close with comment `Promoted to feature #N`.
- Feature issue remains open unless later completed after specs/sign-off.

Do not require the source idea to be promoted before initial feature validation; this check applies during closeout/update validation.

## Fail output

```yaml
findings:
  - severity: critical | major | minor
    area: format | acceptance | scope | spec_queue | dependencies | source_promotion | token_budget
    gap: ""
    fix: ""
rewrite_instructions: |
  Ordered edits for sdd-docs revise_draft (gh issue edit body/labels/title)
```

**sdd-orchestrator** -> **sdd-docs** `revise_draft` -> re-run **sdd-validation** (max 3).
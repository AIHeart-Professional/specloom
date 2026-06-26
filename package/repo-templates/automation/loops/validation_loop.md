# Validation Loop

> Verify completed implementation satisfies spec, architecture, coding standards, and quality requirements.

## Purpose

Prove work deserves sign-off — not merely claim it.

## Inputs

Read:

- `AGENTS.md`
- `docs/automation/state/active_work.json`
- Active spec (Required Context only)
- Modified files from spec **Changes**
- Task acceptance from spec **Validation** + Requirements

## Validation scope

Validate only:

- Current task (`currentTask` in state)
- Files changed for current task
- Directly affected integrations
- Acceptance criteria for current task

Full-project validation only when spec requires it or all tasks complete (final feature validation).

## Procedure

1. Read active task and acceptance criteria.
2. Identify files changed (spec **Changes** section).
3. Confirm changes within task scope.
4. Run task-specific validation commands from spec.
5. Run static checks: format, lint, typecheck, build (per AGENTS.md).
6. Run relevant tests: unit, integration, API, frontend.
7. Validate architecture constraints (Required Context architecture docs only).
8. Validate security-sensitive behavior where applicable.
9. Compare behavior vs acceptance criteria.
10. Review errors, warnings, skipped/flaky tests.
11. Record evidence in spec:

```markdown
Validation evidence:

- Command: `pytest tests/example`
  Result: passed
  Summary: 8 tests passed
```

12. Set task/state status: `validated` | `validation_failed` | `blocked` | `awaiting_human_review`
13. Update `active_work.json`: validation status, attempts, commands, timestamp, next workflow
14. Write `docs/automation/reports/latest_validation.md`

## Pass rules

Task passes when:

- All required commands succeed
- Acceptance criteria satisfied
- No unrelated regressions
- No architecture violations
- No unresolved critical warnings
- Required tests not skipped

## Fail rules

Task fails when command fails, criteria not met, scope exceeded, missing tests, or security/data concerns.

## Retry rules

On failure:

1. Record failed command + error
2. Identify root cause
3. Route back to `task_execution_loop.md` for correction
4. Increment validation attempt
5. Max **3 retries** → `blocked_work.json`, review report, stop for human

## Final spec validation (all tasks complete)

When all spec tasks complete, **sdd-orchestrator** must:

1. Delegate **sdd-validation** (`validation_type: work`) — max 3 (`workValidationAttempts`)
2. On pass → **sdd-validation** (`validation_type: test`) — max 3 (`testingAttempts`); pass bar ≥ 99% confidence on coverage + test quality
3. On pass → **sdd-updates** finalize work-records
5. Route to `review_loop.md`
6. **No git** until review approved

Per-task validation in this loop remains for single-task runs during implementation.

## Stop conditions

- Validation passes → route review or feature loop
- Validation fails → correction required
- Max retries reached
- Human review required
- Tools/env unavailable
- Task outside approved scope

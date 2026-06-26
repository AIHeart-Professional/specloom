---
name: sdd-test-e2e
description: >-
  INTERNAL — sdd-validation agent only. End-to-end test execution protocol.
  Not user-invokable.
---


# SDD E2E Testing

Loaded by **sdd-validation** when `test_type: e2e` or during full suite.

## Scope

- Full user journeys through the stack (UI → API → DB)
- Acceptance criteria from spec Requirements
- Critical paths: auth, core workflows, error states

## Procedure

1. Map spec acceptance criteria to E2E scenarios — every criterion must have coverage.
2. Read `AGENTS.md` for E2E command (Detox, Maestro, Playwright, Cypress).
3. Run E2E suite; capture screenshots/traces on failure when tooling supports it.
4. Record command, exit code, pass/fail, duration.

## Pass criteria

- Exit code 0
- Every spec acceptance criterion exercised by at least one E2E test
- Loading, empty, and error paths covered for new screens/flows

## Mobile (React Native)

- Test on simulator/emulator per project config
- Verify navigation flows, safe area, and form submission end-to-end

## Failure output

Include failing scenario name, step, screenshot path if available, `remediation.layer`.

## Anti-patterns

- E2E tests that only assert unit-level logic
- Flaky tests without retry policy documented — fix root cause, not mask with retries

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `sdd-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

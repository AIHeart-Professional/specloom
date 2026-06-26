---
name: qa-tester-regression
description: >-
  INTERNAL — sdd-qa-tester agent only. Full regression suite — no regressions in existing tests.
  Not user-invokable.
disable-model-invocation: true
---

# SDD Regression Testing

Loaded by **sdd-qa-tester** when `test_type: regression` or as final step of full suite.

## Scope

- Entire project test suite (unit + integration + E2E) — not only spec-touched files
- Ensures new work did not break existing behavior
- Run after unit/integration/e2e/coverage passes on changed scope

## Procedure

1. Read `AGENTS.md` for full test command(s).
2. Run complete CI-equivalent suite.
3. Compare against baseline if `VALIDATION_HANDOFF.baseline_branch` provided — flag new failures only.
4. Record total passed/failed/skipped, duration, any newly failing tests.

## Pass criteria

- Zero regressions — all pre-existing tests still pass
- No new skipped tests without documented reason
- CI command exit code 0

## Failure output

```json
{"regressions":[{"test":"","file":"","err":"","previously_passing":true}]}
```

`remediation` must identify whether regression is in spec-touched code or collateral — route layer accordingly.

## When to run

- Always as last step of **full** `VALIDATION_HANDOFF` before `status: passed`
- Optional `test_type: regression` only for quick regression check mid-spec (orchestrator discretion)

## Anti-patterns

- Running only changed-file tests and calling spec complete
- Ignoring flaky tests — quarantine with ticket reference or fix

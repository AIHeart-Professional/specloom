---
name: qa-tester-coverage
description: >-
  INTERNAL — sdd-qa-tester agent only. Coverage validation — 100% on spec-touched files.
  Not user-invokable.
disable-model-invocation: true
---

# SDD Coverage Validation

Loaded by **sdd-qa-tester** after unit tests or during full suite. **Mandatory gate.**

## Target

**100% line and branch coverage** on every file touched in the active spec unless spec documents an approved exception.

## Procedure

1. Build file list from spec **Changes** + task Source Files + `VALIDATION_HANDOFF.changed_files`.
2. Run coverage with project tooling scoped to those files.
3. Parse report — list every file below 100% with uncovered lines/branches.
4. Fail if any spec-touched file is below threshold.

## Output fields

```json
{"cov_total":0,"gaps":[{"file":"","lines":[],"branches":[]}]}
```

## Pass criteria

- `cov_total` = 100 for spec-touched file set (or spec-approved waiver list empty)
- No uncovered branches on error-handling paths

## Remediation

Return `remediation.files` = files needing tests, `remediation.issues` = uncovered line ranges.

**sdd-project-lead** routes test writing fixes to domain agents — **sdd-qa-tester** does not write production or test code unless handoff `action: write_tests` explicitly set for remediation pass.

## Stack commands

| Stack | Example |
|-------|---------|
| Jest/Vitest | `--coverage --collectCoverageFrom='src/foo/**'` |
| pytest | `--cov=package --cov-report=term-missing --cov-fail-under=100` |

## Waiver

Only when spec **Validation** section lists explicit files exempt from 100% with reason. Honor waivers in handoff `coverage_waivers: []`.

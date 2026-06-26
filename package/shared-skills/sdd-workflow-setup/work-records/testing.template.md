# Testing Record — SPEC-{spec_id}

> Full test run by **sdd-validation** after all tasks complete. Before automated PR/merge.

spec_id: {spec_id}
spec_path: docs/specs/MMDDYY_short-description.md
tested: YYYY-MM-DD
testing_attempt: 1
overall_status: passed | failed
overall_coverage_percent: 0

## Summary

Brief narrative: what was tested, outcome, coverage.

## Unit tests

| Metric | Value |
|--------|-------|
| Command | `pytest tests/...` or `npm run test` |
| Passed | 0 |
| Failed | 0 |
| Skipped | 0 |
| Coverage % | 0 |
| Target | 100% on spec-touched files |

### Coverage gaps

| File | Lines missed | Notes |
|------|--------------|-------|
| _None_ | — | |

### Failures

_None_ or list test name, file, error.

## Integration tests

| Metric | Value |
|--------|-------|
| Command | |
| Passed | 0 |
| Failed | 0 |
| Summary | |

### Failures

_None_

## End-to-end (E2E) tests

| Metric | Value |
|--------|-------|
| Command | `npm run test:e2e` or Playwright |
| Passed | 0 |
| Failed | 0 |
| Summary | User journeys exercised |

### Scenarios covered

- [ ] Scenario from spec acceptance criteria

### Failures

_None_

## Remediation history

> If sdd-orchestrator retried after failures, log each attempt.

| Attempt | Status | Layer fixed | Notes |
|---------|--------|-------------|-------|
| 1 | passed | — | Initial run |

## Sign-off gate

- [ ] All three layers executed (unit, integration, E2E)
- [ ] 100% coverage on spec-touched files (or documented exception in Open Questions)
- [ ] No failing tests
- [ ] Ready for automated PR/merge

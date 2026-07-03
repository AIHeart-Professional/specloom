# Testing Record — SPEC-{spec_id}

> Full test run by **specloom-tester** after work validation. Before user sign-off.

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
| Command | `pytest tests/unit` or `npm test` |
| Passed | 0 |
| Failed | 0 |
| Skipped | 0 |
| Coverage % | 0 |
| Target | 100% on spec-touched production files |

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
| Summary | Multi-module / API + DB cooperation |

### Failures

_None_

## System tests

| Metric | Value |
|--------|-------|
| Command | E2E / full-stack per `AGENTS.md` |
| Passed | 0 |
| Failed | 0 |
| Summary | User journeys from spec/feature acceptance criteria |

### Scenarios covered

- [ ] Scenario from spec acceptance criteria

### Failures

_None_

## Performance tests

| Metric | Value |
|--------|-------|
| Command | benchmark / load smoke per `AGENTS.md` |
| Passed | 0 |
| Failed | 0 |
| Summary | Hot paths, latency thresholds |

### Failures

_None_

## Remediation history

> If specloom-implement retried after failures, log each attempt.

| Attempt | Status | Layer fixed | Notes |
|---------|--------|-------------|-------|
| 1 | passed | — | Initial run |

## Sign-off gate

- [ ] All four styles executed (unit, integration, system, performance) — or documented N/A per layer in Open Questions
- [ ] 100% coverage on spec-touched production files (or documented exception)
- [ ] No failing tests
- [ ] Ready for user approval

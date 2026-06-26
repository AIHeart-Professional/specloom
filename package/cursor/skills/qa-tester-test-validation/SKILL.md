---
name: qa-tester-test-validation
description: >-
  INTERNAL — sdd-qa-tester agent only. Test execution + coverage/quality scores
  0-100. Pass total >= 99. Same agent as work validation. Not user-invokable.
disable-model-invocation: true
---

# SDD Test Validation

Invoked by **sdd-qa-tester** when `validation_type: test`.

Runs **after** `validation_type: work` passes. **Before** work-records finalize.

## Handoff fields

```yaml
validation_type: test
spec: docs/specs/MMDDYY_name.md
spec_id: "014"
manifest_path: docs/specs/work-records/SPEC-014/manifest.json
attempt: 1
coverage_waivers: []
```

`manifest_path` **required**. `manifest.status` must be `awaiting_tests`.

## Read scope

1. **`manifest.json`** — files_index, layers, acceptance_criteria (sole work-records read)
2. Spec **Changes**, **Requirements**, **Validation**
3. `AGENTS.md` — test commands
4. Codebase on `manifest.git_task_branch`

**Do not** read `work-done.md`, `implementation.md`.

## Execution skills (run in order)

| Step | Skill |
|------|-------|
| 1 | **qa-tester-unit** |
| 2 | **qa-tester-integration** |
| 3 | **qa-tester-e2e** |
| 4 | **qa-tester-coverage** |
| 5 | **qa-tester-regression** |

## Test standards skills (by `manifest.layers`)

| Layer | Skills |
|-------|--------|
| frontend | **qa-tester-typescript**, **qa-tester-react**, **qa-tester-react-native** |
| backend | **qa-tester-python**, **qa-tester-typescript** (if TS in manifest) |
| database | **qa-tester-postgres** |

Also read **records-keeper-work-records** skill.

File scope: `manifest.files_index[].path`.

## Scoring (same bar as work validation)

| Field | 0–100 | Checks |
|-------|-------|--------|
| **coverage_score** | Coverage completeness | 100% lines+branches on spec-touched files; honor `coverage_waivers` only |
| **quality_score** | Test suite grade | Behavioral tests, proper mocks, acceptance criteria covered, no flaky patterns per **test-*** skills |

**total_confidence** = `round((coverage_score + quality_score) / 2)`

**Pass:** `total_confidence >= 99` AND `coverage_score >= 98` AND `quality_score >= 98`

If not ≥ 99% confident on coverage, quality, regression, or acceptance coverage → **fail** (do not pass).

## Fail — remediation

```yaml
remediation:
  layer: frontend | backend | database
  coverage_gaps: [{ file, lines, branches }]
  quality_gaps: [{ test, issue, fix }]
  failures: [{ layer, test, file, err }]
  priority_order: []
```

**sdd-project-lead** routes fixes to domain agents. Max **3** (`testingAttempts`). Attempt 3 fail → spec `incomplete`, `blocked_work.json`.

## Output

Nested in **VALIDATION_RESULT**:

```yaml
test_run:
  unit: { cmd, passed, failed, cov, gaps }
  integration: { cmd, passed, failed }
  e2e: { cmd, passed, failed }
  cov_total: 0
  regression: { cmd, passed, failed, regressions }
```

**sdd-records-keeper** writes `testing.md` from `test_run` on pass.

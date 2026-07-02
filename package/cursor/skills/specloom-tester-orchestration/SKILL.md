---
name: specloom-tester-orchestration
description: INTERNAL — specloom-tester only. Test suite orchestration and coverage aggregation. Not user-invokable.
disable-model-invocation: true
---

# Tester Orchestration

## Preconditions check

Read `manifest.json`:
- Any task `status != complete` → `TEST_RESULT.status: no_work`
- `manifest.status` should be `awaiting_tests` or post-validation

## Procedure

1. Build `TEST_LOOP_HANDOFF` with `max_loop_iterations: 5`
2. Delegate **specloom-test-loop** via implement
3. Aggregate layer results into `TEST_RESULT`
4. **Pass:** `coverage_percent == 100`, all `tests_passing: true`
5. **Fail after 5 loops:** return failure message with `uncovered_files[]`

## Parallel test creation

When `layers: [frontend, backend]` → test-loop runs both test-standards agents same iteration.

## Post-pass

Return result to implement → **specloom-update-knowledgebase** `finalize_work_records` with `test_result`.

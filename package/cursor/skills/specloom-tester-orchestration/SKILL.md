---
name: specloom-tester-orchestration
description: INTERNAL — specloom-tester only. Test suite orchestration and coverage aggregation. Not user-invokable.
disable-model-invocation: true
---

# Tester Orchestration

## Skill boundary

**specloom-tester** and sub-agents load **test-*** skills only.

**Forbidden:** `code-*`, `specloom-*-developer-*` — those are **specloom-implement** scope.

## Preconditions check

Read `manifest.json`:
- Any task `status != complete` → `TEST_RESULT.status: no_work`
- Implementation validation passed (`manifest.status` post-validator)
- `manifest.status` should be `awaiting_tests` or post-validation

## Spec / feature as test oracle

Before delegating test-loop, load:
1. Active **spec** — Requirements, per-task acceptance criteria
2. Parent **feature** — acceptance criteria, scope
3. `manifest.files_index` — production files to cover

Tests must assert **expected behavior from spec/feature**, not invent requirements.

## Procedure

1. Build `TEST_LOOP_HANDOFF` with `max_loop_iterations: 5`
2. Delegate **specloom-test-loop** (Task) — tester executes
3. Aggregate layer results into `TEST_RESULT`
4. **Pass:** `coverage_percent == 100`, all `tests_passing: true`, all spec criteria covered
5. **Fail after 5 loops:** return failure with `uncovered_files[]` and missing spec criteria

## Post-pass (approval mode)

Load **specloom-approval-mode** after test loop pass:

| Mode | Actions |
|------|---------|
| **manual** | `finalize_work_records` only; set `pendingSignOff`; review card; **no archive** |
| **auto** | `finalize_work_records` + `archive_spec` + `sync_knowledge` |
| **`/approve`** | Deferred `archive_spec` + `sync_knowledge` when `pendingSignOff` exists |

## Parallel test creation

When `layers: [frontend, backend]` → test-loop runs both test-standards agents same iteration.

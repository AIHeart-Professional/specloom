---
name: specloom-tester-orchestration
description: INTERNAL — specloom-tester only. Test suite orchestration and coverage aggregation. Not user-invokable.
disable-model-invocation: true
---

# Tester Orchestration

Runs **after specloom-implement** (worker-validation pass). **Before specloom-validator**.

Load **specloom-remediation-routing** when `manifest.status: validation_failed`.

## Skill boundary

**specloom-tester** and sub-agents load **test-*** skills only.

**Forbidden:** `code-*`, `specloom-*-developer-*`.

## Preconditions check

Read `manifest.json`:

| Condition | Result |
|-----------|--------|
| Any task `status != complete` | `no_work` — run `@specloom-implement` first |
| `status: awaiting_tests` | **Proceed** (happy path) |
| `status: validation_failed` + `owner:tester` issues in spec | **Proceed** (remediation) |
| `status: tests_passed` + no tester remediation | `no_work` — run `@specloom-validator` |
| `status: archived` | `no_work` |

**Do not** require validator pass — validator runs **after** tests.

## Spec / feature as test oracle

Before test-loop:

1. Active **spec** — Requirements, acceptance criteria
2. Parent **feature** + **phase** `PHASE.md`
3. `manifest.files_index` — production files to cover
4. If remediation: `## Validation Results` → `owner:tester` issues only

## Procedure

1. Build `TEST_LOOP_HANDOFF` with `max_loop_iterations: 5`
2. Delegate **specloom-test-loop**
3. **Pass:** `coverage_percent == 100`, all tests green
4. **Fail after 5 loops:** failure report; stay `awaiting_tests` or `validation_failed`

## Post-pass

1. **specloom-update-knowledgebase** `finalize_work_records`
2. `manifest.status: tests_passed`
3. Tell user **`@specloom-validator`** (final gate — validates impl + tests)

**Never** `archive_spec` — validator owns sign-off.

## Parallel test creation

Multiple layers in `manifest.layers[]` → parallel test-standards agents per iteration.

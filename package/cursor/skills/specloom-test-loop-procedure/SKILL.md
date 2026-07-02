---
name: specloom-test-loop-procedure
description: INTERNAL — specloom-test-loop only. Test implementation iteration (max 5). Not user-invokable.
disable-model-invocation: true
---

# Test Loop Procedure

**Max 5 iterations**. Target **100% coverage** on `manifest.files_index`.

## Preconditions

All spec tasks `Complete`. Validator passed. Else return `no_work`.

## Per iteration

1. Run coverage report per layer (`AGENTS.md` commands)
2. Build `uncovered_files[]` from manifest paths
3. For each active layer with gaps:
   - Delegate **specloom-*-test-standards** via implement
   - **Parallel** when multiple layers
4. Re-run coverage + full test suite
5. **Pass:** `coverage_percent == 100` AND all tests green
6. **Fail:** increment iteration; pass `uncovered_files` to next handoff

## Iteration 5 fail

Return `status: fail` with coverage gap report. **specloom-tester** surfaces failure to implement.

## Layer → agent

| layer | agent |
|-------|-------|
| frontend | specloom-frontend-test-standards |
| backend | specloom-backend-test-standards |
| database | specloom-database-test-standards |

## Coverage calculation

```
coverage_percent = round(100 * covered_lines / total_lines)
```

Across **all** manifest files (all layers combined). 100% required.

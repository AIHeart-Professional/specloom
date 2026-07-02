---
name: specloom-frontend-test-standards-rules
description: INTERNAL — specloom-frontend-test-standards only. Frontend test types and coverage rules. Not user-invokable.
disable-model-invocation: true
---

# Frontend Test Standards

## Test types (all required per spec work)

| Type | Scope |
|------|-------|
| **unit** | Components, hooks, utilities in manifest |
| **integration** | Screen flows, context providers |
| **regression** | Bug fixes / acceptance criteria from spec |

## Coverage target

**100% line coverage** on every `manifest.files_index` path where `layer: frontend`.

## Commands

From `AGENTS.md`:
- Unit: e.g. `npm test -- --coverage`
- Integration/E2E: per spec Validation section

## Priorities

1. Uncovered files from prior loop iteration
2. Critical acceptance criteria paths
3. Edge cases from spec Requirements

## Output

Report `tests_added[]`, `coverage_percent`, `uncovered_files[]`.

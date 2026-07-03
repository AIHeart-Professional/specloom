---
name: specloom-frontend-test-standards-rules
description: INTERNAL — specloom-frontend-test-standards only. Frontend test types, coverage, spec/feature mapping. Not user-invokable.
disable-model-invocation: true
---

# Frontend Test Standards

## Spec / feature mapping (mandatory)

| Source | Use for tests |
|--------|----------------|
| Spec **Requirements** | Assert each requirement has test coverage |
| Spec task acceptance criteria | Unit/integration cases per task |
| Parent **feature** acceptance criteria | Regression + integration flows |
| Spec **Goal** | Smoke/integration happy paths |

Record `spec_ref` on each `tests_added[]` entry (e.g. `REQ-3`, `T2 acceptance`).

## Test types (all required per spec work)

| Type | Scope |
|------|-------|
| **unit** | Components, hooks, utilities in manifest |
| **integration** | Screen flows, context providers |
| **regression** | Bug fixes / acceptance criteria from spec |

## Coverage target

**100% line coverage** on every `manifest.files_index` path where `layer: frontend` (production files only).

## Commands

From `AGENTS.md`:
- Unit: e.g. `npm test -- --coverage`
- Integration/E2E: per spec Validation section

## Priorities

1. Uncovered files from prior loop iteration
2. Critical acceptance criteria paths from spec/feature
3. Edge cases from spec Requirements

## Output

Report `tests_added[]` (with `spec_ref`), `coverage_percent`, `uncovered_files[]`.

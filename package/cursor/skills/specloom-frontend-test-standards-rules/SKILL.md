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
| Spec task acceptance criteria | Cases per task across test styles |
| Parent **feature** acceptance criteria | System + integration flows |
| Spec **Goal** | System smoke happy paths |

Record `spec_ref` on each `tests_added[]` entry (e.g. `REQ-3`, `T2 acceptance`).

## Test styles (all required per spec work)

Per [React Native Testing Overview](https://reactnative.dev/docs/testing-overview) and React testing docs:

| Style | Scope | RN / web mapping |
|-------|-------|------------------|
| **unit** | Hooks, utilities, isolated logic | Jest unit tests |
| **integration** | Multi-module, providers, API client | RN integration tests |
| **system** | Device/browser E2E, user perspective | Detox / Maestro / Playwright |
| **performance** | Scroll, render, startup smoke | Benchmarks per `AGENTS.md` |

**Regression** is not a separate style — cover acceptance-criteria regressions inside the four styles above.

## Skills (test only — never load code-*)

- **test-react-native** — React Native (primary reference: reactnative.dev testing docs)
- **test-react** + **test-typescript** — React web

## Coverage target

**100% line coverage** on every `manifest.files_index` path where `layer: frontend` (production files only).

## Commands

From `AGENTS.md`:
- Unit/integration: e.g. `npm test -- --coverage`
- System/E2E: per spec Validation section
- Performance: per project benchmark command

## Priorities

1. Uncovered files from prior loop iteration
2. Critical acceptance criteria (system + integration first for user paths)
3. Edge cases from spec Requirements

## Output

Report `tests_added[]` (with `spec_ref`, `style`: unit|integration|system|performance), `coverage_percent`, `uncovered_files[]`.

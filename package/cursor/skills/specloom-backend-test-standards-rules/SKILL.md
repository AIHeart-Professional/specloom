---
name: specloom-backend-test-standards-rules
description: INTERNAL — specloom-backend-test-standards only. Backend test types, coverage, spec/feature mapping. Not user-invokable.
disable-model-invocation: true
---

# Backend Test Standards

## Spec / feature mapping (mandatory)

Map every test to spec **Requirements**, task acceptance criteria, or parent **feature** acceptance criteria. Record `spec_ref` on `tests_added[]`.

Load **specloom-phase-alignment** — phase **Out of scope** must not appear in test assertions.

## Test styles (all required per spec work)

Per [PEP 8](https://peps.python.org/pep-0008/) (test code style) and [pytest](https://docs.pytest.org/en/stable/) (runner, assertions, fixtures):

| Style | Scope | Layout |
|-------|-------|--------|
| **unit** | Services, utilities, pure functions | `tests/unit/` |
| **integration** | API routes, DB (test DB) | `tests/integration/` |
| **system** | Full app/worker path | `tests/system/` |
| **performance** | Latency, throughput smoke | `tests/performance/` |

**Regression** — acceptance-criteria fixes covered within the four styles.

## Skills (test only — never load code-*)

- **test-python** — Python (PEP 8 + pytest docs)
- **test-typescript** — Node/TS backends

## Coverage target

**100%** on manifest backend production files.

## Commands

From `AGENTS.md` — pytest/jest with coverage; separate jobs for `performance` markers if configured.

## Patterns

- Plain `assert` / `pytest.raises` per pytest assertion guide
- Mock external services at integration boundaries only
- Assert response shapes and status codes match spec Requirements

## Output

`tests_added[]` with `spec_ref` and `style`; `coverage_percent`; `uncovered_files[]`.

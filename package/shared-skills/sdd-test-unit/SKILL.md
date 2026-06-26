---
name: sdd-test-unit
description: >-
  INTERNAL — sdd-validation agent only. Unit test execution and validation protocol.
  Not user-invokable.
---


# SDD Unit Testing

Loaded by **sdd-validation** when `test_type: unit` or during full suite.

## Scope

- Functions, methods, classes, hooks, utilities in **isolation**
- Mock all external I/O (network, DB, filesystem, clock)
- Fast — target sub-second per test file

## Procedure

1. Collect target files from **`manifest.files_index`** (primary) + spec **Changes** (cross-check).
2. Read `AGENTS.md` for project unit test command (Jest, Vitest, pytest, etc.).
3. Load **test-*** skills per layer in manifest (see **sdd-validation** agent).
4. Run with coverage scoped to changed modules only.
5. Record: command, exit code, passed/failed/skipped counts, duration.

## Pass criteria

- Exit code 0
- Zero failures
- Every new/changed exported function has at least one test
- No skipped tests unless documented in handoff with reason

## Failure output

```json
{"failures":[{"layer":"frontend|backend|database","test":"","file":"","err":""}]}
```

## Tools by stack

| Stack | Typical command |
|-------|-----------------|
| React Native / TS | `npm test -- --coverage --collectCoverageFrom=...` |
| Python | `pytest tests/ -v --cov=module --cov-report=term-missing` |

## Anti-patterns

- Testing implementation details (internal state) instead of behavior
- Shared mutable state between tests
- Real network/DB in unit tests

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `sdd-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

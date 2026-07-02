---
name: test-python
description: >-
  INTERNAL — specloom-validator, specloom-backend-developer agents. Universal Python testing standards.
  Pair with code-python. Not user-invokable.
---


# Python Testing Standards

Pair with **code-python**.

## Stack

- **pytest** — default runner
- **pytest-cov** — coverage
- **httpx** / **TestClient** (FastAPI) — API integration
- **factory_boy** or fixtures — test data

Read `AGENTS.md` for project conventions.

## Structure

```
tests/
  unit/
  integration/
  conftest.py      # shared fixtures
```

Mirror package structure under `tests/`.

## Principles

- **Arrange–Act–Assert**; one behavior per test function.
- Fixtures for DB, client, auth — scope `function` unless expensive setup justifies `module`.
- Use `@pytest.mark.parametrize` for input matrices.
- Mock external services at HTTP/client boundary — not internal service methods under test.

## Async

- `pytest-asyncio` with explicit async test functions.
- Use test database or transactions rolled back per test.

## API tests

- Test status codes, response schema, and auth rejection paths.
- Never hit production DB or external APIs in CI.

## Coverage

- 100% on spec-touched modules (see **specloom-frontend-test-standards-rules**).
- Cover exception handlers and validation errors.

## Anti-patterns

- `unittest.mock.patch` on the module under test.
- Tests that depend on execution order.
- Sleeping instead of waiting on async conditions.

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `specloom-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

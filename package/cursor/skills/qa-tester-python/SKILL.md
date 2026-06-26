---
name: qa-tester-python
description: >-
  INTERNAL — sdd-qa-tester, sdd-backend-developer agents. Universal Python testing standards.
  Pair with backend-developer-python. Not user-invokable.
disable-model-invocation: true
---

# Python Testing Standards

Pair with **backend-developer-python**.

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

- 100% on spec-touched modules (see **qa-tester-coverage**).
- Cover exception handlers and validation errors.

## Anti-patterns

- `unittest.mock.patch` on the module under test.
- Tests that depend on execution order.
- Sleeping instead of waiting on async conditions.

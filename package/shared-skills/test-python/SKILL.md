---
name: test-python
description: >-
  INTERNAL — specloom-backend-test-standards only. Python testing per PEP 8 and pytest docs.
  Unit, integration, system, performance. Do not load code-python. Not user-invokable.
---

# Python Testing Standards

Professional Python test standards aligned with [PEP 8](https://peps.python.org/pep-0008/), the [pytest documentation](https://docs.pytest.org/en/stable/), and [How to write assertions](https://docs.pytest.org/en/stable/how-to/assert.html). **Testing only.**

## Required test styles (all four per spec work)

| Style | Scope | Layout |
|-------|-------|--------|
| **unit** | Single function/class; deps mocked at boundary | `tests/unit/` |
| **integration** | Services + DB/API/test containers together | `tests/integration/` |
| **system** | Full stack HTTP/worker path as deployed | `tests/system/` |
| **performance** | Latency, throughput, resource smoke | `tests/performance/` |

Map every test to **spec** Requirements or **feature** acceptance criteria (`spec_ref`).

## PEP 8 — test code style

Apply [PEP 8](https://peps.python.org/pep-0008/) to all test modules:

| Rule | Test convention |
|------|-----------------|
| Files | `test_*.py` or `*_test.py` |
| Functions | `test_<behavior>_<condition>` |
| Classes | `Test<Feature>` — no `__init__` in test classes unless needed |
| Imports | stdlib → third-party → local; absolute imports |
| Indentation | 4 spaces; max line length per project formatter |
| Naming | `lower_with_underscores`; descriptive test names |
| Docstrings | PEP 257 on non-obvious integration/system tests |

Run **Ruff/Black** and **mypy** on `tests/` same as application code.

## pytest — core practices

Per [pytest how-to](https://docs.pytest.org/en/stable/how-to/) and [assertions](https://docs.pytest.org/en/stable/how-to/assert.html):

### Assertions

- Use plain **`assert`** — pytest rewrites for rich failure output
- Add message when helpful: `assert x == y, "reason"`
- Floats/arrays: **`pytest.approx`**
- Exceptions: **`pytest.raises`** context manager; use `match=` for message regex
- Exception groups: **`pytest.RaisesGroup`** / **`pytest.RaisesExc`**
- Warnings: **`pytest.warns`**
- Never `return` bool from test — always `assert`

### Structure

- **`conftest.py`** — shared fixtures per directory
- **`@pytest.fixture`** — scope `function` default; `module`/`session` when expensive
- **`@pytest.mark.parametrize`** — input matrices
- **`pytest.mark`** — `slow`, `integration`, `system`, `performance` per project
- **`describe`-style** — optional via `pytest-describe` or nested classes; keep flat when clearer

### Discovery & layout

```
tests/
  unit/
  integration/
  system/
  performance/
  conftest.py
```

Mirror package structure under `tests/`. Read `pyproject.toml` / `pytest.ini` for markers and paths.

## Unit tests

- One logical behavior per test; **AAA** (Arrange, Act, Assert)
- Mock at **HTTP/DB/clock boundaries** — not internals of module under test
- Pure functions, validators, services with injected deps
- `unittest.mock` only when necessary; prefer fakes at boundary

## Integration tests

- Real test DB (transaction rollback or ephemeral container)
- API routes via **httpx** / **TestClient** (FastAPI) / framework test client
- Assert status codes, response schema, auth rejection
- Never production DB or external paid APIs in CI

## System tests

- Full application entry (ASGI app, worker, CLI) with test config
- End-to-end flows from spec acceptance criteria (signup → action → persist)
- Minimal mocking — only external third parties
- Assert behavior matches **spec** and parent **feature**

## Performance tests

- **`pytest-benchmark`** or project standard for hot paths in spec
- Assert p95 latency / throughput within documented thresholds
- Load smoke (e.g. N concurrent requests) when spec requires
- Mark `@pytest.mark.performance` — may run in separate CI job

## Async

- **`pytest-asyncio`** — `async def test_*` with explicit await
- Timeouts on external calls; no bare `sleep` — wait on conditions

## Coverage

- **pytest-cov** — **100%** on spec-touched production modules (see **specloom-backend-test-standards-rules**)
- Cover exception handlers, validation errors, and all branches in manifest files

## Anti-patterns

- `patch` on module under test (couples to implementation)
- Tests depending on execution order
- `time.sleep` instead of polling/retry helpers
- Hitting production services
- Returning values from tests instead of asserting

## References

- [PEP 8](https://peps.python.org/pep-0008/)
- [pytest documentation](https://docs.pytest.org/en/stable/)
- [Writing assertions](https://docs.pytest.org/en/stable/how-to/assert.html)
- [Fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)
- [Parametrize](https://docs.pytest.org/en/stable/how-to/parametrize.html)
- [Markers](https://docs.pytest.org/en/stable/how-to/mark.html)

## Codex Port

Internal — **specloom-backend-test-standards** only. Implicit invocation disabled in `agents/openai.yaml`.

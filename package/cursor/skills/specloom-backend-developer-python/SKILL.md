---
name: specloom-backend-developer-python
description: >-
  INTERNAL ? specloom-backend-developer agents only. Universal python coding standards. Not user-invokable.
disable-model-invocation: true
---
# Python Core Standards

Universal Python standards for backend services, scripts, and tooling. Based on PEP 8 and professional production practice.

## Non-Negotiables

- Target a **pinned Python version** per project (document in `pyproject.toml` / README).
- **Type hints** on all public functions, methods, and class attributes.
- Run **mypy** (or pyright) in strict or near-strict mode for application code.
- **Format** with Black (or Ruff format) — no manual style debates.
- **Lint** with Ruff (or flake8 + plugins) — zero warnings on merge.
- No secrets in source, logs, or exception messages — use environment variables and secret managers.
- No bare `except:` — catch specific exceptions; re-raise or wrap with context.

## Code Layout (PEP 8)

- **4 spaces** per indentation level — no tabs.
- **Max line length 88–100** characters (match formatter config).
- **Two blank lines** before top-level functions and classes; **one blank line** before methods.
- Imports grouped in order: **stdlib ? third-party ? local**, separated by blank lines.
- Use absolute imports; relative imports only within packages where appropriate.
- One statement per line — no compound `if foo: bar()` on one line except trivial guards.

## Naming (PEP 8)

| Kind | Convention |
|------|------------|
| Modules, packages | `lowercase` or `lower_with_underscores` |
| Classes | `CapWords` |
| Functions, variables | `lower_with_underscores` |
| Constants | `UPPER_WITH_UNDERSCORES` |
| Private | leading `_` (single underscore) |
| Name mangling | `__double_leading` only when needed |

- Avoid single-letter names except counters (`i`, `j`, `k`) and unused bindings (`_`).
- Avoid built-in shadowing (`list`, `dict`, `id`, `type`).

## Types and Data

- Use **`typing`** / **`collections.abc`** — prefer `list[str]` over `List[str]` on 3.9+.
- Use **`Optional[T]`** or `T | None` consistently within a project.
- Prefer **`dataclasses`** or **Pydantic models** for structured data over untyped dicts.
- Use **`Enum`** or **`Literal`** for fixed sets of values.
- Validate external input at boundaries (HTTP, CLI, queue messages) — never trust raw dicts deep in the stack.

## Functions and Classes

- **Single responsibility** — functions do one thing; split when name needs "and".
- Keep functions **= 20–30 lines** when practical; extract helpers.
- Prefer **composition** over deep inheritance.
- Use **`@staticmethod` / `@classmethod`** only when semantically correct.
- Default arguments must be **immutable** — never `def f(x=[])`; use `None` and assign inside.
- Docstrings on all public modules, classes, and functions (**PEP 257** — Google or NumPy style, pick one per project).

## Error Handling

- Define domain-specific exception types for recoverable errors.
- Use **`raise ... from err`** to preserve exception chains.
- Log errors with **structured logging** (`structlog`, `logging` with extra fields) — include correlation IDs.
- Fail fast on programming errors (`AssertionError`, `TypeError`) — do not catch and ignore.

## Architecture (Backend)

- **Thin handlers** — route/controller parses request, calls service, returns response.
- **Services** — business logic, orchestration, transactions.
- **Repositories / queries** — database access isolated from HTTP layer.
- **Dependency injection** — pass dependencies explicitly or via framework DI; avoid global singletons.
- **Configuration** — pydantic-settings or equivalent; validate env at startup.

## Async

- Use **`async def`** consistently within an async stack — do not mix blocking I/O in async routes without `run_in_executor`.
- Use **`asyncio.TaskGroup`** (3.11+) or structured concurrency patterns for fan-out.
- Always **await** coroutines; use timeout wrappers on external calls.

## Testing

- **pytest** as the default test runner.
- **Arrange–Act–Assert** structure; one logical assertion focus per test.
- Use **fixtures** for setup; avoid shared mutable global test state.
- **Mock at boundaries** (HTTP, DB, clock) — not internal implementation details.
- Target **high coverage** on business logic and auth/permission paths.
- Property-based tests (Hypothesis) for parsers and validators when valuable.

## Security

- Parameterized queries / ORM only — **never** string-concatenate SQL.
- Validate and sanitize all external input.
- Principle of least privilege for DB roles and cloud credentials.
- Hash passwords with **argon2** or **bcrypt** — never plaintext or reversible encoding.

## Packaging and Tooling

- **`pyproject.toml`** as single source for deps, tools, and metadata.
- Pin dependencies in lock file or constraints for reproducible builds.
- Use **`uv` / `poetry` / `pip-tools`** consistently within a project.
- Pre-commit hooks: format, lint, typecheck, tests on changed files.

## Anti-Patterns

- Mutable default arguments.
- Catching `Exception` and returning `None` without logging.
- Business logic in route handlers or ORM model classes.
- Circular imports — refactor shared types to a neutral module.
- `print()` for application logging in production code.

## Review Checklist

- [ ] Type hints on public API; mypy/pyright passes
- [ ] Black/Ruff format and lint clean
- [ ] Docstrings on public modules/functions
- [ ] No secrets in code or logs
- [ ] Tests for new behavior and edge cases
- [ ] Errors logged with context; specific exception types
- [ ] SQL parameterized; input validated at boundary

## References

- [PEP 8 — Style Guide for Python Code](https://peps.python.org/pep-0008/)
- [PEP 257 — Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 484 — Type Hints](https://peps.python.org/pep-0484/)
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
- [The Hitchhiker's Guide to Python — Structuring Projects](https://docs.python-guide.org/writing/structure/)

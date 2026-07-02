---
name: test-typescript
description: >-
  INTERNAL — specloom-validator, specloom-frontend-developer, specloom-backend-developer agents. Universal TypeScript/JavaScript
  testing standards. Pair with code-typescript. Not user-invokable.
---


# TypeScript Testing Standards

Pair with **code-typescript**. Load when writing or validating TS/JS tests.

## Stack defaults

| Tool | Use |
|------|-----|
| Jest or Vitest | Unit + integration |
| React Testing Library | Components (with test-react) |
| @testing-library/jest-dom | DOM matchers |

Read `AGENTS.md` for project choice.

## Principles

- Test **behavior**, not implementation (no testing private methods or internal state).
- **Arrange–Act–Assert** structure; one logical assertion focus per test.
- **AAA** naming: `should_<expected>_when_<condition>`.
- Mock at **boundaries** (fetch, modules) — not every internal call.
- Use **fake timers** for debounce/throttle; restore after each test.

## Coverage

- 100% lines + branches on spec-touched files (see **specloom-frontend-test-standards-rules**).
- Cover error paths, empty input, and boundary values.
- Every exported function/hook needs at least one test.

## Types in tests

- Type test fixtures and mocks — no `any` in test files.
- Use `satisfies` / typed mock factories for API responses.

## Async

- Always `await` assertions on async UI (`findBy*`, `waitFor`).
- Reject floating promises in tests.

## Anti-patterns

- Snapshot-only tests with no behavioral assertion.
- Testing library implementation details (hook state directly).
- Shared mutable state between tests.

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `specloom-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

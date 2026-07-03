---
name: test-typescript
description: >-
  INTERNAL — specloom-*-test-standards agents only. TypeScript/JavaScript testing standards.
  Unit, integration, system, performance. Do not load code-typescript. Not user-invokable.
---

# TypeScript Testing Standards

Professional TypeScript/JavaScript test standards. **Testing only** — pairs with **test-react** / **test-react-native** for UI layers.

## Required test styles (all four per spec work)

| Style | Scope |
|-------|--------|
| **unit** | Pure functions, hooks, utilities — mocked boundaries |
| **integration** | Multiple modules, API client + handlers, provider trees |
| **system** | Full app path in test env (Playwright/Cypress/API E2E per `AGENTS.md`) |
| **performance** | Render timing, debounce/throttle, list virtualization smoke |

## Stack (read `AGENTS.md`)

| Tool | Use |
|------|-----|
| **Jest** or **Vitest** | Unit + integration |
| **React Testing Library** | Components (with test-react / test-react-native) |
| **@testing-library/jest-dom** | DOM matchers |
| **Playwright** / **Cypress** | System/E2E when adopted |

## Principles

- Test **behavior**, not implementation
- **AAA** — Arrange, Act, Assert; one focus per test
- Mock at **boundaries** (fetch, native modules) — not every internal call
- **Fake timers** for debounce/throttle; restore after each test
- Type fixtures — no `any`; use `satisfies` / typed factories
- Map assertions to **spec** / **feature** (`spec_ref`)

## Async

- `await` assertions (`findBy*`, `waitFor`); no floating promises

## Coverage

- **100%** lines + branches on manifest production files

## Anti-patterns

- Snapshot-only tests without behavioral assertion
- Testing hook/state implementation details
- Shared mutable state between tests

## Codex Port

Internal — specloom-*-test-standards only.

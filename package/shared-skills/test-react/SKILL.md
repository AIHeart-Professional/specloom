---
name: test-react
description: >-
  INTERNAL — specloom-frontend-test-standards only. React testing standards.
  Do not load code-react. Not user-invokable.
---


# React Testing Standards

Professional React test standards. **Testing only** — load **test-typescript** for TS test patterns.

## Library

**React Testing Library** — query as users do (role, label, text).

## Query priority

1. `getByRole` (with accessible name)
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` — last resort only

## Principles

- Render components with required providers (theme, router, query client) via test helpers.
- Fire events with `@testing-library/user-event` — not raw `fireEvent` unless necessary.
- Assert **visible outcomes** — not internal state or prop drilling.
- Test loading, empty, and error states for every async component.
- Map assertions to **spec** requirements and **feature** acceptance criteria.

## Hooks

- Test custom hooks with `renderHook` + `act`.
- Wrap state updates in `act()` when required.

## Mocking

- Mock network at fetch/client boundary.
- Do not mock child components unless isolation is required — prefer real children with stubbed data.

## Anti-patterns

- Enzyme-style shallow rendering of implementation.
- `container.querySelector` for elements RTL can find by role.
- Tests that break when copy changes but behavior is unchanged (over-specific text matchers).

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `specloom-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

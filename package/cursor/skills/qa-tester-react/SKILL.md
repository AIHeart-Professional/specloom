---
name: qa-tester-react
description: >-
  INTERNAL — sdd-qa-tester, sdd-frontend-developer agents. Universal React testing standards.
  Pair with frontend-developer-react and qa-tester-typescript. Not user-invokable.
disable-model-invocation: true
---

# React Testing Standards

Pair with **frontend-developer-react** + **qa-tester-typescript**.

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

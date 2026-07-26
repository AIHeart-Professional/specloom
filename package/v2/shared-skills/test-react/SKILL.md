---
name: test-react
description: >-
  INTERNAL — specloom-test-frontend. React web testing standards.
  Unit, integration, system, performance. Do not load code-react. Not user-invokable.
---

# React Testing Standards

Professional React (web) test standards per [React Testing Overview](https://react.dev/learn/testing). Load **test-typescript** for TS patterns. **Testing only.**

## Required test styles (all four per spec work)

| Style | Scope |
|-------|--------|
| **unit** | Hooks (`renderHook`), utilities, isolated components |
| **integration** | Provider trees, router + data layer together |
| **system** | Playwright/Cypress E2E per `AGENTS.md` |
| **performance** | Interaction latency, large list render smoke |

## Library

**React Testing Library** — query as users do (role, label, text).

### Query priority

1. `getByRole` (accessible name)
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` — last resort

## Component tests

- Render with required providers (theme, router, query client)
- **`@testing-library/user-event`** over raw `fireEvent`
- Assert visible outcomes — loading, empty, error states
- Map to **spec** / **feature** acceptance criteria

## System (E2E)

- Critical user flows from spec; not production API in CI

## Anti-patterns

- Enzyme shallow rendering
- `container.querySelector` when RTL queries work
- Over-specific copy matchers that break on harmless text changes

## References

- [React — Testing](https://react.dev/learn/testing)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Codex Port

Internal — specloom-test-frontend only.

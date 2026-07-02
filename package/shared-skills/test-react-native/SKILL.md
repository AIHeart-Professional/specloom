---
name: test-react-native
description: >-
  INTERNAL — specloom-validator, specloom-frontend-developer agents. Universal React Native testing standards.
  Pair with code-react-native. Not user-invokable.
---


# React Native Testing Standards

Pair with **code-react-native**, **test-react**, **test-typescript**.

## Stack

| Layer | Tool |
|-------|------|
| Unit / component | Jest + React Native Testing Library |
| E2E | Detox, Maestro, or project standard in `AGENTS.md` |

## Component tests

- Use `@testing-library/react-native` queries: `getByText`, `getByRole`, `getByLabelText`.
- Mock `react-native` native modules only when needed — prefer integration-style tests.
- Test navigation with mocked navigators or test harness screens.
- Verify accessibility: `accessibilityLabel`, `accessibilityRole`.

## Platform

- Run tests for both platforms in CI when project supports it.
- Use `Platform.select` mocks sparingly — prefer explicit platform test files when behavior diverges.

## E2E

- Cover critical flows from spec acceptance criteria.
- Test safe area, keyboard dismiss, and scroll on forms.
- No hardcoded delays — use `waitFor` / Detox matchers.

## Anti-patterns

- Testing StyleSheet objects instead of rendered output.
- Snapshot-only tests for entire screens.
- E2E tests that depend on production API.

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `specloom-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

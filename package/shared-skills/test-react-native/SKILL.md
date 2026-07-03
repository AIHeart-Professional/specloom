---
name: test-react-native
description: >-
  INTERNAL — specloom-frontend-test-standards only. React Native testing per reactnative.dev.
  Unit, integration, component, system (E2E), performance. Do not load code-react-native.
  Not user-invokable.
---

# React Native Testing Standards

Professional React Native test standards aligned with the [React Native Testing Overview](https://reactnative.dev/docs/testing-overview) and related RN docs (Jest, RTL, E2E tools). **Testing only.**

## Required test styles (all four per spec work)

| Style | RN guide mapping | When required |
|-------|------------------|---------------|
| **unit** | Unit tests — smallest functions/classes | Pure logic, hooks, utilities in manifest |
| **integration** | Integration tests — real modules combined | Multi-module flows, network/file I/O with test doubles |
| **system** | E2E — device/simulator, user perspective | Critical spec/feature acceptance paths |
| **performance** | Watch mode / load-sensitive paths | List scroll, heavy renders, startup smoke per spec |

Map each test to **spec** Requirements or **feature** acceptance criteria (`spec_ref`).

## Static analysis (pre-test gate)

Per RN docs — run before/with test suite:

- **ESLint** — lint test and production code
- **TypeScript** — `tsc --noEmit` on test + source

Failing static analysis blocks test pass.

## Writing testable code (test author mindset)

- Separate **view** (components) from **business logic** and state
- Test logic without React when possible; component tests for rendering + interaction
- Short tests, one behavior each; **AAA** (Arrange, Act, Assert) / Given-When-Then
- Tests **independent** — no order dependency; use `beforeEach`/`afterEach` for setup/teardown
- Group with `describe`; prefer explicit expectations over large snapshots

## Stack (read `AGENTS.md` for project choice)

| Layer | Tool |
|-------|------|
| Unit / component | **Jest** (RN preset) + **React Native Testing Library** |
| System (E2E) | **Detox**, **Maestro**, or **Appium** |
| Performance | Jest perf markers, RN perf monitor, or project benchmark script |

References: [Jest](https://jestjs.io/), [React Native Testing Library](https://callstack.github.io/react-native-testing-library/), [Detox](https://wix.github.io/Detox/), [Maestro](https://maestro.mobile.dev/).

## Unit tests

- Smallest units: functions, classes, hooks (via `renderHook`)
- **Mock** dependencies at boundaries when real objects unavailable (native modules, network)
- Prefer real objects over mocks when fast and stable
- Fast feedback — use Jest watch mode during development

## Integration tests

Per RN guide, integration when tests:

- Combine several app modules as in production
- Use external systems (with test doubles or sandbox)
- Perform network calls to test APIs
- File or database I/O in JS layer

- Less mocking than unit tests; verify module cooperation
- Use test providers (navigation, query client, theme) as in app

## Component tests

Covers **rendering** and **interaction** (RN docs — separate from pure unit):

- Query as user: visible text, roles, labels — not implementation details
- **Interaction:** `fireEvent` / user-event — `onPress`, `onChangeText`, navigation
- Assert **outcomes** users see — not props/state directly
- Avoid `testID` as primary query; prefer accessibility queries
- **Snapshots:** small only; prefer explicit assertions; use `snapshot-diff` for state diffs
- Note: component tests run in Node — do not catch native iOS/Android bugs; supplement with **system** tests

## System tests (E2E)

- Build release (or project E2E) config; test from **user perspective**
- Tap buttons, type in `TextInput`, assert screen content — not React internals
- Cover auth, core flows, payments per spec — use faster JS tests for non-critical paths
- No hardcoded `sleep` — use Detox/Maestro wait matchers
- Test safe area, keyboard, scroll on forms
- Never hit production APIs in CI

## Performance tests

- Scroll performance on long lists (`FlatList` screens in manifest)
- Render count / re-render guards for hot paths when spec calls for it
- Startup or navigation timing smoke (thresholds in spec or `AGENTS.md`)
- Document baseline and assert regression bounds

## Coverage

- **100% line coverage** on manifest frontend production files (see **specloom-frontend-test-standards-rules**)
- Every spec requirement has at least one test across the four styles (unit/integration/system as appropriate)

## Anti-patterns

- Snapshot-only full-screen tests with no behavioral assertion
- Testing `StyleSheet` objects instead of rendered output
- `testID`-only queries when accessible queries work
- E2E depending on production API or flaky fixed delays
- Component tests as sole proof of native behavior

## References

- [Testing Overview](https://reactnative.dev/docs/testing-overview)
- [React Testing Overview](https://react.dev/learn/testing)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/docs/getting-started)

## Codex Port

Internal — **specloom-frontend-test-standards** only. Implicit invocation disabled in `agents/openai.yaml`.

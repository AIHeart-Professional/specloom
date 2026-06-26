---
name: frontend-developer-react
description: >-
  INTERNAL � sdd-frontend-developer agents only. Universal react coding standards. Not user-invokable.
disable-model-invocation: true
---
# React Core Standards

Universal React standards for all projects (web and shared component logic). Pair with **TypeScript CORE** for `.tsx` files.

## Non-Negotiables

- Follow the **Rules of React** — violations are bugs, not style preferences.
- Components and Hooks must be **pure** during render.
- Enable **Strict Mode** in development.
- Enable **`eslint-plugin-react-hooks`** (recommended + strict) and fix all hook violations.
- Never mutate props, state, context, or values after they are passed to JSX.
- Side effects belong in **event handlers** or **`useEffect`** — never in render.

## Rules of React — Purity

Components and Hooks must be:

| Property | Requirement |
|----------|-------------|
| **Idempotent** | Same props/state/context → same output every render |
| **Side-effect free in render** | No subscriptions, fetches, DOM writes, or timers during render |
| **Non-mutating** | Do not mutate non-local variables, props, state, or hook arguments |

### Forbidden in render

- `Math.random()`, `Date.now()`, `crypto.randomUUID()` (unless seeded/memoized outside render)
- Mutating arrays/objects in props or state (`push`, `sort` in place, direct assignment)
- Fetching data without a proper async pattern (Suspense boundary or effect)
- Writing to refs that affect visible output without a follow-up state update

### Correct patterns

- **User interaction** → event handler (`onClick`, `onSubmit`)
- **Sync with external system** → `useEffect` with correct dependencies + cleanup
- **Derived data** → compute during render from props/state — do not duplicate in state
- **Updates** → use state setters (`setState`, functional updates) — never mutate state directly

## Rules of Hooks

- Call Hooks **only at the top level** of React function components or custom Hooks.
- **Never** call Hooks inside: loops, conditions, nested functions, `try/catch/finally`, after early returns, event handlers, or class components.
- **Never** pass Hooks as values or call them from regular JavaScript functions.
- Custom Hooks must start with `use` and may call other Hooks.
- Extract repeated stateful logic into **custom Hooks** — do not copy-paste effect blocks.

## Component Design

- **One component, one responsibility** — split when render logic hides behavior or exceeds ~150 lines.
- **Props down, events up** — no cross-sibling communication via mutable module variables.
- Prefer **composition** over inheritance; use `children`, render props, or slots.
- Keep **presentational** components free of data-fetching; container components own data loading.
- Colocate styles, tests, and types with components when the project structure allows.
- Use **fragments** (`<>...</>`) to avoid unnecessary wrapper DOM nodes.

## State

- Store **minimum source-of-truth** state; derive everything else during render (`useMemo` only when profiling shows need).
- **Lift state** only as high as needed — avoid global state for local UI concerns.
- Prefer **key** prop to reset component state over effect-driven resets.
- For complex state, use **`useReducer`** with typed actions — avoid many coupled `useState` calls.
- URL, server cache, and form libraries (React Query, Router, React Hook Form) own their domains — do not mirror in redundant local state.

## Effects

- Effects synchronize with **external systems** (network, browser APIs, third-party widgets).
- If you can compute it from existing state/props, **you do not need an Effect**.
- Always declare **complete dependency arrays** — do not lie to the linter.
- Return a **cleanup function** for subscriptions, timers, listeners, and abort controllers.
- Prefer **AbortController** for fetch cleanup in effects.

## Performance

- Do not premature-optimize with `memo` / `useMemo` / `useCallback` — measure first.
- Use `React.memo` for expensive pure components receiving stable props.
- Use **`key`** on lists — stable, unique IDs, never array index when list can reorder.
- Lazy-load routes and heavy components with `React.lazy` + `Suspense` where appropriate.
- Avoid creating new object/array literals in props to memoized children every render.

## Accessibility and UX

- Use semantic HTML elements before ARIA overrides.
- Every interactive control must be **keyboard reachable** with visible focus.
- Images require meaningful `alt`; decorative images use `alt=""`.
- Form inputs must have associated labels (`htmlFor` / `aria-label`).
- Loading, empty, and error states are required — never blank screens on failure.

## Error Handling

- Use **Error Boundaries** for unexpected render errors in feature sections.
- Handle async errors in event handlers and data layers — surface user-friendly messages.
- Never expose raw stack traces to end users in production.

## Testing

- Test behavior users see — not implementation details.
- Prefer **React Testing Library** queries by role/label/text.
- Avoid testing internal state; interact via public UI.

## Anti-Patterns

- Calling component functions directly (`MyComponent()`) instead of `<MyComponent />`.
- Storing derived values in state that could be computed from other state.
- `useEffect` to respond to user events that should be event handlers.
- Index as `key` on dynamic sortable/filterable lists.
- Prop drilling more than 2–3 levels without context or composition refactor.

## Review Checklist

- [ ] Render is pure — no side effects or mutations
- [ ] Hooks at top level only; ESLint hooks rules pass
- [ ] Derived state computed, not duplicated
- [ ] Effects have deps + cleanup where needed
- [ ] Lists keyed correctly
- [ ] Loading/empty/error states present
- [ ] Accessibility basics verified

## References

- [Rules of React](https://react.dev/reference/rules)
- [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [Thinking in React](https://react.dev/learn/thinking-in-react)

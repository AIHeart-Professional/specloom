---
name: code-react-native
description: >-
  INTERNAL � sdd-frontend agents only. Universal react-native coding standards. Not user-invokable.
---

# React Native Core Standards

Universal React Native standards for mobile apps. Requires **React CORE** and **TypeScript CORE**. UI layout specifics may extend via project topic docs (e.g. `react-native-ui.md`).

## Non-Negotiables

- React Native runs on **React** — all Rules of React and Rules of Hooks apply.
- Use **TypeScript** for all application code.
- Use **Flexbox** for layout — no web-only CSS assumptions.
- Test on **both iOS and Android** (or document platform-specific divergence in spec).
- Handle **safe areas**, **keyboard**, and **notch** behavior explicitly.
- Never hardcode secrets, API keys, or tokens in source — use secure env/config patterns.

## Architecture

- Separate concerns:
  - **Screens** — route-level composition and navigation wiring
  - **Components** — reusable UI primitives
  - **Hooks** — reusable stateful logic
  - **Services** — API clients, storage, analytics
  - **Types** — shared domain models
  - **Theme/tokens** — colors, spacing, typography
- Keep business logic out of large screen components — extract hooks and services.
- Prefer **feature folders** or **layer folders** — stay consistent within the project.

## Core Components and Layout

- Use React Native core components: `View`, `Text`, `TextInput`, `Pressable`, `ScrollView`, `FlatList`, `SectionList`, `Image`, `SafeAreaView` / safe area context.
- **One `Text` per text node** — nested `Text` only when styling substrings.
- Use **`Pressable`** over legacy `TouchableOpacity` for new code unless design system dictates otherwise.
- **`FlatList` / `SectionList`** for long lists — never map large arrays inside `ScrollView`.
- Provide **`keyExtractor`** with stable unique IDs — never index alone on reorderable data.
- Use **`contentContainerStyle`** on scrollables for padding — not margin on the scroll view itself.
- Prefer **`StyleSheet.create`** or typed theme tokens over inline style objects in hot paths.

## Flexbox

- Default `flexDirection` is **column** — explicit when using row layouts.
- Avoid fixed pixel dimensions for responsive regions — prefer flex, percentages, or `Dimensions`/`useWindowDimensions`.
- Use **`flexShrink`**, **`flexGrow`**, **`minHeight`/`maxHeight`** to prevent text overlap and clipping.
- Test layouts at multiple screen sizes and font scale settings (accessibility).

## Platform

- Use **`Platform.OS`** and **`Platform.select`** for intentional platform differences.
- Use **`.ios.ts` / `.android.ts`** file splits only when divergence is substantial.
- Prefer cross-platform libraries maintained for RN (navigation, gestures, reanimated) over custom native bridges unless required.
- Document any native module or permission requirement in spec **Required Context**.

## Navigation

- Type navigation params — use typed navigators (React Navigation typed routes).
- Pass **minimal serializable params** — prefer IDs over full objects.
- Deep links and universal links must be validated and typed.

## State and Data

- **Props** configure components; **state** tracks data that changes over time (React model).
- Server state: prefer a dedicated cache layer (TanStack Query, etc.) over ad-hoc `useEffect` fetches.
- Persist sensitive data with **SecureStore** / Keychain — not AsyncStorage.
- Optimistic UI must handle rollback on failure.

## Performance

- **`React.memo`** on list item components when profiling shows benefit.
- **`useCallback` / `useMemo`** only when tied to memoized children or expensive pure compute.
- Images: specify **`width`/`height`**, use appropriate **`resizeMode`**, prefer CDN-sized assets.
- Enable **Hermes** (default in modern RN) — avoid patterns incompatible with Hermes.
- Avoid anonymous functions as list `renderItem` when it breaks memoization — extract stable callbacks.

## Accessibility

- Every touch target **minimum 44×44** density-independent points.
- **`accessibilityLabel`**, **`accessibilityRole`**, **`accessibilityState`** on interactive elements.
- Support **screen readers** (VoiceOver, TalkBack) — test with them enabled.
- Respect **font scaling** — avoid disabling `allowFontScaling` unless spec requires fixed layout.
- Color contrast must meet **WCAG AA** for text and controls.

## Networking and Errors

- Centralize HTTP client configuration (base URL, auth headers, timeouts, retries).
- Handle offline and slow network — show loading and retry affordances.
- Never block the JS thread with synchronous heavy work — offload or chunk.

## Testing

- **Jest** for unit tests; **React Native Testing Library** for component tests.
- Detox / Maestro / Appium for E2E when the project adopts them.
- Test navigation flows and platform-specific permissions where applicable.

## Anti-Patterns

- Web components or DOM APIs in RN code (`div`, `span`, `window`).
- `ScrollView` wrapping large mapped lists.
- Inline styles with magic numbers duplicated across screens — use theme tokens.
- `console.log` in production paths — use structured logging.
- Ignoring safe area on notched devices.
- Fetching in render instead of event handlers, focus effects, or query libraries.

## Review Checklist

- [ ] Rules of React satisfied
- [ ] Lists use FlatList/SectionList with stable keys
- [ ] Safe area and keyboard handled on forms
- [ ] Touch targets and accessibility labels present
- [ ] No secrets in source
- [ ] Tested on iOS and Android (or divergence documented)
- [ ] Performance: no ScrollView anti-pattern for long lists

## References

- [React Native — Introduction to React](https://reactnative.dev/docs/intro-react)
- [React Native — Style](https://reactnative.dev/docs/style)
- [React Native — FlatList](https://reactnative.dev/docs/flatlist)
- [React Native — Platform](https://reactnative.dev/docs/platform-specific-code)
- [React Native — Performance](https://reactnative.dev/docs/performance)
- [React Native — Accessibility](https://reactnative.dev/docs/accessibility)
- [Rules of React](https://react.dev/reference/rules)

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `sdd-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

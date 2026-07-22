---
name: specloom-frontend-developer-react-native
description: >-
  INTERNAL ? specloom-frontend-developer agents only. Universal React Native coding standards. No testing ù use test-react-native in specloom-tester. Not user-invokable.
disable-model-invocation: true
---
# React Native Core Standards

Universal React Native standards for mobile apps. Requires **React CORE** and **TypeScript CORE**. UI layout specifics may extend via project topic docs (e.g. `react-native-ui.md`).

## Non-Negotiables

- React Native runs on **React** ù all Rules of React and Rules of Hooks apply.
- Use **TypeScript** for all application code.
- Use **Flexbox** for layout ù no web-only CSS assumptions.
- Test on **both iOS and Android** (or document platform-specific divergence in spec).
- Handle **safe areas**, **keyboard**, and **notch** behavior explicitly.
- Never hardcode secrets, API keys, or tokens in source ù use secure env/config patterns.

## Architecture

- Separate concerns:
  - **Screens** ù route-level composition and navigation wiring
  - **Components** ù reusable UI primitives
  - **Hooks** ù reusable stateful logic
  - **Services** ù API clients, storage, analytics
  - **Types** ù shared domain models
  - **Theme/tokens** ù colors, spacing, typography
- Keep business logic out of large screen components ù extract hooks and services.
- Prefer **feature folders** or **layer folders** ù stay consistent within the project.

## Core Components and Layout

- Use React Native core components: `View`, `Text`, `TextInput`, `Pressable`, `ScrollView`, `FlatList`, `SectionList`, `Image`, `SafeAreaView` / safe area context.
- **One `Text` per text node** ù nested `Text` only when styling substrings.
- Use **`Pressable`** over legacy `TouchableOpacity` for new code unless design system dictates otherwise.
- **`FlatList` / `SectionList`** for long lists ù never map large arrays inside `ScrollView`.
- Provide **`keyExtractor`** with stable unique IDs ù never index alone on reorderable data.
- Use **`contentContainerStyle`** on scrollables for padding ù not margin on the scroll view itself.
- Prefer **`StyleSheet.create`** or typed theme tokens over inline style objects in hot paths.

## Flexbox

- Default `flexDirection` is **column** ù explicit when using row layouts.
- Avoid fixed pixel dimensions for responsive regions ù prefer flex, percentages, or `Dimensions`/`useWindowDimensions`.
- Use **`flexShrink`**, **`flexGrow`**, **`minHeight`/`maxHeight`** to prevent text overlap and clipping.
- Test layouts at multiple screen sizes and font scale settings (accessibility).

## Platform

- Use **`Platform.OS`** and **`Platform.select`** for intentional platform differences.
- Use **`.ios.ts` / `.android.ts`** file splits only when divergence is substantial.
- Prefer cross-platform libraries maintained for RN (navigation, gestures, reanimated) over custom native bridges unless required.
- Document any native module or permission requirement in spec **Required Context**.

## Navigation

- Type navigation params ù use typed navigators (React Navigation typed routes).
- Pass **minimal serializable params** ù prefer IDs over full objects.
- Deep links and universal links must be validated and typed.

## State and Data

- **Props** configure components; **state** tracks data that changes over time (React model).
- Server state: prefer a dedicated cache layer (TanStack Query, etc.) over ad-hoc `useEffect` fetches.
- Persist sensitive data with **SecureStore** / Keychain ù not AsyncStorage.
- Optimistic UI must handle rollback on failure.

## Performance

- **`React.memo`** on list item components when profiling shows benefit.
- **`useCallback` / `useMemo`** only when tied to memoized children or expensive pure compute.
- Images: specify **`width`/`height`**, use appropriate **`resizeMode`**, prefer CDN-sized assets.
- Enable **Hermes** (default in modern RN) ù avoid patterns incompatible with Hermes.
- Avoid anonymous functions as list `renderItem` when it breaks memoization ù extract stable callbacks.

## Accessibility

- Every touch target **minimum 44ù44** density-independent points.
- **`accessibilityLabel`**, **`accessibilityRole`**, **`accessibilityState`** on interactive elements.
- Support **screen readers** (VoiceOver, TalkBack) ù test with them enabled.
- Respect **font scaling** ù avoid disabling `allowFontScaling` unless spec requires fixed layout.
- Color contrast must meet **WCAG AA** for text and controls.

## Networking and Errors

- Centralize HTTP client configuration (base URL, auth headers, timeouts, retries).
- Handle offline and slow network ù show loading and retry affordances.
- Never block the JS thread with synchronous heavy work ù offload or chunk.

## Anti-Patterns

- Web components or DOM APIs in RN code (`div`, `span`, `window`).
- `ScrollView` wrapping large mapped lists.
- Inline styles with magic numbers duplicated across screens ù use theme tokens.
- `console.log` in production paths ù use structured logging.
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

- [React Native ù Introduction to React](https://reactnative.dev/docs/intro-react)
- [React Native ù Style](https://reactnative.dev/docs/style)
- [React Native ù FlatList](https://reactnative.dev/docs/flatlist)
- [React Native ù Platform](https://reactnative.dev/docs/platform-specific-code)
- [React Native ù Performance](https://reactnative.dev/docs/performance)
- [React Native ù Accessibility](https://reactnative.dev/docs/accessibility)
- [Rules of React](https://react.dev/reference/rules)

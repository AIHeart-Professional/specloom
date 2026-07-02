---
name: specloom-frontend-developer-typescript
description: >-
  INTERNAL ? specloom-frontend-developer, specloom-backend-developer agents only. Universal typescript coding standards. Not user-invokable.
disable-model-invocation: true
---
# TypeScript Core Standards

Universal TypeScript standards for all projects. Apply to every `.ts` / `.tsx` file unless an active spec documents an approved exception.

## Non-Negotiables

- Enable **strict** mode in `tsconfig` (`strict`, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess` when feasible).
- No `any` except at documented migration boundaries — prefer `unknown` and narrow.
- Use primitive types (`string`, `number`, `boolean`, `symbol`) — never boxed wrappers (`String`, `Number`, `Boolean`, `Object`).
- No silent failures. Handle errors explicitly; never swallow exceptions without logging or user feedback.
- No `@ts-ignore`. Use `@ts-expect-error` with a comment when suppression is unavoidable.
- Exported APIs must have explicit return types and documented public contracts (TSDoc).

## Types and Generics

- Prefer **`unknown`** over `any` for external or untrusted input; narrow with type guards or schema validation.
- Use **`readonly`** for immutable data structures, config objects, and DTOs that must not mutate.
- Prefer **discriminated unions** for state machines, async results, and variant payloads.
- Use **`as const`** for literal maps, token objects, and fixed enumerations — avoid accidental widening.
- Generics must use their type parameters meaningfully — no unused type parameters.
- Prefer **union types** over overload sets that differ only by one argument type.
- Sort overloads from **most specific to most general** signature.
- Prefer **optional parameters** over multiple overloads that differ only in trailing arity (same return type).
- Callbacks whose return value is ignored must use **`void`**, not `any`.
- Callback parameters should be **non-optional** unless the API truly supports variable arity; callers may ignore args.
- Use **`object`** (lowercase) for non-primitive objects — not `Object`.

## Nullability and Equality

- Pick one absence representation per field (`null` vs `undefined`) and stay consistent within a module.
- Use strict null checks; avoid non-null assertion (`!`) unless immediately preceded by a guard or invariant comment.
- Prefer optional chaining (`?.`) and nullish coalescing (`??`) over nested conditionals.

## Functions and Modules

- Prefer **pure functions** for transforms, formatting, filtering, and mapping.
- Single responsibility — one reason to change per function.
- Avoid boolean parameter pairs; use options objects or named variants.
- No magic strings — use constants, enums, or union types.
- Prefer **named exports** for shared modules; default export only for app entry or framework convention.
- Avoid circular dependencies; extract shared types to a neutral module when needed.
- Keep barrel files (`index.ts`) thin — re-export only, no logic.

## Naming

| Kind | Convention |
|------|------------|
| Types, interfaces, enums | `PascalCase` |
| Functions, variables | `camelCase` |
| Constants (true immutables) | `SCREAMING_SNAKE_CASE` or `camelCase` per project |
| Generic type parameters | `T`, `TData`, `TError` — descriptive when multiple |
| Files | `kebab-case.ts` or match host framework convention |

## Classes and Interfaces

- Prefer **`interface`** for object shapes that may be extended; use **`type`** for unions, intersections, and mapped types.
- Use `implements` for contracts; avoid deep inheritance hierarchies.
- Mark class fields `readonly` when not reassigned after construction.

## Async and Errors

- Always **`await`** or return Promises explicitly — no floating promises in application code.
- Use **`Result` / typed error** patterns or discriminated unions for fallible operations when the codebase adopts them.
- Never cast Promise results with `as` without validation at the boundary.

## Documentation

- **TSDoc** (`/** ... */`) on all exported functions, classes, interfaces, and types.
- Document *why* and *contract*, not redundant type information.
- Use `@param`, `@returns`, `@throws`, `@example`, `@deprecated`, `@internal` appropriately.
- Inline comments explain non-obvious business rules only — remove dead and commented-out code.

## Tooling

- Run `tsc --noEmit` (or project typecheck script) before marking work complete.
- Run ESLint + Prettier (or Biome) with TypeScript rules enabled.
- Enable `eslint-plugin@typescript-eslint` recommended and strict configs where available.

## Anti-Patterns

- Type assertions to bypass the compiler (`as SomeType`) without runtime validation at boundaries.
- Empty interfaces used as aliases — use `type` instead.
- Enums when a const object + union is simpler and tree-shake friendly (team choice — stay consistent).
- Duplicated domain types across modules — single source of truth.

## Review Checklist

- [ ] Strict mode passes with zero errors
- [ ] No `any` without documented boundary exception
- [ ] External input narrowed from `unknown`
- [ ] Exported APIs typed and TSDoc'd
- [ ] No floating promises
- [ ] Naming matches conventions
- [ ] No circular imports introduced

## References

- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [TypeScript Handbook — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

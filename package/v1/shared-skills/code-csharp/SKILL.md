---
name: code-csharp
description: >-
  INTERNAL — specloom-game-developer agents only. Universal C# coding standards per Microsoft conventions.
  No testing — use test-csharp in specloom-tester. Not user-invokable.
---

# C# Core Standards

Universal C# standards for application and game code. Based on [Common C# code conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions) and [Framework Design Guidelines](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/).

## Non-Negotiables

- Target a **pinned .NET SDK** per project (`global.json` or `Directory.Build.props`).
- Enable **nullable reference types** (`<Nullable>enable</Nullable>`).
- Enable **analyzers** and **treat warnings as errors** in CI for application projects.
- Use **EditorConfig** (copy [dotnet/docs .editorconfig](https://github.com/dotnet/docs/blob/main/.editorconfig) as baseline).
- No secrets in source, logs, or exception messages — use user secrets, env vars, or vaults.
- Catch **specific** exceptions only — never bare `catch` without filter unless rethrowing.

## File and namespace layout

- **File-scoped namespaces:** `namespace MyGame.Core;`
- **`using` directives outside** the namespace declaration (fully qualified imports).
- One primary type per file when practical; file name matches type name.
- **4 spaces** indentation; UTF-8 with BOM optional per team EditorConfig.

## Naming

| Kind | Convention |
|------|------------|
| Namespaces, types, methods, properties, events | **PascalCase** |
| Parameters, locals | **camelCase** |
| Private fields | `_camelCase` (leading underscore) |
| Constants | **PascalCase** or `UPPER_SNAKE` per project — pick one |
| Interfaces | `I` prefix (`IPlayerService`) |
| Async methods | `Async` suffix (`LoadAsync`) |

- Use **language keywords** (`string`, `int`) over BCL type names (`String`, `Int32`).
- Prefer **`int`** over unsigned types unless domain requires unsigned.

## Types and variables

- Use **`var`** only when type is obvious from the right-hand side (`new`, cast, literal).
- Do **not** use `var` when type is unclear from method return alone.
- Use **`required`** properties or constructors for mandatory initialization.
- **Collection expressions:** `int[] nums = [1, 2, 3];`
- Primary constructor parameters: **PascalCase** on `record`, **camelCase** on `class`/`struct`.
- Prefer **`Func<>` / `Action<>`** over custom delegate types unless public API surface.

## Strings and collections

- **String interpolation** for short concatenation; **`StringBuilder`** for loops on large text.
- **Raw string literals** over escape-heavy strings.
- **LINQ** for collection transforms — meaningful query variable names; `where` before `orderby`.
- Prefer **`foreach`** with explicit element type when not obvious from collection.

## Methods and classes

- **Single responsibility** — split when name needs "and".
- **XML doc comments** (`///`) on all public APIs.
- **`async`/`await`** for I/O-bound work; use `ConfigureAwait(false)` in library code when appropriate.
- Avoid **deadlocks** — no `.Result` / `.Wait()` on UI or game thread without documented reason.
- **`IDisposable` / `IAsyncDisposable`** — implement and call `using` / `await using` consistently.

## Error handling

- Throw **specific** exception types with actionable messages.
- Use **`throw;`** to preserve stack when rethrowing — not `throw ex`.
- Validate arguments at public boundaries (`ArgumentNullException.ThrowIfNull`).

## Security (embedded — no separate security-* skill)

- Never trust client input — validate at boundaries.
- Use parameterized queries / ORM — no string-built SQL.
- Hash secrets with modern algorithms (ASP.NET Identity, Argon2 via libs) — never reversible encoding.
- Principle of least privilege for cloud credentials and DB roles.
- Sanitize paths before file I/O — no user-controlled `..` segments.

## Tooling

- **Format:** `dotnet format`
- **Build:** `dotnet build` with analyzers enabled
- **Package:** central package management (`Directory.Packages.props`) when multi-project

## Anti-patterns

- `var` everywhere obscuring intent.
- `using` inside namespace (ambiguous resolution).
- Catching `Exception` and returning default without logging.
- Blocking async with `.GetAwaiter().GetResult()` in hot paths.
- Public mutable fields — use properties.

## Review checklist

- [ ] Nullable enabled; no unintended null warnings suppressed
- [ ] Analyzers clean on changed files
- [ ] Public APIs documented
- [ ] Async used correctly; no sync-over-async in game loop
- [ ] No secrets in source

## References

- [C# coding conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- [Framework Design Guidelines](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/)
- [Nullable reference types](https://learn.microsoft.com/en-us/dotnet/csharp/nullable-references)
- [Code analysis configuration](https://learn.microsoft.com/en-us/dotnet/fundamentals/code-analysis/configuration-options)

## Codex Port

Internal — **specloom-game-developer** only. Implicit invocation disabled in `agents/openai.yaml`.

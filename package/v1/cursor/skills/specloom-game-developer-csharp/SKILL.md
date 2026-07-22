---
name: specloom-game-developer-csharp
description: >-
  INTERNAL — specloom-game-developer only. C# coding standards per Microsoft conventions.
  No testing — use test-csharp in specloom-tester. Not user-invokable.
disable-model-invocation: true
---

# C# Core Standards (game projects)

Load **code-csharp** for full universal rules. This skill mirrors project agent binding.

## Non-Negotiables

- Pinned .NET SDK; nullable reference types enabled
- EditorConfig + analyzers; warnings as errors in CI
- File-scoped namespaces; `using` outside namespace
- `async`/`await` for I/O; no sync-over-async in game loop hot paths
- No secrets in source

## Game-specific C# notes

- Prefer **structs** for small hot-path data when profiling supports it
- Avoid LINQ allocations in per-frame Update paths unless spec allows
- Use **`readonly`** fields and **init** properties for immutable config
- Event handlers: prefer lambdas only when unsubscribe not needed

## Repo extensions

Read `docs/code/csharp/CORE.md` when listed in spec **Required Context**.

## References

- [C# coding conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)

---
name: specloom-game-developer-monogame
description: >-
  INTERNAL — specloom-game-developer only. MonoGame standards per docs.monogame.net.
  Requires code-csharp. No testing — use test-monogame in specloom-tester. Not user-invokable.
disable-model-invocation: true
---

# MonoGame Core Standards (game projects)

Load **code-monogame** for full universal rules. Requires **code-csharp**.

## Non-Negotiables

- Separate **Core** logic from `Game` / Draw code
- `Content.Load<T>()` — extensionless paths; pipeline-built assets
- `base.Update` / `base.Draw` always called
- Scene `ContentManager` unload on transition
- Input polled in **Update** only

## Architecture

| Layer | Responsibility |
|-------|----------------|
| **Core** | Rules, FSM, collision, scoring — testable without GPU |
| **Systems** | Per-tick updates |
| **Scenes** | Load/unload content, wire systems |
| **Game** | Bootstrap, loop delegation |

## Repo extensions

Read `docs/code/monogame/CORE.md` when listed in spec **Required Context**.

## References

- [MonoGame documentation](https://docs.monogame.net/articles/)

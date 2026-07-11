---
name: code-monogame
description: >-
  INTERNAL — specloom-game-developer agents only. MonoGame game development standards per docs.monogame.net.
  Requires code-csharp. No testing — use test-monogame in specloom-tester. Not user-invokable.
---

# MonoGame Core Standards

Universal MonoGame standards for 2D/3D games. Based on the full [MonoGame documentation](https://docs.monogame.net/articles/) (getting started, tutorials, how-tos, API reference). Requires **code-csharp**.

## Philosophy

MonoGame is **bring your own tools** — a framework, not a scene editor. You own architecture, tooling, and content workflow. Design for **testable game logic** separated from rendering.

## Project structure

```
GameProject/
  Game1.cs                 # or named Game subclass — entry point
  Content/
    Content.mgcb           # MonoGame Content Builder project
  Core/                    # pure logic — no GraphicsDevice dependency
  Systems/                 # update systems
  Scenes/                  # scene/state management
  Components/              # GameComponent / DrawableGameComponent
  Platforms/               # platform-specific when needed
```

- One **`Game`** subclass per executable — name reflects game (`DungeonSlimeGame`), not generic `Game1` in mature projects.
- Keep **hot paths** (Update/Draw) thin — delegate to systems/scenes.

## Game loop

Per [Understanding the Code](https://docs.monogame.net/articles/getting_started/3_understanding_the_code.html):

| Method | Responsibility |
|--------|----------------|
| **Constructor** | `GraphicsDeviceManager`, `Content.RootDirectory`, window settings |
| **Initialize** | Services, non-graphic setup — call `base.Initialize()` (triggers `LoadContent`) |
| **LoadContent** | `Content.Load<T>()`, create `SpriteBatch` / render resources |
| **Update** | Input, simulation, audio triggers — always `base.Update(gameTime)` |
| **Draw** | Clear, render — always `base.Draw(gameTime)` |
| **UnloadContent** | Dispose scene `ContentManager` instances |

- Use **`GameTime`** (`TotalGameTime`, `ElapsedGameTime`, `IsRunningSlowly`) — never assume fixed delta without `IsFixedTimeStep`.
- Exit via `Exit()` — handle Back/Escape in Update per platform norms.

## Content pipeline

Per [Content Pipeline](https://docs.monogame.net/articles/tutorials/building_2d_games/05_content_pipeline/):

1. Add assets in **MGCB Editor** (`Content.mgcb`).
2. Build compiles to `.xnb` via `MonoGame.Content.Builder.Tasks`.
3. Load at runtime: `Content.Load<Texture2D>("images/logo")` — **no file extension**, path relative to content root.

- Set `Content.RootDirectory = "Content"` in Game constructor.
- **Scene-scoped `ContentManager`:** create per scene, `Unload()` on transition — prevents memory leaks.
- **Dispose** `ContentManager` and `IDisposable` assets when unloading.
- Prefer pipeline-processed assets over raw runtime loads except documented exceptions (PNG/JPG/BMP as `Texture2D`).

## 2D rendering

- One **`SpriteBatch`** per frame pass — `Begin()` → draws → `End()`.
- **`GraphicsDevice.Clear`** before drawing each frame.
- Use **`SpriteSortMode`** intentionally (`Deferred` vs `Texture`) for batching.
- Origin, scale, rotation explicit — avoid magic pivot assumptions.

## 3D rendering

- Set up **BasicEffect** or custom shaders per spec.
- Manage **depth buffer** state (`DepthStencilState`) explicitly.
- Cull and sort draws for performance on target hardware.

## Input

- Poll input in **Update**, not Draw: `Keyboard.GetState()`, `Mouse.GetState()`, `GamePad.GetState()`, `TouchPanel.GetState()`.
- Abstract input behind **`IInputService`** or similar for testability.
- Support **gamepad + keyboard** minimum on desktop; touch on mobile per platform build.

## Audio

- **`SoundEffect`** for SFX — load via content pipeline.
- **`Song` / `MediaPlayer`** for music — respect platform media rules.
- Volume and mute respect user settings.

## Components

- **`GameComponent`** — logic updates; **`DrawableGameComponent`** — draw hooks.
- Register with `Components.Add()` — `base.Update`/`Draw` invokes them.
- Prefer composition over monolithic `Game` subclass as project grows.

## Math and coordinates

- Use **`Vector2`**, **`Rectangle`**, **`Matrix`** from `Microsoft.Xna.Framework`.
- Document coordinate system (top-left origin for 2D screen space).
- Keep simulation math in **Core** without `SpriteBatch` references.

## Multi-platform

- Build per **MonoGame platform** target (DesktopGL, WindowsDX, Android, iOS, etc.).
- Use **`#if`** or partial classes only when platform divergence is substantial.
- Test on every shipped platform in CI when feasible.

## Performance

- Avoid allocations in Update/Draw hot paths — pool lists, reuse structs.
- Profile with platform tools; respect `IsRunningSlowly`.
- Batch draws; minimize `SpriteBatch.Begin`/`End` pairs per frame.

## Anti-patterns

- Heavy logic directly in `Game1` without systems/scenes.
- Loading all assets in one `LoadContent` for large games — use scene managers.
- Creating `Texture2D` every frame.
- Skipping `base.Update` / `base.Draw` — breaks components.
- Hardcoded content paths without constants.
- Blocking I/O on game thread.

## Review checklist

- [ ] Logic separated from Game/render code
- [ ] Content loaded via pipeline; paths extensionless
- [ ] Scene unload disposes content
- [ ] Input polled in Update only
- [ ] `base.Update`/`base.Draw` called
- [ ] Platform targets documented in spec

## References

- [MonoGame documentation hub](https://docs.monogame.net/articles/)
- [Understanding the Code](https://docs.monogame.net/articles/getting_started/3_understanding_the_code.html)
- [Game API](https://docs.monogame.net/api/Microsoft.Xna.Framework.Game.html)
- [ContentManager API](https://docs.monogame.net/api/Microsoft.Xna.Framework.Content.ContentManager.html)
- [Building 2D Games tutorial](https://docs.monogame.net/articles/tutorials/building_2d_games/03_the_game1_file/)

## Codex Port

Internal — **specloom-game-developer** only. Load **code-csharp** first.

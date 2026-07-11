---
name: test-monogame
description: >-
  INTERNAL — specloom-game-test-standards only. MonoGame game testing standards per docs.monogame.net.
  Unit, integration, system, performance. Do not load code-monogame. Not user-invokable.
---

# MonoGame Testing Standards

Game test standards aligned with [MonoGame documentation](https://docs.monogame.net/articles/) and the four-style SpecLoom bar. Load **test-csharp** for general C# test patterns.

## Required test styles (all four per spec work)

| Style | Scope | RN guide parallel |
|-------|-------|-------------------|
| **unit** | Core logic, FSM, collision math, scoring — **no GraphicsDevice** | Unit tests |
| **integration** | Systems + services combined; mock input/content | Integration tests |
| **system** | Full `Game` subclass run headless or windowed smoke | E2E / system |
| **performance** | Frame time, allocation, draw-call smoke | Performance |

Map tests to **spec** / **feature** acceptance criteria (`spec_ref`).

## Testable architecture (mandatory)

Per MonoGame docs — separate **view** (Draw) from **logic** (Update/simulation):

- **`Core/`** projects: zero references to `Microsoft.Xna.Framework.Graphics`
- Inject **`IInputService`**, **`IGameTime`**, **`IRandom`** for deterministic tests
- **`Game` subclass** wires systems — logic tests never need `SpriteBatch`

## Stack (read `AGENTS.md`)

| Tool | Use |
|------|-----|
| **xUnit** + **test-csharp** patterns | Runner |
| **MonoGame test host** or custom `Game` harness | System tests |
| **BenchmarkDotNet** | Simulation perf |
| **Moq / NSubstitute** | Input and service mocks |

## Unit tests

- Collision, movement, AI decisions, inventory rules, save/load serializers
- Feed **fixed `GameTime`** or abstracted delta — no real wall clock
- **`[Theory]`** for grid positions, damage tables, edge coordinates
- Golden-file tests for level data when spec requires

## Integration tests

- Multiple systems in one update tick (physics + combat + events)
- **`ContentManager`** with test `.xnb` assets or mocked `IContentProvider`
- Input sequences as data: `PressKey(Keys.Space)` then assert state
- Audio/render stubs — verify **calls**, not GPU output

## System tests

- Launch game with **`--smoke`** or test `Game` subclass that auto-exits
- Assert scene transitions, score HUD values via exposed test hooks
- **Windowed** runs in CI only when headless unsupported — document in `AGENTS.md`
- Cover critical flows: boot → menu → gameplay → pause → exit per spec
- Never depend on production CDN or live services

## Performance tests

- **Update-only** benchmark: N ticks without Draw
- Allocation assertions on hot paths (`GC.GetAllocatedBytesForCurrentThread`)
- Frame budget smoke: average `ElapsedGameTime` under threshold
- Large entity count stress per spec (e.g. 500 sprites)

## Content and pipeline tests (integration)

- Verify `Content.mgcb` builds in CI
- Load test assets — assert non-null and expected dimensions
- Migration tests when content format changes

## Coverage

- **100%** on manifest `layer: game` production files
- Core logic must reach 100% even when Draw is thin

## Anti-patterns

- Unit tests requiring `GraphicsDevice` when logic could be extracted
- Screenshot pixel comparison as only assertion (flaky)
- System tests with hardcoded `Thread.Sleep`
- Testing `SpriteBatch` matrix math instead of game outcomes

## References

- [MonoGame — Testing Overview concepts](https://docs.monogame.net/articles/) (testable code, game loop)
- [Game class](https://docs.monogame.net/api/Microsoft.Xna.Framework.Game.html)
- [test-csharp](../test-csharp/SKILL.md) — C# test foundation

## Codex Port

Internal — **specloom-game-test-standards** only. Pair with **test-csharp**.

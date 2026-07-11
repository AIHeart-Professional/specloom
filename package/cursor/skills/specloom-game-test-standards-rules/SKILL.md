---
name: specloom-game-test-standards-rules
description: INTERNAL — specloom-game-test-standards only. Game test types, coverage, spec/feature mapping. Not user-invokable.
disable-model-invocation: true
---

# Game Test Standards

## Spec / feature mapping (mandatory)

| Source | Use for tests |
|--------|----------------|
| Spec **Requirements** | Each requirement has coverage across test styles |
| Task acceptance criteria | Cases per task |
| Parent **feature** acceptance criteria | System + integration flows |
| Phase **PHASE.md** | Prototype-appropriate quality bar; no out-of-scope systems |
| Spec **Goal** | System smoke happy paths |

Record `spec_ref` on each `tests_added[]` entry.

## Test styles (all required per spec work)

Per [MonoGame docs](https://docs.monogame.net/articles/) (testable code, game loop) and **test-csharp**:

| Style | Scope |
|-------|--------|
| **unit** | Core logic without GraphicsDevice |
| **integration** | Systems + mocked input/content |
| **system** | Full Game smoke, critical user flows |
| **performance** | Tick budget, allocations, stress counts |

## Skills (test only — never load code-*)

- **test-csharp** — C# / xUnit foundation
- **test-monogame** — game-specific patterns

## Coverage target

**100% line coverage** on every `manifest.files_index` path where `layer: game` (production files only).

## Commands

From `AGENTS.md`:
- `dotnet test` with coverlet
- Performance/benchmark job when configured
- Platform build smoke for system tests

## Output

`tests_added[]` with `spec_ref` and `style`; `coverage_percent`; `uncovered_files[]`.

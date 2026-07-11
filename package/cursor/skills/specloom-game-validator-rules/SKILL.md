---
name: specloom-game-validator-rules
description: INTERNAL — specloom-game-validator only. Game layer validation rubric. Not user-invokable.
disable-model-invocation: true
---

# Game Validator Rules

## Read order

1. `manifest.json` — `files_index` where `layer: game`
2. Active **spec** — Goal, Requirements, tasks
3. Parent **feature** — scope and acceptance criteria
4. `docs/architecture/` — game systems when referenced
5. `docs/code/csharp/CORE.md`, `docs/code/monogame/CORE.md` when listed

## Standards checks

| Area | Pass criteria |
|------|----------------|
| **Separation** | Core logic not trapped in Draw-only code |
| **Content** | Pipeline assets; scene unload pattern |
| **Loop** | Update input; base calls; GameTime usage |
| **C#** | Nullable, analyzers, naming per code-csharp |
| **Spec** | Requirements reflected in changed files |

## Scoring

| Dimension | Weight |
|-----------|--------|
| Spec/feature alignment | 40% |
| Architecture (systems/scenes) | 30% |
| code-csharp + code-monogame standards | 30% |

**Pass:** `confidence_score >= 99`.

## Output fields

Include per-file findings with `remediation` actionable for **specloom-implement**.

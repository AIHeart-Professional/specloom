---
name: specloom-lang-ensure
description: >
  INTERNAL — specloom-planner (init). After languages locked: ensure code-{lang} + test-{lang}
  skills exist, scaffold if missing, wire Overview/manifest. Not user-invokable.
disable-model-invocation: true
---

# Language / stack skill ensure

## Why

Init may pick stacks SpecLoom never shipped (`rust`, `tauri`, `swift`, …).  
Build/test agents must load matching **`code-*`** / **`test-*`** skills. Missing → scaffold, do not proceed as if covered.

## When

After Overview **Engineering defaults** languages locked; **before** or with layer `read_standards_only` advisory.

## Normalize

From layer table + stack text, emit **skill slugs** (lowercase kebab):

| User said | Emit slugs (code + test each) |
|-----------|-------------------------------|
| TypeScript / TS | `typescript` |
| React | `react`, `typescript` |
| React Native / Expo | `react-native`, `typescript` |
| Python | `python` |
| Postgres / Supabase SQL | `postgres` |
| Rust | `rust` |
| Tauri | `tauri`, `rust` |
| C# / .NET | `csharp` |
| Swift / SwiftUI | `swift` |
| Kotlin | `kotlin` |
| Go | `go` |

Unknown stack → invent slug from name (`solidjs` → `solidjs`). Prefer official ecosystem name.

**Layers stay** `frontend` | `backend` | `database` — do **not** create new peer agents per language. Layer agents load language skills dynamically.

## Check

For each slug `L`:

1. Skill dirs: `~/.cursor/skills/code-L`, `~/.cursor/skills/test-L` (and `~/.agents/skills/` if Codex used)
2. Package/shared if installing into specloom package for contribution: `package/v2/shared-skills/code-L` (optional promote)
3. Standards: `{standards}/L/CORE.md` and `test/L/CORE.md` if standards root available

## If missing — scaffold

### A. Cursor/Codex skills (required)

Write from templates in this folder:

- `templates/code-skill.template.md` → `code-{L}/SKILL.md`
- `templates/test-skill.template.md` → `test-{L}/SKILL.md`

Fill via **research** (WebSearch / official docs) — same bar as domain research:

- Non-negotiables from official style guides
- Tooling (fmt, lint, test runner)
- Anti-patterns
- Link official docs URLs

Mark header: `generated: init` · `refine_in: specloom-standards`

Install path (prefer):

1. `~/.cursor/skills/code-{L}/SKILL.md` (+ test)
2. If user developing specloom package and slug is reusable → also copy under `package/v2/shared-skills/` for next install

### B. Standards stubs (if standards repo writable)

Create `{L}/CORE.md` + `test/{L}/CORE.md` stubs pointing to same rules; update `manifest.yaml` `languages:` + aliases.  
If standards not writable → Overview note + Brief paths still list intended `L/CORE.md`; skills carry rules until standards catch up.

### C. Overview + Brief wiring

On Overview **Standards paths** / Engineering defaults:

```
| Layer | Languages | code skills | test skills |
| frontend | tauri, rust | code-tauri, code-rust | test-tauri, test-rust |
```

Every work Brief **Required Context** must list matching Code + Test Standards paths (standards paths and/or note “load code-{L}”).

## Agent link rules (already in layer agents)

| Agent | Loads |
|-------|--------|
| specloom-frontend / backend / database | `specloom-coding` + each `code-{L}` for Task languages |
| specloom-test-frontend / backend / database | `specloom-testing` + each `test-{L}` |

No new `@specloom-build-rust` peers.

## Result

```json
{
  "type": "LANG_ENSURE_RESULT",
  "status": "ok|partial|failed",
  "slugs": ["rust", "tauri"],
  "created_skills": ["code-rust", "test-rust", "code-tauri", "test-tauri"],
  "existing_skills": ["code-typescript"],
  "standards_stubbed": ["rust", "tauri"],
  "notes": ""
}
```

## Forbidden

- Skipping scaffold when slug unknown to package  
- Creating per-language **peer** agents  
- Fat skills inside **app** repo  
- Claiming coverage without writing skill files

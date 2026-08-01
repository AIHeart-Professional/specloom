---
name: specloom-frontend
model: inherit
description: INTERNAL — build-worker (code) or specloom-init (read_standards_only advisory).
---

# Gate

Allowed parents:

1. **specloom-build-worker** — production code  
2. **specloom-planner** with `INIT_ADVISORY_HANDOFF` + `action: read_standards_only` — **no file writes**

Else JSON `ACCESS_DENIED`.

## Skills

**specloom-coding** (loads `code-{lang}` per Task languages — e.g. `code-tauri`, `code-rust`, `code-typescript`)  
**specloom-ux-refs** when Brief lists UX / Image Files

## Advisory (init)

Assume **specloom-lang-ensure** already ran. Load each `code-{L}` + standards CORE if present. Return:

```json
{"type":"INIT_ADVISORY_RESULT","layer":"frontend","languages":[],"code_skills":[],"paths":[],"must":[],"forbid":[]}
```

No repo edits. Missing `code-{L}` → list `missing:code-L` so planner re-runs lang-ensure.

## Build

Task sources only. Layer frontend. No tests.  
If Task lists **Image Files**: Read each ref before UI edits; match UX intent.  
If visual task and Image Files empty/missing files: run **specloom-ux-refs** ensure (GenerateImage / screenshot) first — normally **specloom-run** already did this.  
Return changes list to parent.

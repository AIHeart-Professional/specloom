---
name: specloom-ux-refs
description: >
  INTERNAL — Loop / PM / Document. UX refs in docs repo; ingest user images; always ensure
  UI has refs; style-match generate from existing refs. Not user-invokable.
disable-model-invocation: true
---

# UX image hybrid (v2)

Design refs vs shippable assets. **Every UI Brief must have refs before Implementation.**

## Where images live

| Kind | Store | Path |
|------|--------|------|
| **UX / design refs** | **Docs repo** | `ux/refs/<flow-or-screen>/…` (WebP / compressed PNG; LFS if large) |
| **Optional mirror** | Linear Issue attachments | URLs on Brief |
| **Shippable assets** | **App repo** | `assets/`, `public/`, … |

Never treat `ux/refs/**` as runtime assets.

## 1. User provides images → ingest (automatic via handoff)

If user attaches images or points at paths/URLs, the main thread Tasks **Document** / **PM** to **ingest** — do not leave them only in chat.

```
1. Ensure docs repo exists (document-repo)
2. Copy/convert → ux/refs/<flow>/<screen>.webp (or compressed PNG)
3. Index ux/README.md (source: designer|user)
4. PM patches Brief Image Files + visual: true + visual_criteria (ui-ux-extract)
5. Commit docs main
```

User does **not** have to manually place files if they handed them to the session — ingest is required.

## 2. When is a Brief “UI / visual”?

**Always visual** if:

- Layer **frontend** and touches UI (screen, tab, nav, layout, form, theme chrome, page shell), OR  
- Acceptance names screens/tabs/mockups, OR  
- `visual: true` / Image Files column present  

**Not visual:** pure API, schema, migrations, non-UI infra.

**Rule:** UI Briefs **always** run UX ensure. Never implement UI with empty Image Files.

## 3. Ensure refs (before Implementation)

```
1. List required screens (tabs/pages) from Brief + Phase IA
2. Resolve existing refs (docs paths, Linear URLs, just-ingested files)
3. Missing screen → GENERATE (below)
4. Patch Brief Image Files + Required Context
5. Commit docs main
```

### Generate missing — style-lock to existing refs

When generating a missing screen:

1. Collect **all existing** refs for this product/Phase (even other tabs) as **style references**  
2. GenerateImage (or equivalent) must match: palette, typography, density, component chrome, icon style, light/dark  
3. Prompt includes: product name, theme from Overview, screen purpose, labels from Brief, **and** “match style of reference images …”  
4. Save WebP/compressed PNG under `ux/refs/…`  
5. Index `source: generated`  

If **zero** refs exist yet: generate first screen from Overview/Brief theme alone; later screens use that first image as style seed.

If UI already runnable and no designer ref: screenshot OK, still index `source: screenshot`.

## Build

**Read every** listed Image File before UI edits. Match hierarchy, spacing, theme, labels.

## Validate

Visual Briefs: **every** visual criterion resolves to pass or fail against a named Image File — see **specloom-visual-diff**. There is no `ux_confidence` in v3; a single number could not say which screen was wrong.

## Forbidden

- UI Implementation with Image Files empty/`None`  
- Generate missing screens **without** using existing refs as style references when any exist  
- Leaving user-provided images only in chat (must ingest to docs repo)  
- Storing design refs only in app repo  
- Raw high-res bitmaps when WebP/PNG/LFS required  

---

## Freezing — v3 change

A generated reference is **frozen once reviewed**. Generation is the highest-variance operation
in the system, and its output becomes the visual acceptance criteria the Tester later checks
against. Regenerating meant the contract moved between runs.

| State | Meaning | Regeneration |
|-------|---------|--------------|
| `draft` | just generated, not reviewed | may be regenerated freely |
| `frozen` | reviewed and accepted | **never** regenerated; edit only by explicit user request |

Record it in the `ux/README.md` index:

```markdown
| file | source | state | frozen_at |
|------|--------|-------|-----------|
| refs/home.webp | generated | frozen | 2026-08-02 |
| refs/settings.webp | generated | draft | — |
```

A Brief that cites a `draft` reference in its visual criteria is not Ready. Freeze it first, or
the acceptance criteria are unstable by construction.

New screens still style-lock to the frozen set — that is what keeps a product coherent as it
grows.

---
name: specloom-ux-refs
description: >
  INTERNAL — brief/build/run/validate/document. UX refs in docs repo; auto-generate or
  screenshot when visual tasks lack images; ≥99% image-match confidence. Not user-invokable.
disable-model-invocation: true
---

# UX image hybrid (v2)

Design refs vs shippable assets. **Visual tasks must have refs** — create them if missing.

## Where images live

| Kind | Store | Path |
|------|--------|------|
| **UX / design refs** | **Docs repo** | `ux/refs/<flow-or-screen>/…` |
| **Optional mirror** | Linear Issue attachments | URLs on Brief |
| **Shippable assets** | **App repo** | `assets/`, `public/`, … |

Never treat `ux/refs/**` as runtime assets.

## When is a task “visual”?

**Yes** if any:

- Layer **frontend** and task touches UI (screen, layout, nav, theme chrome, form, widget, page shell)  
- Acceptance / Goal names screens, tabs, mockups, “looks like”, dark theme UI  
- Task **Image Files** column is present (even if empty / to-fill)  
- Brief frontmatter / Queue note `visual: true`

**No** (skip image pipeline): pure API, schema, migrations, non-UI scaffolding with no screens, docs-only.

Scaffold that **creates pages/tabs** = visual → generate one ref **per page/tab** if none provided.

## Ensure refs (before UI build)

Run by **specloom-run** (or brief) when Brief is visual:

```
1. Collect needed screens from Goal / Phase IA / Task list / tab names
2. For each screen, resolve existing ref:
   - Path in Required Context / Image Files that exists on disk, OR
   - Linear attachment URL that loads
3. If any screen missing a ref → CREATE (below)
4. Patch Brief Required Context + Image Files with final paths
5. Commit docs repo main; optional Linear attach
6. Return UX_ENSURE_RESULT
```

### Create — prefer generate, then screenshot

| Situation | Action |
|-----------|--------|
| App UI **not** built yet (or screen missing) | **Generate** image with Cursor **GenerateImage** (or equivalent) from Brief + Overview theme/IA. Save under `ux/refs/<slug>/<screen>.png` |
| App UI **already** runnable for that screen | **Screenshot** running UI (browser / emulator / Expo web) → save same path if no designer ref exists |
| Designer later drops real mockup | Replace generated file; keep path stable when possible |

Generation prompt must include: product name, dark/light from Overview, screen purpose, key regions/labels from Brief, “mobile app UI mockup” (or platform), no random marketing chrome.

Mark generated files in `ux/README.md` index as `source: generated|screenshot|designer`.

### Result

```json
{
  "type": "UX_ENSURE_RESULT",
  "status": "ok|skipped|failed",
  "visual": true,
  "screens": ["home", "budget"],
  "created": ["ux/refs/home/placeholder.png"],
  "existing": [],
  "brief_updated": true
}
```

## Brief rules

### Required Context — UX references

| Ref | Purpose |
|-----|---------|
| `ux/refs/budget/envelope-list.png` | … |

Unlisted = do not read.

### Task Directives

| ID | … | **Image Files** | **Asset Files** | … |

- Image Files = `ux/refs/**` or URLs (never `None` on visual tasks after ensure)  
- Asset Files = app shippable only  

## Build

Before UI edits: **Read** every Image File (vision). Match hierarchy, spacing, theme, labels.  
Deviation only with Linear comment + Open Question if it breaks acceptance.

## Validate — image confidence ≥ 0.99

For visual Briefs, `code_quality` must report:

```json
"ux_confidence": 0.0,
"ux_required": true
```

Pass code gate only if:

- overall `confidence ≥ 0.99` **and**  
- `ux_confidence ≥ 0.99` (UI vs listed refs)

Score by reading refs + inspecting implemented UI (screenshot or code+vision).  
Fail → `owner:build` with concrete mismatches (layout, missing regions, theme, typography).

Non-visual Briefs: `ux_required: false`; skip `ux_confidence`.

## Who does what

| Actor | Action |
|-------|--------|
| User / designer | Optional real mockups into `ux/refs/` |
| **specloom-brief** | Scope screens; call ensure if visual and empty |
| **specloom-run** | **Must** UX ensure before first build when visual |
| **specloom-build** / frontend | Read refs; implement |
| **specloom-validate** | Enforce `ux_confidence ≥ 0.99` |
| **specloom-document** | Index `ux/README.md` |

## Forbidden

- Visual frontend work with Image Files still `None` after ensure  
- Passing validate below 0.99 ux_confidence on visual Briefs  
- Generating images for non-visual tasks  
- Storing design refs only in app repo  
- Reading unlisted mockups

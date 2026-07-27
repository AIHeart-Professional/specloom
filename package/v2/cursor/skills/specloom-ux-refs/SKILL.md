---
name: specloom-ux-refs
description: >
  INTERNAL — brief/build/validate/document. UX design-reference images hybrid for v2.
  Refs live in docs repo; shippable assets in app. Not user-invokable.
disable-model-invocation: true
---

# UX image hybrid (v2)

Bring back v1 **design/reference vs shippable asset** split — without stuffing mockups into the app repo.

## Where images live

| Kind | Store | Path / form |
|------|--------|-------------|
| **UX / design refs** (mockups, wireframes, screen targets) | **Docs repo** | `ux/refs/<flow-or-screen>/…` |
| **Same refs (optional mirror)** | Linear Issue **attachments** + Brief links | MCP-visible without docs clone |
| **Shippable app assets** (icons used at runtime) | **App repo only** | e.g. `assets/`, `public/`, platform content dirs |

**Never** treat `ux/refs/**` as runtime assets.  
**Never** put design-only mockups in app `assets/` as SoT.

Cloud: docs repo on `main` is enough for automations that already clone docs; Linear attachments help when only Linear MCP is available.

## Docs repo layout

```
ux/
  README.md           # index + rules
  refs/
    home/
    budget/
    settings/
    …
  private/            # optional — gitignored local-only drafts (not required in cloud)
```

Bootstrap via **specloom-document** creates `ux/README.md` + empty `ux/refs/.gitkeep`.

## Brief rules (like v1)

### Required Context

Must list every UX ref the implementer may open:

| Ref | Purpose |
|-----|---------|
| `ux/refs/budget/envelope-list.png` | Budget screen target |
| `https://…` or Linear attachment URL | Same if mirrored |

Unlisted = **do not read** (same discipline as standards paths).

### Task Directives

Restore columns:

| ID | Task | Layer | Language | Code Standards | **Image Files** | **Asset Files** | Source Files |
|----|------|-------|----------|----------------|-----------------|-----------------|--------------|

- **Image Files** = design refs under `ux/refs/**` (or Linear/HTTPS URLs), or `None`  
- **Asset Files** = app-repo shippable paths only, or `None`  
- Every Image/Asset path must appear in Required Context  

### Frontend build

Before UI work: **Read** each listed Image File (vision). Match layout hierarchy, spacing intent, dark/light, and labeled states. Note intentional deviations in Linear comment.

### Validate (`code_quality`)

If Brief lists UX refs: score visual/IA alignment against them (confidence penalty if ignored or contradicted without comment).

## Who writes files

| Actor | Action |
|-------|--------|
| User / designer | Drop mockups into docs `ux/refs/…` (or attach on Linear) |
| **specloom-brief** | Link paths/URLs into Brief Required Context + Task Image Files |
| **specloom-document** | Keep `ux/README.md` index updated on sync/scan |
| **specloom-run** / build | Consume refs; do not invent alternate UX when refs exist |

## Forbidden

- Design refs only inside app repo  
- Fat `docs/images` tree inside **app**  
- Reading random mockups not listed on Brief  
- Using reference PNGs as bundled runtime assets without copying into app asset paths via Task Asset Files

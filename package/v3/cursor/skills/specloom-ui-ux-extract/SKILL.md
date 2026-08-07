---
name: specloom-ui-ux-extract
description: >
  INTERNAL — Project Manager. Mockups → visual AC + Image Files; request ingest into
  docs ux/refs when user provides images. Not user-invokable.
disable-model-invocation: true
---

# UI/UX extract

## When user provides images

1. Ensure images will be **ingested** to docs `ux/refs/` (Document `document-repo` / `document-ux` + `specloom-ux-refs` ingest) — not left in chat only  
2. Map each image → screen/tab  
3. Emit for each Brief:
   - `visual: true`
   - `visual_criteria[]` (measurable layout/hierarchy/labels/theme)
   - `Image Files` = final `ux/refs/…` paths  
4. Prefer **one Brief per screen/tab** (or small coherent group) for gating  

## When no images yet but UI work

Still mark Briefs `visual: true` + required screens list. Loop UX ensure will **generate** missing refs (style-locked to any existing refs).

## Output (into Task Spec / Brief)

```json
{
  "visual": true,
  "screens": ["home", "budget", "…"],
  "visual_criteria": ["…"],
  "image_files": ["ux/refs/tabs/01-home.webp"],
  "style_refs": ["ux/refs/tabs/01-home.webp"]
}
```

`style_refs` = existing images generators must match when filling gaps.

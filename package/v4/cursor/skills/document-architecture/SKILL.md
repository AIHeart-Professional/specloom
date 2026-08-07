---
name: document-architecture
description: >
  INTERNAL — specloom-document. System overview, module structure, dependency direction.
disable-model-invocation: true
---


# Architecture docs

Answers **how is this built**, not how it runs (that is `document-system`).

## Files

```
architecture/
├── README.md            index + one-paragraph shape of the system
├── system_overview.md   the parts and how they relate
├── app_structure.md     directory layout and what lives where
└── dependencies.md      internal direction + notable external deps
```

## Rules

- Describe what is **on `ai-workflow` now**. Aspiration goes in an ADR, not here
- State dependency **direction** — "UI depends on services, never the reverse" is the useful
  sentence; a list of imports is not
- One diagram maximum per file, and only where prose genuinely fails
- Unknown → `_TBD_`, never a guess. A confident wrong architecture doc costs more than a gap

## Anti-pattern

A file-by-file inventory. It is stale within a week and duplicates what the reader can already
list. Document the **boundaries and the rules that hold across them**.

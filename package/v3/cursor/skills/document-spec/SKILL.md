---
name: document-spec
description: >
  INTERNAL — specloom-document. Brief spec records — active and archived.
disable-model-invocation: true
---


# Spec docs

The browseable mirror of a Linear Brief. **Linear stays the source of truth**; a conflict is
resolved in Linear's favour and this file is corrected.

```
specs/
├── active/    Briefs in flight
└── archived/  Done
```

## Per spec

- Brief key, title, link to Linear
- Objective
- Functional acceptance criteria, as stated
- Visual criteria and Image Files, if any
- Layers and stack
- Outcome: gate results, coverage, merge shas

## Rules

- Written at closeout from the Loop payload — not from memory
- Move `active/` → `archived/` when the Brief is Done and merged
- Never edit criteria here to match what got built. If they diverged, that is the record

## Why keep it

Linear is the plan; this is the searchable history that survives a tracker migration.

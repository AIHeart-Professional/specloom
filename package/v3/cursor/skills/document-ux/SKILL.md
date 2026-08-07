---
name: document-ux
description: >
  INTERNAL — specloom-document. The ux/refs index, image policy, and freeze state.
disable-model-invocation: true
---


# UX docs

```
ux/
├── README.md   the index — the important file
└── refs/       the images
```

## Index

```markdown
| file | screen | source | state | frozen_at |
|------|--------|--------|-------|-----------|
| refs/home.webp | Home | generated | frozen | 2026-08-02 |
| refs/settings.webp | Settings | screenshot | draft | — |
```

`source` is `generated`, `screenshot` or `designer`. `state` is `draft` or `frozen`.

## Freeze

A reviewed reference is **frozen** and never regenerated — see **specloom-ux-refs**. A Brief
whose visual criteria cite a `draft` reference is not Ready.

## Image policy

- WebP, or compressed PNG when transparency is needed
- Sized for UI review, not print. Cap the long edge around 1600 px
- Git LFS when a file exceeds ~1 MB
- Never in the app repo — these are docs-repo artifacts

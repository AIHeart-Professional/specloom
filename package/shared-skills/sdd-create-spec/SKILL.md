---
name: sdd-create-spec
description: >-
  INTERNAL — sdd-docs agent only. Author docs/specs/ with Required Context. Not user-invokable.
---


# SDD Create Spec

Creates **low-level HOW** specs from **high-level WHAT** features. **One spec = one Spec Queue row.**

## Critical Rules

1. **Parent required:** `parent_feature: github:owner/repo#N` (feature issue)
2. **Required Context:** explicit path table — **only** docs subagents may read
3. **No extra context:** if not in Required Context, subagents do not load it
4. **Task Directives:** Language, Code Standards, Image Files, Asset Files, Source Files per task
5. **Subset rule:** every Task Code Standards + Image/Asset path must appear in Required Context
6. **Code docs:** `docs/code/<lang-or-topic>/CORE.md` mandatory per language; add specific files only when needed (e.g. `docs/code/react/theme-styling.md`)
7. **Changes:** append file-level change log during implementation — required for sign-off
8. **Sign-off:** user confirms after reviewing Changes before archive
9. **`spec_id`:** 3-digit from parent feature `NNN` (e.g. `014`) - used in spec branch `feature/<spec-slug>`
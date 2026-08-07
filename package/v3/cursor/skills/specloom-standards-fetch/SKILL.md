---
name: specloom-standards-fetch
description: >
  INTERNAL — v2. Make specloom-standards available at pinned ref for coding/testing. Not user-invokable.
disable-model-invocation: true
---

# Standards fetch

Root env/convention: `SPECLOOM_STANDARDS_ROOT` or `/workspace/specloom-standards` or sibling `../specloom-standards`.

## Ensure tree

1. Resolve `standards_ref` (Brief field → workspace pin → fail).
2. If root exists and `git rev-parse HEAD` matches pin → OK.
3. Else: `git clone --depth 1 --branch <pin> <remote> <root>` OR fetch sparse files via `gh api` for paths only.
4. Read `manifest.yaml` once per session.

## Forbidden

- Float on unpinned `main`
- Submodule into **app** as required path for cloud
- Embed CORE bodies inside this skill

---
name: document-scan
description: >
  INTERNAL — specloom-document. Fill docs from the app on ai-workflow; unknowns stay _TBD_.
disable-model-invocation: true
---


# Scan

Populates docs from the code, for bootstrap or a periodic refresh.

## Source

The app repo at **`ai-workflow`**. Never a feature branch — the docs mirror integrated state.

## Order

1. Manifests — `package.json`, `Cargo.toml`, `pyproject.toml` → stack, deps, scripts
2. Entry points — `main`, server bootstrap, route registration → `system/runtime.md`
3. Directory shape → `architecture/app_structure.md`
4. Route and event definitions → `document-api` input
5. Config reads — env var names only → `system/README.md`
6. Migrations and schema → `architecture/dependencies.md`

## Rules

- **`_TBD_` beats a guess.** An inferred-and-wrong architecture doc is read as fact and
  outlives the person who can correct it
- Record what was scanned and at which sha, at the bottom of each generated file
- Never overwrite a hand-written section. Fill gaps; append a `## Scanned` block
- Never read `.env`, secrets or credential files — env var **names** come from the code that
  reads them

## Output

```json
{ "scanned_sha":"", "files_written":[], "tbd_count":0, "skipped":[] }
```

A high `tbd_count` is a good result. It is a list of what a human needs to answer.

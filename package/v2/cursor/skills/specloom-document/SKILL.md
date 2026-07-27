---
name: specloom-document
description: >
  INTERNAL + user via @specloom-document. Lightweight docs repo: architecture, system,
  workflow, specs. Bootstrap on init; scan app; update on Brief Done. Not planning SoT
  (Linear remains Overview/Phase/Brief SoT).
disable-model-invocation: false
---

# SpecLoom document

## Purpose

Separate **docs repo** (not app repo). Humans + agents read it. **Linear stays planning SoT.**

Only these trees (lightweight — no ideas/features/automation/knowledge/code/decisions dumps):

```
README.md
architecture/
system/
workflow/
ux/          # design mockups (refs only) — see specloom-ux-refs
specs/
  active/
  archived/
```

## Modes

| Mode | When |
|------|------|
| `bootstrap` | Init / first create — repo + stubs from templates |
| `scan` | User `@specloom-document` or missing docs — scan **app** + Linear, fill gaps |
| `sync_brief` | Brief created/edited — write/update `specs/active/<KEY>_slug.md` |
| `closeout` | Brief **Done** (validate) — move to `specs/archived/`, refresh architecture/system/workflow/README queues |

## Docs repo location

- Default name: `<app-repo>-docs` (e.g. `budget-tracker-docs`)
- Same GitHub owner as app
- Branch: **`main`** (docs automations pin `main`; app pins `ai-workflow`)
- URL recorded on Linear Overview + app README pointer

Resolve path: Overview field / env `SPECLOOM_DOCS_ROOT` / sibling `../<app>-docs`.

## Bootstrap (init)

1. Via **specloom-git** `ensure_docs_repo` (or self if user invoked document peer)
2. Copy templates from this skill folder → docs repo root (include `ux/README.md` + `ux/refs/.gitkeep`)
3. Fill product name, Linear Overview URL, app repo URL, `planning_mode`, stack
4. Commit + push `main`
5. Comment Overview with docs repo URL

## Scan algorithm (`scan`)

1. Open **app** on `ai-workflow` (read-only OK)
2. Inventory: package manifests, entrypoints, folders (`screens/`, `src/`, `api/`, `db/`, …), README
3. Linear: Overview + Phase projects + Briefs (keys, status, queue)
4. For each required file in **structure.md**: if missing or stub-only → write from template using scan evidence
5. Never invent product claims contradicting Overview; mark unknowns as `_TBD_`
6. Commit docs repo `main` with message `docs: scan refresh`

## Closeout (`closeout`) — after Brief Done

1. Ensure `specs/active/<KEY>_*.md` exists (sync from Linear Brief body if needed)
2. Move → `specs/archived/<KEY>_slug.md`; set `status: Done`, commit SHA(s), date
3. Update `README.md` queues (Active Specs / Done recently)
4. Patch `architecture/` + `system/` only where this Brief changed shape (folders, deps, runtime)
5. Update `workflow/queue.md` from Linear queue
6. Push docs `main`

## Sync Brief (`sync_brief`)

Write `specs/active/<KEY>_<slug>.md` from Linear Brief using **spec-template.md**. Preserve local Notes section if present.

## Forbidden

- Putting Overview/Phase SoT only in docs (Linear wins on conflict)
- Copying full v1 tree (ideas, features, automation state, code standards)
- Writing app production code
- Creating `task/*` branches

## Result

```json
{
  "type": "DOCUMENT_RESULT",
  "status": "ok|failed",
  "mode": "bootstrap|scan|sync_brief|closeout",
  "docs_repo_url": "",
  "files_written": [],
  "error": null
}
```

## Templates

Same folder: `structure.md` · `README.template.md` · `architecture/*` · `system/*` · `workflow/*` · `specs/*`

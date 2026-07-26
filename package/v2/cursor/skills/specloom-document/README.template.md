# {{PRODUCT_NAME}} — Docs Command Center

Root of the **docs repo**. Humans and SpecLoom agents read this first for architecture, system shape, workflow, and spec mirrors.

> **Planning source of truth = Linear** (Overview → Phase → Brief).  
> This repo = durable, browseable documentation. On conflict, Linear wins for status/queue; refresh docs via `@specloom-document`.

## Start here

1. Read this README (queues below).
2. Open [Linear Overview]({{LINEAR_OVERVIEW_URL}}) for live plan.
3. App code: [{{APP_REPO}}]({{APP_REPO_URL}}) on branch **`ai-workflow`**.
4. Spec mirrors: `specs/active/` (open) · `specs/archived/` (Done).
5. Need a gap filled from code? Run **`@specloom-document`** (`scan`).

## Product snapshot

| Field | Value |
|-------|-------|
| Product | {{PRODUCT_NAME}} |
| planning_mode | {{PLANNING_MODE}} |
| App repo | {{APP_REPO_URL}} |
| Docs repo | {{DOCS_REPO_URL}} |
| App integration branch | `ai-workflow` |
| Docs branch | `main` |
| Stack | {{STACK_SUMMARY}} |

## Document tree

| Folder | Purpose |
|--------|---------|
| [architecture/](architecture/) | System shape, app structure, repos, dependencies |
| [system/](system/) | Runtime product systems & integrations |
| [workflow/](workflow/) | SpecLoom peers, git rules, queue mirror |
| [specs/](specs/) | Brief mirrors (active + archived) |

## Phase roster (from Linear)

| Phase | Status | Linear |
|-------|--------|--------|
| _Agent updates_ | _Planned / In Progress / Complete_ | _URL_ |

## Active specs

> Mirrors in `specs/active/`. Prefer Linear status if this table lags.

| Order | Brief | Status | Docs file | Next |
|-------|-------|--------|-----------|------|
| _Agent updates_ | SPE-N | Ready/Building/… | `specs/active/SPE-N_….md` | build/test/validate |

## Recently completed

| Brief | Archived doc | Done date |
|-------|--------------|-----------|
| _Agent updates_ | `specs/archived/SPE-N_….md` | YYYY-MM-DD |

## Architecture index

- [System overview](architecture/system_overview.md)
- [App structure](architecture/app_structure.md)
- [Repositories](architecture/repositories.md)
- [Dependencies](architecture/dependencies.md)

## System index

- [System overview](system/overview.md)
- [Runtime](system/runtime.md)
- [Integrations](system/integrations.md)

## Workflow index

- [SpecLoom](workflow/specloom.md)
- [Git](workflow/git.md)
- [Queue](workflow/queue.md)

## Agent rules

- Do **not** treat this repo as replacement for Linear Brief bodies when implementing — read Linear Issue.
- Do use architecture/system when understanding boundaries.
- After Brief **Done**, validate/closeout must update `specs/archived/` + queues here.
- `@specloom-document` may rewrite stubs from app scan; preserve `# Notes` sections.

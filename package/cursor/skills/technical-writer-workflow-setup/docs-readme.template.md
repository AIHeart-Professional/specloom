# SDD Command Center

Root `docs/` is the project source of truth for specs, queues, architecture, decisions, code standards, and workflow status. Read this file before any work.

## Start Here

1. Read `AGENTS.md`.
2. Check **Active Specs**, **Feature Queue** (`docs/features/`), and **Idea Queue** (`docs/ideas/`).
3. Finish approved specs/tasks before promoting new ideas.
4. If no task is ready, spawn a spec from the lowest Ready feature Spec Queue row.
5. Read `docs/automation/state/active_work.json` when automation state exists.

**Ideas** (`docs/ideas/`) are optional. Automations never promote them — you promote manually via **sdd-project-lead**.

## Three Layers

| Layer | Location | Meaning |
|-------|----------|---------|
| **Idea** | `docs/ideas/` (optional) | Backlog scratch pad |
| **Feature** | `docs/features/` | WHAT to build |
| **Spec** | `docs/specs/` | HOW to build one unit |

Prefer finishing approved specs/tasks first. Coordinator automation: **tasks → ready features → specs → idle**.

## Loop Engineering

| Path | Purpose |
|------|---------|
| `docs/automation/state/` | `active_work.json`, `blocked_work.json` |
| `docs/automation/reports/` | daily_summary, latest_review, latest_validation |

Cursor Automations: `docs/automation/cursor-schedules.md`.

## Document Tree

| Folder | Purpose |
|--------|---------|
| `docs/ideas/` | Backlog ideas |
| `docs/ideas/archived/` | Promoted ideas |
| `docs/features/` | Active WHAT — scope, deps, Spec Queue |
| `docs/features/archived/` | Complete features |
| `docs/specs/` | Low-level HOW |
| `docs/specs/archived/` | Completed specs |
| `docs/images/` | Design/reference images (not `assets/`) |
| `docs/images/assets/` | Application assets |
| `docs/code/` | Repo coding extensions |
| `docs/architecture/` | System shape |
| `docs/decisions/` | Durable decisions |
| `docs/workflows/` | Execution rules |
| `docs/automation/` | State, reports, schedules |
| `docs/knowledge/` | App memory |

## Idea Queue

> Files in `docs/ideas/` with `status: backlog`, sorted by lowest `priority` / NNN.

| Priority | Idea file | Summary | Next action |
| --- | --- | --- | --- |
| _Agent updates_ | `docs/ideas/NNN_slug.md` | _one line_ | _backlog / promote_ |

## Feature Queue

> Files in `docs/features/`. **Next for spec:** lowest `status: Ready` with dependencies Complete and a pending Spec Queue row.

| Priority | Feature file | Status | Next action |
| --- | --- | --- | --- |
| _Agent updates_ | `docs/features/NNN_slug.md` | _Draft/Ready/In Progress_ | _Next Spec Queue row or blocker_ |

## Active Specs

<!-- Agent: list Pending specs from docs/specs/ here -->

_None yet._

## Architecture

- [System Overview](architecture/system_overview.md)
- [Repositories](architecture/repositories.md)
- [Dependencies](architecture/dependencies.md)
- [App Structure](architecture/app_structure.md)

## Decisions

- [Product](decisions/product.md)
- [Architecture](decisions/architecture.md)
- [UX](decisions/ux.md)
- [Technical](decisions/technical.md)

## Knowledge

- [Product Memory](knowledge/product_memory.md)
- [Implementation Memory](knowledge/implementation_memory.md)
- [Pitfalls](knowledge/pitfalls.md)

# SDD Command Center

Root `docs/` is the project source of truth for specs, queues, architecture, decisions, code standards, and workflow status. Read this file before any work.

## Start Here

1. Read `AGENTS.md`.
2. Check **Active Specs**, GitHub **Feature Queue**, and GitHub **Idea Queue**.
3. Finish approved specs/tasks before promoting new ideas.
4. If no task is ready, spawn a spec from the lowest Ready feature Spec Queue row.
5. If no feature is Ready, promote the earliest backlog idea into a new feature issue.
6. Read `docs/automation/state/active_work.json` and the assigned loop in `docs/automation/loops/` when automation state exists.

## Three Layers

| Layer | Location | Meaning |
|-------|----------|---------|
| **Idea** | GitHub Issue (`sdd:idea`) | Backlog problem/opportunity |
| **Feature** | GitHub Issue (`sdd:feature`) | WHAT to build |
| **Spec** | `docs/specs/` | HOW to build one implementation unit |

Planning config: `docs/automation/github-planning.json`.

Coordinator promotes ideas last. Prefer finishing approved specs/tasks first.

## Feature Structure Rule

Features live as GitHub Issues, not local `docs/features/` docs. Local `docs/features/` is legacy fallback only unless explicitly enabled.

A promoted idea creates a new `[FEAT-NNN]` issue. The source `[IDEA-NNN]` issue stays an idea, changes to `sdd:status:promoted`, and closes.

## Loop Engineering

| Path | Purpose |
|------|---------|
| `docs/automation/loops/` | coordinator, feature_definition, spec_creation, task_execution, validation, review |
| `docs/automation/state/` | `active_work.json`, `blocked_work.json` |
| `docs/automation/reports/` | daily_summary, latest_review, latest_validation |

Cursor Automations: `docs/automation/cursor-schedules.md`. Skill: **sdd-automation-loops**.

## Document Tree

| Folder | Purpose |
|--------|---------|
| `docs/automation/github-planning.json` | GitHub repo + labels for ideas/features |
| `docs/specs/` | Low-level HOW - tasks, langs, code/image/source paths |
| `docs/specs/archived/` | Completed specs |
| `docs/images/` | Design/reference images only, except `docs/images/assets/` |
| `docs/images/assets/` | Application assets to copy/import/use in the app |
| `docs/code/<lang>/` | Language rules (`CORE.md` required) |
| `docs/architecture/` | System shape (changes slowly) |
| `docs/decisions/` | Durable decisions - search before asking user |
| `docs/workflows/` | Execution rules |
| `docs/automation/` | Loops, state JSON, reports (Cursor Automations) |
| `docs/knowledge/` | App memory |

## Idea Queue (GitHub)

> Open issues with `sdd:idea` + `sdd:status:backlog`, sorted by `sdd_id`.

```bash
gh issue list --label "sdd:idea" --label "sdd:status:backlog" --state open
```

## Feature Queue (GitHub)

> Open issues with `sdd:feature`. **Next for spec:** lowest `sdd:status:ready` with dependencies Complete and a pending Spec Queue row.

```bash
gh issue list --label "sdd:feature" --state open
```

| Priority | Feature issue | Status | Next action |
| --- | --- | --- | --- |
| _Agent updates_ | _GitHub issue link_ | _Draft/Ready/In Progress_ | _Next Spec Queue row or blocker_ |

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
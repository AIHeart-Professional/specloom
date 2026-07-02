# AGENTS.md additions (merge into project AGENTS.md)

## SDD planning layers

- Ideas live in `docs/ideas/` (`status: backlog`).
- Features live in `docs/features/` (`Draft`, `Ready`, `In Progress`, `Complete`).
- Specs live in `docs/specs/` (`Pending` ? archived).

## Queues

- **Idea Queue:** `docs/ideas/` — lowest NNN first for promotion.
- **Feature Queue:** `docs/features/` — lowest Ready NNN with deps met for spec spawn.
- **Active Specs:** oldest `Pending` in `docs/specs/`.

## Automation

- Entry: **specloom-implement** only.
- State: `docs/automation/state/active_work.json`
- Git base branch: **`ai-workflow`**

## Test commands

<!-- Fill: unit, integration, e2e, coverage -->

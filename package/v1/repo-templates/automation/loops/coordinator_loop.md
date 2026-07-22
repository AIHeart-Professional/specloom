# Coordinator Loop

> **Core run.** Priority: Ready tasks → Ready features (GitHub) → ideas (GitHub).

## Rule of 3

Max **3** per gate. Fail → `incomplete`, `blocked_work.json`, stop.

## Priority

### 1. Ready tasks

Spec `Pending` + task `Status: Ready` → **task_execution_loop** → **specloom-implement** → domain agents.

### 2. Ready features (no Ready tasks)

Query GitHub per **specloom-git-planning** — lowest `sdd_id` feature with `sdd:status:ready` and pending Spec Queue row:

→ **spec_creation_loop** → **specloom-work-creator** (`create_spec`) → **specloom-validator** (`spec`) — max 3

### 3. Ideas (no Ready tasks/features)

Query GitHub — earliest backlog idea (`sdd:idea` + `sdd:status:backlog`):

→ **specloom-work-creator** (`create_feature`) → **specloom-validator** (`feature`) — max 3

### 4. Idle

Stop.

## Agent mapping

| Action | Agents (via specloom-implement) |
|--------|------------------------------|
| SDD help / system map | specloom-system-advisor |
| Run coordinator / build Handoffs | specloom-worker |
| Implement task | specloom-frontend \| backend \| database developers |
| Create spec draft | specloom-work-creator → specloom-validator |
| Create feature draft | specloom-work-creator → specloom-validator |
| Post-task gates | specloom-validator(work) → specloom-validator(test) |
| Doc sync / archive | specloom-update-knowledgebase |
| Git | specloom-git |

**Never** invoke skills directly — sub-agents load internal skills. **specloom-implement** loads no skills.

## Procedure

1. Read `docs/automation/github-planning.json` + `active_work.json`
2. Query GitHub for ideas/features per **specloom-git-planning**
3. Walk priority 1→4
4. Route one loop; update state + `daily_summary.md`
5. Stop

# Coordinator Loop

> **Core run.** Priority: Ready tasks → Ready features (GitHub) → ideas (GitHub).

## Rule of 3

Max **3** per gate. Fail → `incomplete`, `blocked_work.json`, stop.

## Priority

### 1. Ready tasks

Spec `Pending` + task `Status: Ready` → **task_execution_loop** → **sdd-orchestrator** → domain agents.

### 2. Ready features (no Ready tasks)

Query GitHub per **sdd-github-planning** — lowest `sdd_id` feature with `sdd:status:ready` and pending Spec Queue row:

→ **spec_creation_loop** → **sdd-docs** (`create_spec`) → **sdd-validation** (`spec`) — max 3

### 3. Ideas (no Ready tasks/features)

Query GitHub — earliest backlog idea (`sdd:idea` + `sdd:status:backlog`):

→ **sdd-docs** (`create_feature`) → **sdd-validation** (`feature`) — max 3

### 4. Idle

Stop.

## Agent mapping

| Action | Agents (via sdd-orchestrator) |
|--------|------------------------------|
| SDD help / system map | sdd-help |
| Run coordinator / build Handoffs | sdd-loop |
| Implement task | sdd-frontend \| backend \| database |
| Create spec draft | sdd-docs → sdd-validation |
| Create feature draft | sdd-docs → sdd-validation |
| Post-task gates | sdd-validation(work) → sdd-validation(test) |
| Doc sync / archive | sdd-updates |
| Git | sdd-github |

**Never** invoke skills directly — sub-agents load internal skills. **sdd-orchestrator** loads no skills.

## Procedure

1. Read `docs/automation/github-planning.json` + `active_work.json`
2. Query GitHub for ideas/features per **sdd-github-planning**
3. Walk priority 1→4
4. Route one loop; update state + `daily_summary.md`
5. Stop

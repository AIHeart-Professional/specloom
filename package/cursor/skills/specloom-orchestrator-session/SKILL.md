---
name: specloom-orchestrator-session
description: >-
  INTERNAL — specloom-work-creator, specloom-implement, specloom-validator, specloom-tester.
  Work discovery, queue priority, no-work exits, git bookend protocol. Not user-invokable.
disable-model-invocation: true
---

# Orchestrator Session Protocol

Every **session entry** orchestrator (`specloom-work-creator`, `specloom-implement`, `specloom-validator`, `specloom-tester`) follows this contract when invoked.

## Session entry vs delegated

| Mode | `session_owner` | Git start | Git merge |
|------|-----------------|-----------|-----------|
| **User invokes agent** | `true` | Yes — always `task_start` off `ai-workflow` | Yes — always `merge_to_ai_workflow` before user reply |
| **Parent delegates sub-agent** | `false` | Skip if `git_task_branch` in handoff | **No** — parent owns merge |

Delegated sub-agents still run work on the **parent's branch** passed in handoff.

---

## Step 0 — Work discovery (mandatory first)

Before git or any work, scan queues. Load **specloom-work-creator-docs-planning** for paths.

### Blocked checks (→ `no_work`)

Return **`no_work`** immediately if any apply:

| Check | Source |
|-------|--------|
| Spec blocked | `docs/automation/state/blocked_work.json` references active spec/feature |
| Feature blocked | feature frontmatter `status: Blocked` or listed in `blocked_work.json` |
| Spec blocked | spec `Status: Blocked` or in `blocked_work.json` |
| Awaiting sign-off | `active_work.json` → `pendingSignOff` unresolved |
| `needs_user` | `active_work.json` → `stopReason: needs_user` |

Include `no_work_reason` in result JSON or user message.

### Work priority (strict)

**Specs always beat features.** Features only when **no** spec work exists for this agent.

| Agent | Work available when | Priority order |
|-------|---------------------|----------------|
| **specloom-work-creator** | Planning queue non-empty | 1. Pending spec drafts / spec creation from Ready features 2. Ready features needing specs **only if no spec planning work** 3. Ideas (manual) |
| **specloom-implement** | Spec with `Status: Pending` + tasks `Ready` or `In Progress` | Lowest Ready task on highest-priority non-blocked spec |
| **specloom-validator** | Draft or impl validation pending per mode | 1. Implementation validation (tasks complete, post worker-validation) 2. Draft validation **only if no impl validation** |
| **specloom-tester** | All tasks `Complete`, validator passed, tests not passed | Spec `manifest.status: awaiting_tests` |

**Feature work rule:** Do **not** create or advance features while any spec in `docs/specs/` has `Status: Pending` or `In Progress` with incomplete tasks — unless user explicitly names a feature (override).

### No work response

**User-facing agents** reply natural language:

```markdown
## No work available

Nothing for **specloom-implement** right now.

**Reason:** All specs complete or blocked; no Ready tasks.

**Next:** Run `@specloom-work-creator` if you need new specs, or clear `blocked_work.json`.
```

**JSON sub-agents** return:

```json
{"type":"SESSION_RESULT","from":"<agent>","status":"no_work","no_work_reason":"","tokens_used":0}
```

**Do not** call **specloom-git** when `no_work`.

---

## Step 1 — Git start (work exists, session_owner)

Delegate **specloom-git** `task_start`:

```yaml
GIT_HANDOFF:
  action: task_start
  git_base_branch: ai-workflow
  session_owner: true
  branch_slug: <agent>-<spec_id|feature_id|timestamp>
```

Branch naming when no task yet:

```
task/<agent>-<NNN|spec_id>-<kebab-slug>
```

Examples:
- `task/implement-014-auth-filter`
- `task/work-creator-014-spec-draft`
- `task/validator-014-impl`
- `task/tester-014-coverage`

Store returned `git_task_branch` for all delegations in this session.

---

## Step 2 — Do work

All edits/commits happen **only** on `git_task_branch`.

Pass `git_task_branch` in every downstream handoff.

---

## Step 3 — Git merge (session_owner, work attempted)

Before **any** user-visible reply (success, fail, or partial):

1. Delegate **specloom-git** `task_push` if uncommitted changes
2. Delegate **specloom-git** `merge_to_ai_workflow`
3. On merge fail → report blocked; do not claim success

**Never** reply to user until merge completes or merge failure reported.

---

## Step 4 — User response

Summarize work + git outcome (branch merged to `ai-workflow`).

---

## Agent-specific no_work conditions

### specloom-work-creator

- No Ready features with pending Spec Queue rows
- No draft features/specs awaiting create/revise
- No explicit user request to create idea/feature
- Blocked feature or awaiting sign-off on pending artifact

### specloom-implement

- No spec with Ready/In Progress tasks
- All tasks Complete but user only asked implement (validator/tester separate entry) — **no_work** unless handoff says run full pipeline
- Spec blocked

### specloom-validator

- **draft mode:** no draft awaiting validation
- **implementation mode:** tasks incomplete OR worker-validation not passed OR already validated pass with no changes

### specloom-tester

- Tasks incomplete → `no_work`
- Validator not passed → `no_work`
- `manifest.status: tests_passed` → `no_work`
- Spec blocked

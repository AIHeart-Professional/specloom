---
name: workflow-coordinator-loops
description: >-
  INTERNAL ? sdd-workflow-coordinator only. Meta index ? routes workflow ids to
  workflow-coordinator-* skills. Not user-invokable.
disable-model-invocation: true
---

# Workflow Coordinator ? Loop Index

**sdd-workflow-coordinator** loads this skill first, then the **workflow skill** for the active `workflow` id in `active_work.json`.

**sdd-project-lead** never reads skills.

## Output contract

Sub-agents ? JSON to project lead only. Project lead ? **natural language** to user. Automations must use **sdd-project-lead** agent; never show raw Results to the user.

## Workflow ids (not file paths)

| `workflow` id | Skill to load |
|---------------|---------------|
| `coordinator` | **workflow-coordinator-coordinator** |
| `task_execution` | **workflow-coordinator-task-execution** |
| `spec_creation` | **workflow-coordinator-spec-creation** |
| `feature_definition` | **workflow-coordinator-feature-definition** (manual only ? not in coordinator priority) |
| `validation` | **workflow-coordinator-validation** |
| `auto_closeout` | **workflow-coordinator-auto-closeout** |

Also load **project-lead-protocol** for Handoff schemas and **technical-writer-docs-planning** for idea/feature queue scans.

## User involvement

User: optional create idea | manual promote idea→feature | **sign off feature/spec drafts in chat** | answer open questions | unblock | `needs_user` for unresolved decisions.

## Promote after sign-off (validation ≥ 99%)

| Gate | Action |
|------|--------|
| feature | User approves → `promote_feature` |
| spec | User approves → `promote_spec` → `task_execution` |
| work + test | finalize → `auto_closeout` (no human) |

## Continuous execution

`run_until_complete` until: `idle` | `blocked` | `needs_user` | `awaiting_sign_off` | `iteration_cap` (default max 25).

## Rule of 3

`draftValidationAttempts`, `workValidationAttempts`, `testingAttempts`, `attempts` ? max 3 ? blocked.

## State (`active_work.json`)

| Field | Example |
|-------|---------|
| `activeIdea` | `docs/ideas/001_better-discovery.md` |
| `activeFeature` | `docs/features/014_auth-system.md` |
| `workflow` | `task_execution` (id, not path) |
| `runMode` | `continuous` |
| `stopReason` | `idle` \| `blocked` \| `needs_user` \| `awaiting_sign_off` \| `iteration_cap` |
| `pendingSignOff` | `{ artifact_type, artifact_path, ... }` while awaiting user |
| `humanApprovalRequired` | `true` when `awaiting_sign_off` or unresolved `needs_user` |

## Repo automation folder

`docs/automation/` holds **state** and **reports** only ? not loop markdown.

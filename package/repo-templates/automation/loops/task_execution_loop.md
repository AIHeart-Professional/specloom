# Task Execution Loop

> Execute **one Ready task** from an approved spec. Writes code via **specloom-implement**.

## Coordinator context

Runs when **coordinator_loop** priority **1** finds a task with `Status: Ready`.

## Rule of 3

| Gate | Max attempts | Counter |
|------|--------------|---------|
| Per-task implementation retry | 3 | `attempts` |
| Work validation (post all tasks) | 3 | `workValidationAttempts` |
| Testing | 3 | `testingAttempts` |

Attempt 3 fail → `status: incomplete`, `blocked_work.json`, stop.

## Git

Base **`ai-workflow`**. Work on the active spec branch `feature/<spec-slug>` recorded in the parent feature issue and spec frontmatter. See `git-workflow.md`.

## Inputs

- `active_work.json`
- Active spec — **Required Context** + **Task Directives** only
- Task row must show `Status: Ready`

## Procedure

1. Read `active_work.json`.
2. Open spec (`Pending` or `In Progress`).
3. Select **first Ready task** (lowest ID, deps met). If none → stop (coordinator picks tier 2/3).
4. Resolve `gitSpecBranch` from spec frontmatter or parent feature `active_spec_branch`; block if missing.
5. Verify branch exists and checkout `gitSpecBranch`; do not create ad hoc task branches.
6. Update state: `currentTask`, `gitSpecBranch`, `phase: implementation`, `status: in_progress`, `attempts: 0`.
7. **specloom-implement** — Handoff for this task only; Result includes `tokens_used`.
8. **specloom-update-knowledgebase** — `task_sync`: append **Changes**, update **manifest.json** + **work-done.md**, task Token Budget.
9. Mark task `Complete` in spec if Result `complete`.
10. If more tasks not Ready → stop (wait for Ready or human).
11. If **all tasks Complete** → **specloom-implement** runs:
    - **specloom-validator** (`work`) max 3
    - **specloom-validator** (`validation_type: test`) max 3
    - **specloom-update-knowledgebase** finalize work-records (`implementation.md`, `testing.md`, `completion.json`)
    - **specloom-git** `spec_push`
    - **specloom-git** `open_pr`
    - **specloom-git** `merge_pr_to_ai_workflow` (push `ai-workflow`, delete merged spec branch)
    - **specloom-update-knowledgebase** `archive_spec`
    - `status: complete`
12. No human sign-off wait when work and test validation both pass with `total_confidence >= 99`.
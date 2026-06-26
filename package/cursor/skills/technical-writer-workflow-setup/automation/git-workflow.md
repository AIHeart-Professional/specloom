# AI Git Workflow

All SDD automation work uses **`ai-workflow`** as the stable integration branch.

## Branches

| Branch | Purpose |
|--------|---------|
| `ai-workflow` | Last stable AI branch — **base for all AI work**, merge target when tasks complete |
| `task/<spec>-<task>-<name>` | One branch per spec task — short-lived |

## Task branch naming

```
task/<specId>-<taskSeq>-<taskSlug>
```

| Part | Source | Example |
|------|--------|---------|
| `specId` | Feature `NNN` (3-digit) or spec `spec_id` | `014` |
| `taskSeq` | Task ID zero-padded (`T1` → `001`) | `001` |
| `taskSlug` | Task title kebab-case (2–4 words) | `filter-model` |

Examples:

- `task/014-001-filter-model`
- `task/014-002-search-endpoint`
- `task/014-003-filter-ui`

## Flow (per task)

1. **Fetch** `origin/ai-workflow`
2. **Checkout** `ai-workflow` and pull latest
3. **Create** `task/<spec>-<task>-<name>` from `ai-workflow`
4. Implement task → commit → **push task branch**
5. On sign-off → **merge task branch into `ai-workflow`**
6. **Push** `ai-workflow` to origin
7. Optionally delete local task branch (keep remote for audit unless user prunes)

## Rules

- Never branch task work from `main`/`development` directly — always from `ai-workflow`
- One task branch at a time per automation run
- Cursor Automations must set git base branch to **`ai-workflow`**
- `active_work.json` tracks `gitBaseBranch` and `gitTaskBranch`

## Handoff to sdd-release-engineer

```yaml
action: task_start | task_push | merge_to_ai_workflow
git_base_branch: ai-workflow
git_task_branch: task/014-001-filter-model
spec_id: "014"
task_id: T1
task_slug: filter-model
```

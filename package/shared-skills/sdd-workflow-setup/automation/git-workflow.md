# AI Git Workflow

All SDD automation work uses **`ai-workflow`** as the stable integration branch.

## Branches

| Branch | Purpose |
|--------|---------|
| `ai-workflow` | Last stable AI branch - **base for all AI work**, merge target when specs complete |
| `feature/<spec-slug>` | One branch per spec - created before spec authoring, used for all tasks, deleted after merge |

## Spec branch naming

```
feature/<specSlug>
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

## Flow (per spec)

1. **Fetch** `origin/ai-workflow`
2. **Checkout** `ai-workflow` and pull latest
3. **Create** `feature/<spec-slug>` from `ai-workflow` before `sdd-docs create_spec`
4. Push branch and link it on the parent feature issue
5. Author/revise spec, validate to `total_confidence >= 99`, then mark spec Pending/Ready
6. Implement all tasks on the same spec branch
7. After work + test validation pass at `total_confidence >= 99`, commit and push spec branch
8. Create PR into `ai-workflow`
9. Merge PR, push `ai-workflow`, delete local and remote spec branch

## Rules

- Never branch spec work from `main`/`development` directly - always from `ai-workflow`
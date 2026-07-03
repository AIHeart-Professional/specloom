---
name: specloom-knowledgebase-docs-repo
description: >-
  INTERNAL — specloom-update-knowledgebase only. Rules for updating the docs/ repository tree.
  Not user-invokable.
disable-model-invocation: true
---

# Knowledgebase — Docs Repository

Use when `target_repo: docs` or `both`.

## Editable paths

| Path | Purpose |
|------|---------|
| `docs/specs/*.md` | Spec status, Changes table, Validation Results |
| `docs/features/*.md` | Feature status, Token Budget |
| `docs/specs/work-records/` | manifest, implementation.md, testing.md |
| `docs/knowledge/` | Implementation memory from completed work |
| `docs/decisions/` | Only when handoff explicitly requests |
| `docs/automation/reports/` | Validation/test summary reports |

## Do not edit

- `docs/automation/loops/` (skills own loops now)
- Archived specs without `archive_spec` action

## Spec Changes table

After each task:

```markdown
| Date | Task | File | What |
|------|------|------|------|
```

## Archive spec

Respect `active_work.json` **approvalMode** (see **specloom-approval-mode**):

| Mode | When to archive |
|------|-----------------|
| **manual** | Only on **`/approve`** or explicit user sign-off after review card |
| **auto** | Immediately when **specloom-tester** passes all tests |

Steps when archive allowed:

1. Set spec `Status: Complete`
2. Move to `docs/specs/archived/`
3. Update parent feature progress
4. `manifest.status: archived`

## Token Budget

Update spec + feature token fields on finalize. Reject if `_pending_` placeholder remains.

## Reports

Write `docs/automation/reports/latest_validation.md` after validator pass/fail.
Write `docs/automation/reports/latest_test.md` after tester pass/fail.

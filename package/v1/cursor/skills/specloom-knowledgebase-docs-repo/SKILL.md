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
| `docs/phases/` | Phase roster, completion criteria, status |
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

**Only specloom-validator** triggers `archive_spec` after final validation pass.

Respect `active_work.json` **approvalMode**:

| Mode | When to archive |
|------|-----------------|
| **manual** | Only on **`/approve`** or explicit user sign-off after review card |
| **auto** | Immediately when **specloom-tester** passes all tests |

Steps when archive allowed:

1. Set spec `Status: Complete`
2. Move to `docs/specs/archived/`
3. Update parent feature progress
4. `manifest.status: archived`
5. If last feature in phase → run **archive_phase** (below)

## Archive phase

When all features for a phase path are `Complete` in `docs/features/archived/`:

1. Verify `PHASE.md` **Completion criteria** checkboxes
2. Set phase frontmatter `status: Complete`
3. Move `docs/phases/NN-Name/` → `docs/phases/archived/NN-Name/`
4. Update `docs/README.md` Phase Queue
5. Set `active_work.json` `activeProductPhase: null` until user activates next phase

Respect sign-off: phase archive follows same **approvalMode** as feature archive when user review required.

## Token Budget

Update spec + feature token fields on finalize. Reject if `_pending_` placeholder remains.

## Reports

Write `docs/automation/reports/latest_validation.md` after validator pass/fail.
Write `docs/automation/reports/latest_test.md` after tester pass/fail.

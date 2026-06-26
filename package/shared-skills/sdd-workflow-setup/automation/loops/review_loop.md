# Review / Merge Loop

> Automated closeout after validation. Human review is optional; validation confidence >= 99 is the approval gate.

## Prerequisite

`sdd-validation(work)` and `sdd-validation(test)` both passed with `total_confidence >= 99`, and `docs/specs/work-records/SPEC-{id}/` exists.

## Procedure

1. **sdd-updates** `finalize_work_records`.
2. **sdd-github** `spec_push` on `gitSpecBranch`.
3. **sdd-github** `open_pr` from `gitSpecBranch` to `ai-workflow`.
4. **sdd-github** `merge_pr_to_ai_workflow`: merge PR, push `ai-workflow`, delete local and remote spec branch.
5. **sdd-updates** `archive_spec`.
6. Update state: clear `gitSpecBranch`, PR URL recorded in completion metadata, status `complete`.

## Stop conditions

- PR merged, `ai-workflow` pushed, branch deleted, spec archived.
- Merge/push/delete blocked; record blocker and leave branch/PR intact for recovery.
# Review / Merge Loop

> Automated closeout after validation. Human review is optional; validation confidence >= 99 is the approval gate.

## Prerequisite

`specloom-validator(work)` and `specloom-validator(test)` both passed with `total_confidence >= 99`, and `docs/specs/work-records/SPEC-{id}/` exists.

## Procedure

1. **specloom-update-knowledgebase** `finalize_work_records`.
2. **specloom-git** `spec_push` on `gitSpecBranch`.
3. **specloom-git** `open_pr` from `gitSpecBranch` to `ai-workflow`.
4. **specloom-git** `merge_pr_to_ai_workflow`: merge PR, push `ai-workflow`, delete local and remote spec branch.
5. **specloom-update-knowledgebase** `archive_spec`.
6. Update state: clear `gitSpecBranch`, PR URL recorded in completion metadata, status `complete`.

## Stop conditions

- PR merged, `ai-workflow` pushed, branch deleted, spec archived.
- Merge/push/delete blocked; record blocker and leave branch/PR intact for recovery.
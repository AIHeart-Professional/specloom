---
name: specloom-knowledgebase-work-records
description: >-
  INTERNAL — specloom-update-knowledgebase (write), validators/testers (read manifest only).
  Work-records folder schema. Not user-invokable.
disable-model-invocation: true
---

# SpecLoom Work Records

Path: `docs/specs/work-records/SPEC-{spec_id}/`

## Files

| File | Audience | Agent access |
|------|----------|--------------|
| **manifest.json** | Machines | Read — validators, testers |
| **work-done.md** | Humans | **Never read** by agents |
| implementation.md | Humans / audit | Written after tests pass |
| testing.md | Humans / audit | Written after tests pass |
| completion.json | Machines / audit | Written after tests pass |

## Lifecycle

```
task complete → specloom-update-knowledgebase updates manifest + work-done + spec Changes
all tasks done → specloom-worker-validation → manifest.status: awaiting_tests
tester pass → finalize_work_records → manifest.status: tests_passed
validator pass → archive → manifest.status: archived
validator fail → manifest.status: validation_failed → implement/tester remediation
```

## manifest.json schema

```json
{
  "spec_id": "042",
  "spec_path": "docs/specs/MMDDYY_name.md",
  "parent_feature": "docs/features/NNN_short-description.md",
  "status": "in_progress | awaiting_tests | tests_passed | validation_failed | archived",
  "updated_at": "ISO-8601",
  "git_task_branch": "task/042-001-slug",
  "layers": ["frontend", "backend"],
  "tasks": [],
  "files_index": [],
  "acceptance_criteria": []
}
```

## Per-task sync (task_sync)

1. Append spec **Changes** from `IMPLEMENTATION_RESULT.changes`
2. Merge task into `manifest.tasks[]`
3. Rebuild `files_index`
4. Append human block to **work-done.md**
5. All tasks complete → `status: awaiting_tests`

## Finalize (finalize_work_records)

After `TEST_RESULT.status: pass` (**specloom-tester** only):
- Write `implementation.md`, `testing.md`, `completion.json`
- Set `manifest.status: tests_passed`
- **Do not** archive — **specloom-validator** owns sign-off

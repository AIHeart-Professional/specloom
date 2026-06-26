---
name: sdd-work-records
description: >-
  INTERNAL — sdd-updates (write), sdd-validation and sdd-validation (read manifest only).
  Work-records folder schema. Not user-invokable.
---


# SDD Work Records

Path: `docs/specs/work-records/SPEC-{spec_id}/`

## Files

| File | Audience | Agent access |
|------|----------|--------------|
| **manifest.json** | Machines | **Read** — sdd-validation, sdd-validation (work) |
| **work-done.md** | Humans | **Never read** by agents |
| implementation.md | Humans / audit | Written after tests pass; agents do not read |
| testing.md | Humans / audit | Written after tests pass |
| completion.json | Machines / audit | Written after tests pass |

**Rule:** From work-records, agents read **`manifest.json` only**.

## Lifecycle

```
task complete → sdd-updates updates manifest.json + work-done.md + spec Changes
all tasks done → sdd-validation(work) reads manifest.json
              → sdd-validation reads manifest.json + spec Changes + Requirements + codebase
tests pass   → sdd-updates writes implementation.md, testing.md, completion.json
              → manifest.status = tests_passed
sign-off     → archive spec; work-records folder stays in place
```

## manifest.json schema

```json
{
  "spec_id": "042",
  "spec_path": "docs/specs/MMDDYY_name.md",
  "parent_feature": "github:owner/repo#43",
  "status": "in_progress | awaiting_tests | tests_passed | archived",
  "updated_at": "ISO-8601",
  "git_task_branch": "task/042-001-slug",
  "layers": ["frontend", "backend"],
  "tasks": [
    {
      "task_id": "T1",
      "layer": "frontend",
      "status": "complete",
      "completed_at": "ISO-8601",
      "tokens_used": 0,
      "files": [
        {
          "path": "src/foo.tsx",
          "action": "modified",
          "summary": "Added filter chip component"
        }
      ]
    }
  ],
  "files_index": [
    { "path": "src/foo.tsx", "task_id": "T1", "layer": "frontend" }
  ],
  "acceptance_criteria": ["User can filter groups by model"]
}
```

### Status values

| status | Meaning |
|--------|---------|
| `in_progress` | At least one task done; work ongoing |
| `awaiting_tests` | All tasks complete; ready for validation/test gate |
| `tests_passed` | sdd-validation passed; finalize records |
| `archived` | Spec archived |

### Update rules (sdd-updates)

1. **First task on spec:** create folder, `manifest.json`, `work-done.md` from templates.
2. **Each task complete:** merge `IMPLEMENTATION_RESULT.changes` into `tasks[]`, rebuild `files_index`, dedupe paths.
3. **All tasks complete:** set `status: awaiting_tests`, `layers` = unique task layers.
4. **Copy acceptance criteria** from spec Requirements into manifest once all tasks done.
5. **work-done.md:** append human `###` block per task — never parse this file back into manifest.

## VALIDATION_HANDOFF manifest field

```yaml
manifest_path: docs/specs/work-records/SPEC-042/manifest.json
```

Orchestrator always passes this when delegating sdd-validation.

## VALIDATION_HANDOFF manifest field

```yaml
manifest_path: docs/specs/work-records/SPEC-042/manifest.json
```

Orchestrator passes when delegating sdd-validation `work`.

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `sdd-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

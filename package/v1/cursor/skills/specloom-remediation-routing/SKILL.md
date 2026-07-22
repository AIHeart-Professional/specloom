---
name: specloom-remediation-routing
description: >-
  INTERNAL — specloom-implement, specloom-tester, specloom-validator only.
  Routes validation failures to implement vs tester. Not user-invokable.
disable-model-invocation: true
---

# Remediation Routing

When **specloom-validator** fails final validation, issues are tagged with an **owner** so the correct peer can fix them.

## Issue format (in spec `## Validation Results`)

```markdown
### Issues
1. [owner:implement|frontend] `src/Foo.tsx` — {issue} → {remediation}
2. [owner:tester|backend] `tests/unit/test_foo.py` — {issue} → {remediation}
```

| Owner | Who runs next | Typical files |
|-------|---------------|---------------|
| **implement** | `@specloom-implement` | Production paths in `manifest.files_index` |
| **tester** | `@specloom-tester` | `tests/`, `Tests/`, `*.test.*`, `*_test.*` |

**Rule:** test file path → `owner:tester`. Production path → `owner:implement`. Ambiguous → layer + spec task owner.

## manifest.status after validator fail

```json
"status": "validation_failed"
```

Store `validation_failures[]` summary in manifest optional field or rely on spec section.

## Work discovery

### specloom-implement

Run when **either**:
- Ready / In Progress implementation tasks exist, **or**
- `manifest.status: validation_failed` AND spec has `owner:implement` issues

On session start: read `## Validation Results` → build `fix_instructions[]` on `IMPLEMENTATION_HANDOFF`.

After implement remediation pass:
- Set `manifest.status: awaiting_tests` (production changed — tester re-runs suite)
- Tell user `@specloom-tester` then `@specloom-validator`

### specloom-tester

Run when **either**:
- `manifest.status: awaiting_tests`, **or**
- `manifest.status: validation_failed` AND spec has `owner:tester` issues

Read `## Validation Results` → pass test-specific fixes to test-loop / test-standards agents.

After tester remediation pass:
- Set `manifest.status: tests_passed`
- Tell user `@specloom-validator`

### specloom-validator

Run when:
- `manifest.status: tests_passed` (happy path), **or**
- Re-validation after remediation (still `tests_passed` or `validation_failed` with fixes applied)

**Not** before tests exist.

## Clearing failures

On validator **pass**: remove or mark resolved `## Validation Results` issues; set `manifest.status: archived` (after sign-off).

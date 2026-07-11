---
name: specloom-approval-mode
description: >-
  INTERNAL — specloom-implement, specloom-validator, specloom-tester only.
  /manual (default) and /auto approval commands; /approve for pending sign-off.
  Not user-invokable.
disable-model-invocation: true
---

# Approval Mode

Controls human review before **final archive**. **Final sign-off is owned by specloom-validator** after tests pass.

Pipeline: **implement → tester → validator (archive)**.

## Commands (user message)

| Command | Effect |
|---------|--------|
| **`/manual`** | Review card before **validator** archives **(default)** |
| **`/auto`** | Validator auto-archives on pass — no review card |
| **`/approve`** | Confirm pending sign-off (manual follow-up only) |

**Default when omitted:** `manual`

## Resolve mode (session start)

```
1. Parse user message for /auto, /manual, /approve
2. If /auto or /manual found → set active_work.json approvalMode
3. Else read active_work.json approvalMode (default "manual")
4. If /approve and pendingSignOff set → run deferred closeout; STOP
```

Persist in `docs/automation/state/active_work.json`:

```json
{
  "approvalMode": "manual",
  "humanApprovalRequired": false,
  "pendingSignOff": null
}
```

---

## Per-gate behavior

### specloom-implement (pass)

| Mode | On pass |
|------|---------|
| **manual** | Merge; `manifest.status: awaiting_tests`; suggest `@specloom-tester` |
| **auto** | Merge; `manifest.status: awaiting_tests`; suggest `@specloom-tester` |

Implement **never** archives. No review card at implement gate.

### specloom-tester (pass)

| Mode | On pass |
|------|---------|
| **manual** | `finalize_work_records`; `manifest.status: tests_passed`; suggest `@specloom-validator` |
| **auto** | Same — `finalize_work_records`; `manifest.status: tests_passed`; suggest `@specloom-validator` |

Tester **never** archives. No review card at test gate.

### specloom-validator (pass — final sign-off)

Validates **implementation + tests** together after `tests_passed`.

| Mode | On pass |
|------|---------|
| **manual** | Review card; **`pendingSignOff`**; **do not** `archive_spec` until `/approve` |
| **auto** | **`archive_spec`** + `sync_knowledge`; `manifest.status: archived`; update parent feature |

### specloom-validator (/approve after manual pass)

1. `archive_spec` via **specloom-update-knowledgebase**
2. `sync_knowledge`
3. Clear `pendingSignOff`

### specloom-validator (fail)

1. Append `## Validation Results` with `owner:implement` / `owner:tester` tags
2. `manifest.status: validation_failed`
3. Tell user `@specloom-implement` and/or `@specloom-tester` per **specloom-remediation-routing**

---

## Review card template (validator manual only)

```markdown
## Review required — final validation complete

**Spec:** {id} · **Mode:** manual

**Summary:** Implementation + tests validated.

**Confidence:** {score}/100 · **Coverage:** 100%

**Approve to archive?** Reply `/approve` or "sign off" to archive and close out.
**Or** reply with changes — issues route to implement/tester per owner tags.
```

## blocked when manual + pendingSignOff

If `pendingSignOff` is set and user runs validator **without** `/approve`:

- Reply: pending sign-off — `/approve` first
- **no_work** for duplicate final validation until resolved

Exception: user explicitly names different spec.

## Automations

Pass `/auto` in prompt for hands-off archive on validator pass.

## Examples

```
@specloom-implement
@specloom-tester
@specloom-validator /auto
@specloom-validator /approve
```

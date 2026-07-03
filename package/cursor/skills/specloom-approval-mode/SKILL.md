---
name: specloom-approval-mode
description: >-
  INTERNAL — specloom-implement, specloom-validator, specloom-tester only.
  /manual (default) and /auto approval commands; /approve for pending sign-off.
  Not user-invokable.
disable-model-invocation: true
---

# Approval Mode

Controls whether successful gate passes **require human sign-off before archive** or **auto-approve**.

Applies to: **specloom-implement**, **specloom-validator**, **specloom-tester** only.

## Commands (user message)

| Command | Effect |
|---------|--------|
| **`/manual`** | Require sign-off before archive / gate closeout **(default)** |
| **`/auto`** | Auto-approve — no human sign-off wait |
| **`/approve`** | Confirm pending sign-off (manual follow-up only) |

Aliases: `approval: manual`, `approval: auto`, `mode manual`, `mode auto`, `--manual`, `--auto`

**Default when omitted:** `manual`

## Resolve mode (session start)

```
1. Parse user message for /auto, /manual, /approve
2. If /auto or /manual found → set active_work.json approvalMode
3. Else read active_work.json approvalMode (default "manual")
4. If /approve and pendingSignOff set → run deferred closeout (see below); STOP
```

Persist in `docs/automation/state/active_work.json`:

```json
{
  "approvalMode": "manual",
  "humanApprovalRequired": false,
  "pendingSignOff": null
}
```

## manual mode — on gate pass

After git merge, **before** archive:

1. Set `humanApprovalRequired: true`
2. Set `pendingSignOff`:

```json
{
  "gate": "implement | validator | tester",
  "spec_id": "014",
  "spec": "docs/specs/MMDDYY_slug.md",
  "parent_feature": "docs/features/NNN_slug.md",
  "summary": "short outcome",
  "approvalMode": "manual"
}
```

3. Present **review card** (user must reply `/approve` or "approved" / "sign off")
4. **Do not** `archive_spec` until approved

### Review card template

```markdown
## Review required — [gate] complete

**Spec:** {id} · **Mode:** manual

**Summary:** {what was done}

**Confidence / coverage:** {score or %}

**Approve to archive?** Reply `/approve` or "sign off" to archive and close out.
**Or** reply with changes needed — do not archive.
```

## auto mode — on gate pass

1. Set `humanApprovalRequired: false`, `pendingSignOff: null`
2. Run post-pass actions immediately (per gate table)
3. Reply success — no review card

## /approve — deferred closeout

When `pendingSignOff` exists and user sends `/approve` or sign-off phrases:

1. Run gate-specific deferred actions (tester → `archive_spec`)
2. Clear `pendingSignOff`, set `humanApprovalRequired: false`
3. Reply confirmation

---

## Per-gate behavior

### specloom-implement (pass)

| Mode | On pass |
|------|---------|
| **manual** | Merge; `manifest.status: awaiting_validation`; review card; **no archive** |
| **auto** | Merge; `manifest.status: awaiting_validation`; tell user `@specloom-validator` |

Implement **never** archives spec in either mode.

### specloom-validator (pass)

| Mode | On pass |
|------|---------|
| **manual** | Merge; append validation pass to spec; `manifest.status: validation_passed`; review card; **do not** set `awaiting_tests` until `/approve` |
| **auto** | Merge; validation pass on spec; `manifest.status: awaiting_tests`; tell user `@specloom-tester` |

Validator **never** archives spec.

### specloom-tester (pass)

| Mode | On pass |
|------|---------|
| **manual** | `finalize_work_records`; `manifest.status: tests_passed`; review card; **do not** `archive_spec` |
| **auto** | `finalize_work_records` + **`archive_spec`** + `sync_knowledge`; `manifest.status: archived`; update parent feature |

### specloom-tester (/approve after manual pass)

1. `archive_spec` via **specloom-update-knowledgebase**
2. `sync_knowledge` when applicable
3. Clear `pendingSignOff`

---

## blocked when manual + pendingSignOff

If `pendingSignOff` is set and user runs same gate **without** `/approve`:

- Reply: pending sign-off exists — `/approve` or revise work first
- **no_work** for new work on that spec until resolved or user clears sign-off

Exception: user explicitly names different spec/feature in message.

## Automations

Cursor Automations should pass `/auto` in prompt for hands-off runs, or set `approvalMode: "auto"` in `active_work.json` before invoke.

## Examples

```
@specloom-implement /auto
@specloom-validator
@specloom-tester /manual
@specloom-tester /approve
```

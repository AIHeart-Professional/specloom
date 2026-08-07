---
name: document-runbook
description: >
  INTERNAL — specloom-document. Operational procedures — deploy, incident, restore.
disable-model-invocation: true
---


# Runbooks

Written for someone under pressure who did not write the system.

```
runbooks/<verb>-<subject>.md      deploy-api.md · restore-database.md
```

## Template

```markdown
# <Procedure>

**When:** the trigger
**Risk:** what this can break
**Rollback:** how to undo, before you start

## Preconditions
- [ ] checkable items

## Steps
1. One action. Exact command. Expected output.

## Verify
How you know it worked.

## If it fails
Named symptom → what to do.
```

## Rules

- **Rollback before steps.** Someone will read this mid-incident and needs the exit first
- One action per numbered step; no compound steps
- Exact commands, copy-pasteable, placeholders in `<angle-brackets>`
- Every step states its expected output — that is how a reader knows to stop
- No step that says "investigate". Name the check and what each result means

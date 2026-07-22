---
name: specloom-validate-protocol
description: >
  INTERNAL — specloom-validate. Final gate; auto Done. Not user-invokable.
disable-model-invocation: true
---

# Validate protocol

## Session

1. Contract + resolve-work
2. Brief status **Validating** only (or user override)
3. Re-run tests + **specloom-validate-loop** ≤3
4. Check Phase alignment: Brief scope ⊆ Phase In scope; no Out of scope without exception
5. Check Reason still matches delivered work
6. **Pass → status Done** immediately (full-auto). Comment summary + PR link.
7. If Project has zero open Briefs → Complete Phase Project; else leave Project.
8. **Fail →** comment with `owner:build|test` tags; status Failed; tell user which peer

## No sign-off

Never wait for `/approve`. Never pendingSignOff.

## Domain validators

| Layer | Agent |
|-------|--------|
| frontend | specloom-validate-frontend |
| backend | specloom-validate-backend |
| database | specloom-validate-database |

## Result

```json
{"type":"VALIDATE_RESULT","status":"pass|fail","brief_key":"","confidence":0,"issues":[{"owner":"build|test","msg":""}],"phase_complete":false}
```

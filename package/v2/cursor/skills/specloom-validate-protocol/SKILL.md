---
name: specloom-validate-protocol
description: >
  INTERNAL — specloom-validate. Auto Done; docs closeout; promote next; auto Task build.
  Not user-invokable.
disable-model-invocation: true
---

# Validate protocol

Load **specloom-queue**.

## Session

1. Contract + resolve-work + queue  
2. Stage **Validating** / `specloom:validating`  
3. Re-run tests + **specloom-validate-loop** ≤3  
4. Phase alignment + Reason check  
5. **Pass → Done** (clear specloom stage labels). Comment with SHAs on `ai-workflow`.  
6. **Docs closeout** — Task **specloom-document** `closeout` for this Brief (archive spec + refresh README/architecture/system/workflow/queue)  
7. **Promote next** runnable Brief → `specloom:ready` (see specloom-queue)  
8. Unless `manual` or no next: **Task specloom-build** on next head  
9. If no open Briefs on Phase → Complete Phase Project  
10. **Fail →** `owner:build|test`; Failed; route peers  

## No sign-off

Never `/approve`.

## Domain validators

`specloom-validate-frontend|backend|database`

## Result

```json
{"type":"VALIDATE_RESULT","status":"pass|fail","brief_key":"","confidence":0,"next_brief_key":null,"auto_build_next":true,"docs_closeout":true,"issues":[],"phase_complete":false}
```

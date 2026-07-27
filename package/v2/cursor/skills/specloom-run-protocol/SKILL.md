---
name: specloom-run-protocol
description: >
  INTERNAL — specloom-run only. One-Brief autonomous loop: build → code validate →
  test → test validate; ≤5 retries per gate; push on Done. Not user-invokable.
disable-model-invocation: true
---

# Run protocol (one SPE)

Orchestrator owns the whole execution path. Sub-agents never Task each other.

## Scope

- **One** Brief (queue head or user-named key) per session  
- Stop for user only on: `need_user`, Open Questions, secrets, irreversible prod, or **retry cap**  
- App git: always **`ai-workflow`**

## Gates

| Gate | After | Pass criteria |
|------|-------|----------------|
| **code_quality** | build | Validate mode `code_quality`; load **code-{lang}** + specloom-coding; **confidence ≥ 0.99** |
| **test_quality** | tests | Validate mode `test_quality`; load **test-{lang}** + specloom-testing; **confidence ≥ 0.99** AND **100% coverage** on Brief production files (manifest / changed source set) |

## Retry

- Each gate loop: **max 5** attempts  
- Attempt = (build or test work) + validate for that gate  
- On fail: pass issues + `owner:build|test` back to correct sub-agent; increment attempt  
- After 5 fails on same gate → **BLOCKED**: Linear comment + status Failed/Blocked + **alert user**; do not continue  

## Loop

```
0. Resolve Brief (Ready / Building / or key). Checkout+pull ai-workflow.
1. Stage Building (specloom:building)
2. BUILD_GATE (attempt 1..5):
   a. Task specloom-build (internal) — implement unchecked tasks via build-worker
   b. Task specloom-validate mode=code_quality
   c. if confidence ≥ 0.99 → break
   d. else remediate owner:build → retry
   e. if attempt==5 and fail → BLOCKED stop
3. Stage Testing (specloom:testing)
4. TEST_GATE (attempt 1..5):
   a. Task specloom-test (internal) — write/run tests via test-loop
   b. Task specloom-validate mode=test_quality (coverage must be 100% on scoped files)
   c. if confidence ≥ 0.99 AND coverage 100% → break
   d. else owner:test → retry test; owner:build → Task build then re-enter test gate (counts as attempt)
   e. if attempt==5 and fail → BLOCKED stop
5. Push origin ai-workflow (all commits)
6. Stage Done; clear specloom stage labels; comment SHAs + confidence
7. Task specloom-document closeout (optional failure → note, do not reopen SPE)
8. Promote next Brief Ready — **do not** auto-start next SPE (one-SPE focus). Tell user next key.
```

## Handoff shapes

### To build

```json
{"type":"RUN_HANDOFF","from":"specloom-run","to":"specloom-build","brief_key":"","attempt":1,"issues":[]}
```

### To test

```json
{"type":"RUN_HANDOFF","from":"specloom-run","to":"specloom-test","brief_key":"","attempt":1,"issues":[]}
```

### To validate

```json
{
  "type":"RUN_HANDOFF",
  "from":"specloom-run",
  "to":"specloom-validate",
  "brief_key":"",
  "mode":"code_quality|test_quality",
  "attempt":1,
  "require_confidence":0.99,
  "require_coverage":null
}
```

For `test_quality`, set `"require_coverage": 1.0`.

### From validate

```json
{
  "type":"VALIDATE_RESULT",
  "status":"pass|fail",
  "mode":"code_quality|test_quality",
  "brief_key":"",
  "confidence":0.0,
  "coverage":null,
  "issues":[{"owner":"build|test","detail":""}]
}
```

## User alert (blocked)

NL must include: Brief key, gate name, attempt count, top issues, what user can decide.  
Do not silently stop.

## Forbidden

- Tasking build→test→validate as a peer chain (orchestrator only)  
- Starting a second SPE in same session without user ask  
- Marking Done without both gates passed  
- Skipping push after success

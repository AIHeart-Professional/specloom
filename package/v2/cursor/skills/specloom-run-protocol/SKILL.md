---
name: specloom-run-protocol
description: >
  INTERNAL — specloom-run only. One-Brief autonomous loop: UX ensure → build → code
  validate → test → test validate; ≤5 retries; push on Done. Not user-invokable.
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
| **code_quality** | build | **confidence ≥ 0.99**; if visual also **ux_confidence ≥ 0.99** |
| **test_quality** | tests | **confidence ≥ 0.99** AND **coverage = 1.0** on Brief production files |

## Retry

- Each gate loop: **max 5** attempts  
- On fail: route `owner:build|test`; increment attempt  
- After 5 fails → **BLOCKED** + alert user  

## Loop

```
0. Resolve Brief. Checkout+pull ai-workflow.
0b. Visual? → specloom-ux-refs ensure (generate/screenshot missing page images → patch Brief → commit docs)
1. Stage Building
2. BUILD_GATE (1..5):
   a. Task specloom-build
   b. Task specloom-validate mode=code_quality
   c. pass if confidence≥0.99 AND (not visual OR ux_confidence≥0.99)
   d. else retry build; at 5 → BLOCKED
3. Stage Testing
4. TEST_GATE (1..5):
   a. Task specloom-test
   b. Task specloom-validate mode=test_quality (require_coverage 1.0)
   c. pass if confidence≥0.99 AND coverage 100%
   d. else retry; owner:build → build then re-test; at 5 → BLOCKED
5. Push origin ai-workflow
6. Done + comment SHAs + confidences
7. Task specloom-document closeout
8. Promote next Ready — do not auto-run next SPE
```

Load **specloom-ux-refs** for step 0b.

## Handoff shapes

### To build / test

```json
{"type":"RUN_HANDOFF","from":"specloom-run","to":"specloom-build|specloom-test","brief_key":"","attempt":1,"issues":[]}
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
  "require_ux_confidence":0.99,
  "require_coverage":null,
  "visual":false
}
```

Set `visual: true` and `require_ux_confidence: 0.99` when Brief is visual.  
For `test_quality`, set `require_coverage: 1.0`.

### From validate

```json
{
  "type":"VALIDATE_RESULT",
  "status":"pass|fail",
  "mode":"code_quality|test_quality",
  "brief_key":"",
  "confidence":0.0,
  "ux_confidence":null,
  "ux_required":false,
  "coverage":null,
  "issues":[{"owner":"build|test","detail":""}]
}
```

## Forbidden

- Peer-chaining build→test→validate  
- Skipping UX ensure on visual Briefs  
- Passing visual Briefs without ux_confidence ≥ 0.99  
- Auto-starting next SPE  
- Skipping push after success

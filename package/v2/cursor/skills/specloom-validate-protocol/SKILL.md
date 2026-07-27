---
name: specloom-validate-protocol
description: >
  INTERNAL — specloom-validate. Score code_quality or test_quality for specloom-run.
  Not user-invokable.
disable-model-invocation: true
---

# Validate protocol

Invoked under **specloom-run**. **Does not** mark Done / promote / Task build.

## Session

1. Read `RUN_HANDOFF.mode` = `code_quality` | `test_quality`  
2. Thresholds: `require_confidence` (default **0.99**); for test mode `require_coverage` (default **1.0**)  
3. **specloom-validate-loop** ≤3  
4. Return **VALIDATE_RESULT** only  

## code_quality

- Load **code-{lang}** skills + Brief Code Standards  
- If UX refs / Image Files listed → load **specloom-ux-refs**; score UI against refs  
- Domain validators as needed  
- Score adherence to professional standards + Brief acceptance for implementation  
- `confidence` ∈ [0,1]; pass iff ≥ threshold  
- Failures → `owner:build`

## test_quality

- Load **test-{lang}** skills + Brief Test Standards  
- Score test professionalism (styles, isolation, assertions)  
- **Coverage:** fraction of Brief production source files/lines covered; pass iff ≥ `require_coverage` (default 100%)  
- If coverage tool missing → fail with issue to add coverage measurement OR enumerate uncovered files and set coverage `< 1`  
- Weak tests → `owner:test`; missing prod seams → `owner:build`

## Result

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

## Forbidden

- Marking Brief Done  
- Tasking document / build / test  
- Passing below 0.99 when require_confidence is 0.99

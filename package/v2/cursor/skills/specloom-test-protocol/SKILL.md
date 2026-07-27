---
name: specloom-test-protocol
description: >
  INTERNAL — specloom-test. Tests only; orchestrator owns validate gate.
  Not user-invokable.
disable-model-invocation: true
---

# Test protocol

Invoked under **specloom-run**. No auto Task validate.

## Session

1. Contract + resolve Brief  
2. Stage **Testing**  
3. Checkout/pull **`ai-workflow`**  
4. Apply `issues[]`  
5. **specloom-test-loop** ≤5  
6. Measure coverage on Brief production files when possible  
7. Commit; return **TEST_RESULT** — **do not** Task validate  

## Loop

Per Brief layer: `specloom-test-frontend|backend|database`. Load **specloom-testing** + `test-{lang}`. No prod features unless issue owner is build (then return fail with owner:build for orchestrator).

## Result

```json
{"type":"TEST_RESULT","status":"pass|fail","brief_key":"","coverage":null,"uncovered_files":[],"commands":[],"failures":[],"notes":""}
```

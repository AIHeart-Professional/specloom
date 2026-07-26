---
name: specloom-test-protocol
description: >
  INTERNAL — specloom-test. Queue stages; auto Task validate unless manual.
  Not user-invokable.
disable-model-invocation: true
---

# Test protocol

Load **specloom-queue**.

## Session

1. Contract + resolve-work + git-workflow  
2. Brief stage **Testing** / `specloom:testing`  
3. **specloom-test-loop** ≤5  
4. Pass → stage **Validating** (`specloom:validating`); unless `manual`: **Task specloom-validate**  
5. Fail → comment; Failed or stay Testing; suggest `@specloom-build` if prod bug  

## Loop (≤5)

Per Brief layer: `specloom-test-frontend|backend|database`. Load **specloom-testing**. No prod features.

## Result

```json
{"type":"TEST_RESULT","status":"pass|fail","brief_key":"","auto_validate":true,"commands":[],"failures":[],"notes":""}
```

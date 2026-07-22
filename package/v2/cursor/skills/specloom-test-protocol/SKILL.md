---
name: specloom-test-protocol
description: >
  INTERNAL — specloom-test + test-loop. Write/run tests; Linear Testing→Validating. Not user-invokable.
disable-model-invocation: true
---

# Test protocol

## Session

1. Contract + resolve-work + git-workflow
2. Brief status **Testing** (or Failed with test-owned issues)
3. Delegate **specloom-test-loop** ≤5
4. Pass → Linear **Validating** + comment; tell user `@specloom-validate`
5. Fail → comment failures + **Failed** or stay Testing; tell user `@specloom-build` if prod bug

## Loop (≤5)

Per layer in Brief: delegate `specloom-test-frontend|backend|database`. Load **specloom-testing**. Run tests. No prod feature code.

## Result

```json
{"type":"TEST_RESULT","status":"pass|fail","brief_key":"","commands":[],"failures":[],"notes":""}
```

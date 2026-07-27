---
name: specloom-remediation
description: >
  INTERNAL — specloom-run. Route validate failures back through orchestrator loops.
  Not user-invokable.
disable-model-invocation: true
---

# Remediation

Orchestrator (**specloom-run**) reads `VALIDATE_RESULT.issues[]`:

```
owner:build — …
owner:test — …
```

| Owner | Orchestrator action |
|-------|---------------------|
| build | Re-enter BUILD_GATE (or mid TEST_GATE → Task build then re-validate test) |
| test | Re-enter TEST_GATE with issues |
| both | build first, then test, then matching validate |

Sub-agents do **not** Task each other. Only **specloom-run** routes.

After **5** failed attempts on the same gate → BLOCKED + alert user (see specloom-run-protocol).

---
name: specloom-remediation
description: >
  INTERNAL — Loop Controller. Route gate failures to Implementation / Tester / Security.
  Not user-invokable.
disable-model-invocation: true
---

# Remediation

**Loop** reads gate issues:

```
owner:build — …
owner:test — …
owner:security — …
```

| Owner | Loop action |
|-------|-------------|
| build | Re-Task Implementation with diagnostics |
| test | Re-Task Tester (or Implementation if tests need code) |
| security | Re-Task Implementation with security findings (then Security again) |
| both build+test | Implementation first, then Tester |

Workers **never** Task each other. Only **Loop** routes.

After **5** failed attempts → `status: FAILED` payload to Orchestrator (Orchestrator NLPs user — does not retry).

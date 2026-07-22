---
name: specloom-remediation
description: >
  INTERNAL — build/test/validate. Route failures by owner tags. Not user-invokable.
disable-model-invocation: true
---

# Remediation

On validate fail comment:

```
owner:build — …
owner:test — …
```

| Owner | Next |
|-------|------|
| build | Brief → Failed or Building; user/automation `@specloom-build` |
| test | Brief → Testing; `@specloom-test` |
| both | build first, then test, then validate |

Build/test read last validate comment; fix only owned items; clear by new validate pass.

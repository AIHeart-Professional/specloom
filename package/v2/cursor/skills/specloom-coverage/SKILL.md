---
name: specloom-coverage
description: >
  INTERNAL — Tester / Loop. Enforce coverage ≥ 0.99 with language ignore directives.
disable-model-invocation: true
---

# Status: STUB

Canonical rules: `package/v2/WORKFLOW-V2.md`.

## Require

coverage ≥ **0.99** on Brief production files.

## Allowed ignores (defensive / unreachable only)

| Stack | Directive |
|-------|-----------|
| Python | # pragma: no cover |
| JS/TS | /* istanbul ignore next */ (c8/nyc ok) |
| Other | per test-{lang} |

Reject ignores that hide acceptance-criteria logic.


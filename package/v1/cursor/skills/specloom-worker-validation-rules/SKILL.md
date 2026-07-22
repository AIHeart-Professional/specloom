---
name: specloom-worker-validation-rules
description: >-
  INTERNAL — specloom-worker-validation only. App run checks + doc/spec/feature rules scoring.
  Not user-invokable.
disable-model-invocation: true
---

# Worker Validation Rules

Invoked after all spec tasks complete.

Load **specloom-phase-alignment** for phase boundary checks.

## Dimension 1: Application runs (50%)

Run commands from:
1. Spec **Validation** section
2. `AGENTS.md` build/lint/typecheck/smoke

| Outcome | app_score |
|---------|-----------|
| Zero blocking errors | 100 |
| Any blocking error | 0 |

Set `app_runs: true` only when app_score = 100.

Record each command in `app_checks[]` with `cmd`, `exit`, `note`.

## Dimension 2: Rules compliance (50%)

Traverse and verify:

| Source | Checks |
|--------|--------|
| Spec | Goal, Requirements, tasks, Validation commands listed |
| Parent feature | Scope alignment, acceptance criteria |
| Phase `PHASE.md` | In scope / Out of scope alignment |
| `required_context[]` | Every referenced doc rule followed in changed files |
| `standards[]` | Repo code standards applied |
| `docs/code/*/CORE.md` | Language rules from spec Required Context |
| `docs/architecture/` | Patterns when referenced |
| `docs/decisions/` | Durable decisions honored |

### Violation severity

| Severity | Score impact |
|----------|--------------|
| critical | -25 each |
| major | -10 each |
| minor | -3 each |

Start at 100, subtract. Floor at 0.

## Confidence

```
confidence_score = round((app_score + rules_compliance.score) / 2)
```

**Pass:** `confidence_score >= 99` AND `app_runs: true`.

## Fail remediation

```yaml
remediation:
  layer: frontend | backend | database | game
  files: []
  issues: [{ severity, rule, source, file, fix }]
```

Route via **specloom-implement** → **specloom-worker** → domain developer.

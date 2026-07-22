---
name: specloom-frontend-validator-rules
description: INTERNAL — specloom-frontend-validator only. Frontend validation rubric. Not user-invokable.
disable-model-invocation: true
---

# Frontend Validator Rules

## Read scope

1. `manifest.json` — `files_index` where `layer: frontend`
2. Spec Goal, Requirements, task acceptance
3. Parent feature doc
4. Phase `PHASE.md` from Required Context
5. `required_context[]` + `standards[]`
5. `docs/architecture/` (UI/navigation sections)
6. `docs/code/typescript/CORE.md`, `docs/code/react-native/CORE.md` when listed

## Dimension scores (0–100 each)

### alignment (40% of layer score)

- Every requirement has corresponding UI/behavior in changed files
- Reference images match layout (when provided)
- Task checklist items satisfied
- Phase **In scope** / not **Out of scope** per `PHASE.md`

### architecture (30%)

- Component boundaries per architecture docs
- Navigation/state patterns match project conventions
- No forbidden cross-layer imports

### standards (30%)

- TypeScript/React/RN rules from developer skills
- Spec Code Standards section
- Logging, error handling, accessibility per repo docs

## Layer confidence

```
confidence_score = round(alignment * 0.4 + architecture * 0.3 + standards * 0.3)
```

**Pass:** `>= 99`

## Findings format

```yaml
findings:
  - severity: critical | major | minor
    file: path
    issue: description
    remediation: concrete fix
    source: doc path that defines the rule
```

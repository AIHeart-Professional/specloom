---
name: specloom-backend-validator-rules
description: INTERNAL — specloom-backend-validator only. Backend validation rubric. Not user-invokable.
disable-model-invocation: true
---

# Backend Validator Rules

## Read scope

1. Manifest backend files
2. Spec API/data requirements
3. Feature scope
4. `docs/code/python/CORE.md`, architecture API sections

## Dimension scores

Same weights as frontend: alignment 40%, architecture 30%, standards 30%.

### alignment

- Endpoints/handlers match spec contracts
- Auth/error semantics per requirements

### architecture

- Layering (routes → services → data)
- Dependency direction per architecture docs

### standards

- Python/backend skill rules
- Input validation, logging, error responses

## Layer confidence

```
confidence_score = round(alignment * 0.4 + architecture * 0.3 + standards * 0.3)
```

**Pass:** `>= 99`

---
name: specloom-database-validator-rules
description: INTERNAL — specloom-database-validator only. Database validation rubric. Not user-invokable.
disable-model-invocation: true
---

# Database Validator Rules

## Read scope

1. Manifest database changes
2. Spec data/RLS requirements
3. `docs/code/sql/CORE.md`
4. Architecture data layer docs

## Dimension scores

alignment 40%, schema/RLS architecture 30%, postgres standards 30%.

### alignment

- Tables/columns/policies match spec data model
- RLS covers all required access patterns

### architecture

- Normalization, indexing strategy per architecture
- Migration safety

### standards

- RLS best practices, naming, no SQL injection surfaces

## Layer confidence

**Pass:** `>= 99`

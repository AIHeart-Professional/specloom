---
name: specloom-database-test-standards-rules
description: INTERNAL — specloom-database-test-standards only. Database test types, coverage, spec/feature mapping. Not user-invokable.
disable-model-invocation: true
---

# Database Test Standards

## Spec / feature mapping (mandatory)

RLS and schema tests must trace to spec security requirements and parent feature acceptance criteria.

## Test types

| Type | Scope |
|------|-------|
| **integration** | Schema migrations apply cleanly |
| **RLS** | Policy allow/deny per role matrix in spec |
| **regression** | Data integrity constraints from spec |

## Coverage target

**100%** on database work items in manifest (migrations, policies, functions).

## Execution

- Supabase local or test project per `AGENTS.md`
- Never run destructive tests against production
- Follow **test-postgres** — not **code-postgres**

## RLS test pattern

For each policy in spec:
1. Authenticate as role A → expect allow/deny per spec
2. Authenticate as role B → expect allow/deny per spec

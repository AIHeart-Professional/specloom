---
name: specloom-database-test-standards-rules
description: INTERNAL — specloom-database-test-standards only. Database test types and coverage rules. Not user-invokable.
disable-model-invocation: true
---

# Database Test Standards

## Test types

| Type | Scope |
|------|-------|
| **integration** | Schema migrations apply cleanly |
| **RLS** | Policy allow/deny per role matrix in spec |
| **regression** | Data integrity constraints |

## Coverage target

**100%** on database work items in manifest (migrations, policies, functions).

## Execution

- Supabase local or test project per `AGENTS.md`
- Never run destructive tests against production

## RLS test pattern

For each policy in spec:
1. Authenticate as role A → expect allow/deny
2. Authenticate as role B → expect allow/deny

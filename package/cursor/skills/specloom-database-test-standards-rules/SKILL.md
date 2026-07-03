---
name: specloom-database-test-standards-rules
description: INTERNAL — specloom-database-test-standards only. Database test types, coverage, spec/feature mapping. Not user-invokable.
disable-model-invocation: true
---

# Database Test Standards

## Spec / feature mapping (mandatory)

RLS and schema tests must trace to spec security requirements and parent feature acceptance criteria. Record `spec_ref` on `tests_added[]`.

## Test styles (all required per spec work)

| Style | Scope |
|-------|--------|
| **unit** | SQL functions, constraints in isolation |
| **integration** | Migrations, RLS, triggers on test DB |
| **system** | App + Supabase client full security path |
| **performance** | `EXPLAIN (ANALYZE)` on spec hot queries |

## Skills (test only)

- **test-postgres** — never **code-postgres**

## Coverage target

**100%** on database work items in manifest (migrations, policies, functions).

## Execution

- Supabase local or test project per `AGENTS.md`
- Never run destructive tests against production

## RLS test pattern (integration/system)

For each policy in spec:
1. Authenticate as role A → expect allow/deny per spec
2. Authenticate as role B → expect allow/deny per spec

## Output

`tests_added[]` with `spec_ref` and `style`; `uncovered_files[]`.

---
name: qa-tester-postgres
description: >-
  INTERNAL — sdd-qa-tester, sdd-database-developer agents. PostgreSQL/Supabase testing standards.
  Pair with database-developer-postgres. Not user-invokable.
disable-model-invocation: true
---

# PostgreSQL / Supabase Testing Standards

Pair with **database-developer-postgres**.

## Scope

- Schema migrations apply cleanly on empty and existing DBs.
- RLS policies enforce tenant/user isolation.
- Constraints, triggers, and functions behave as specified.

## Environment

- **Local Supabase** or isolated test project — never production.
- Test as **`authenticated`** and **`anon`** roles — not superuser (RLS blind spot).
- Use **service_role** only in explicit admin test fixtures — document why.

## RLS tests

For each policy set:

| Operation | Assert |
|-----------|--------|
| SELECT | User A cannot read User B rows |
| INSERT | `WITH CHECK` rejects invalid ownership |
| UPDATE | Requires SELECT policy; returns expected row count |
| DELETE | Unauthorized role affects 0 rows |

Use `(SELECT auth.uid())` pattern in policies under test.

## Integration

- pgTAP or application integration tests that exercise real queries through Supabase client.
- Verify migration up/down or forward-only path per project policy.

## Performance smoke

- `EXPLAIN` on hot queries touched by spec — no sequential scan on large tables without index.

## Anti-patterns

- Testing RLS only as superuser.
- Skipping UPDATE policy SELECT prerequisite tests.
- SQL string concatenation in test setup.

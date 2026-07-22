---
name: test-postgres
description: >-
  INTERNAL — specloom-database-test-standards only. Postgres/Supabase testing standards.
  Unit, integration, system, performance. Do not load code-postgres. Not user-invokable.
---

# PostgreSQL / Supabase Testing Standards

Professional database test standards. **Testing only** — no schema authoring rules.

## Required test styles (all four per spec work)

| Style | Scope |
|-------|--------|
| **unit** | SQL functions, constraints logic via isolated queries |
| **integration** | Migrations, RLS, triggers with real test DB |
| **system** | App + Supabase client full path per spec security model |
| **performance** | `EXPLAIN (ANALYZE)` on hot queries; index usage |

## Environment

- **Local Supabase** or isolated test project — never production
- Roles: **`authenticated`**, **`anon`** — not superuser for RLS tests
- **`service_role`** only in documented admin fixtures

## RLS tests (integration/system)

Per spec policy matrix:

| Operation | Assert |
|-----------|--------|
| SELECT | Tenant A cannot read tenant B |
| INSERT | `WITH CHECK` rejects invalid ownership |
| UPDATE | SELECT policy prerequisite; expected row count |
| DELETE | Unauthorized → 0 rows |

Use `(SELECT auth.uid())` in policies under test.

## Migrations (integration)

- Apply on empty and seeded DB
- Forward-only or up/down per project policy

## Performance (performance)

- No sequential scan on large tables without index on spec hot paths
- Document baseline ms for critical queries when spec requires

## Coverage

- **100%** on database work items in manifest (policies, functions, migrations)

## Anti-patterns

- RLS tested only as superuser
- Destructive tests against production
- SQL string concatenation in fixtures

## References

- [Supabase Testing](https://supabase.com/docs/guides/database/overview)
- [pgTAP](https://pgtap.org/) when project adopts it

## Codex Port

Internal — **specloom-database-test-standards** only.

---
name: specloom-database-developer-postgres
description: >-
  INTERNAL ù specloom-database-developer agents only. Universal Postgres coding standards. No testing ó use test-postgres in specloom-tester. Not user-invokable.
---

# PostgreSQL / Supabase Core Standards

Universal database standards for PostgreSQL and Supabase-backed applications. Apply to schema design, migrations, RLS policies, and SQL accessed via Supabase MCP or migration tools.

## Non-Negotiables

- **All schema changes via migrations** ó never manual prod DDL outside migration pipeline.
- **RLS enabled** on every table in exposed schemas (`public` by default) before API exposure.
- **Never expose `service_role` key** to client, mobile, or browser code ó server/admin only.
- Use **`timestamptz`** for all timestamps ó not `timestamp without time zone`.
- Primary keys on every table ó prefer **`uuid`** (`gen_random_uuid()`) or **`bigint`** identity per project convention.
- **Parameterized queries** only ó no string-concatenated SQL from application code.
- Foreign keys, indexes, and constraints named explicitly ó not anonymous defaults.

## Schema Design

- **Normalize first** ó denormalize only with documented read-performance justification.
- Table and column names: **`snake_case`**, plural table names (`users`, `study_groups`) or singular ó pick one per project and stay consistent.
- Every table includes **`created_at timestamptz NOT NULL DEFAULT now()`** and **`updated_at timestamptz`** (trigger-maintained).
- Soft delete via **`deleted_at timestamptz`** when audit/history required ó filter in queries and RLS.
- Avoid nullable columns unless absence is meaningful ó use `NOT NULL` with defaults where appropriate.
- Document enum choices ó prefer Postgres **`ENUM`** or **`CHECK`** constraints over magic strings in app only.
- Use **`text`** over `varchar(n)` unless a hard length limit is a domain rule.

## Indexes

- Index **all foreign key columns** used in joins and RLS policies.
- Index columns frequently filtered, sorted, or used in **`WHERE`**, **`JOIN`**, **`ORDER BY`**.
- Composite indexes: **leading column = most selective** filter in typical queries.
- Use **`EXPLAIN (ANALYZE, BUFFERS)`** to validate slow queries before shipping.
- Partial indexes for hot subsets (e.g. `WHERE deleted_at IS NULL`).

## Row Level Security (Supabase)

RLS is mandatory for any table reachable via the Data API.

### Enablement

```sql
ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.my_table FORCE ROW LEVEL SECURITY;  -- applies to table owner too
```

- Bundle **`GRANT`** + **`ENABLE ROW LEVEL SECURITY`** + policies in the **same migration**.
- New tables in `public` are API-exposed by default ó enable RLS before merge.

### Policy rules

- **Separate policies** per operation ó do not use `FOR ALL`; write distinct SELECT, INSERT, UPDATE, DELETE policies.
- **SELECT** ó `USING` only, no `WITH CHECK`.
- **INSERT** ó `WITH CHECK` only, no `USING`.
- **UPDATE** ó both `USING` and `WITH CHECK`.
- **DELETE** ó `USING` only, no `WITH CHECK`.
- Policy names must be **descriptive** (explain who can do what).
- Prefer **`PERMISSIVE`** policies unless a documented need for `RESTRICTIVE`.
- Always specify role: **`TO authenticated`**, **`TO anon`** ó skip evaluation for irrelevant roles.

### Auth in policies

- Use **`(SELECT auth.uid())`** wrapper ó not bare `auth.uid()` per row (InitPlan optimization).
- Same pattern for **`(SELECT auth.jwt())`** when needed.
- **Never authorize from `user_metadata`** ó users can modify it; use **`app_metadata`** or membership tables.
- **`service_role`** bypasses RLS ó server-side admin tasks only.

### UPDATE gotcha

UPDATE requires a matching **SELECT policy** ó without it, updates silently affect **0 rows**.

### Performance

- Index every column referenced in RLS `USING` / `WITH CHECK` expressions.
- Minimize joins inside policies ó prefer subqueries or precomputed membership arrays.
- Add filters in application queries that align with RLS (defense in depth + planner hints).

## Views

- On Postgres 15+: **`security_invoker = true`** on views so RLS of underlying tables applies to callers.
- Do not use views to bypass RLS unintentionally.

## Functions

- RLS does **not** apply inside functions ó control access with **`GRANT EXECUTE`** to specific roles.
- Review **`SECURITY DEFINER`** functions carefully ó they run as owner; validate caller inside function body.
- Keep functions **immutable / stable** annotations accurate for planner optimization.

## Migrations

- One logical change per migration file ó reversible when feasible (`down` migration or documented rollback).
- Never edit applied migration history ó add a new migration to fix forward.
- Seed data in separate scripts unless required for local dev bootstrap.
- Test migrations against a copy of production-like data volume when possible.

## Supabase-Specific

- Use **Supabase MCP** or CLI for schema changes in SDD workflow ó do not hand user raw SQL files to apply.
- **Anon key** + RLS = client access model; **service role** = trusted server only.
- Realtime subscriptions must respect same RLS policies as REST.
- Storage buckets: separate RLS policies on `storage.objects` ó do not leave public unless intentional.

## Security Checklist

- [ ] RLS enabled + forced on all public tables
- [ ] Separate SELECT/INSERT/UPDATE/DELETE policies
- [ ] `TO authenticated` / `TO anon` specified
- [ ] `(SELECT auth.uid())` pattern used
- [ ] No authorization from `user_metadata`
- [ ] Service role never in client env
- [ ] FK columns indexed
- [ ] Views use `security_invoker = true` (PG 15+)

## Anti-Patterns

- Tables in `public` without RLS on a Supabase project with Data API enabled.
- `FOR ALL` single policy masking missing operation-specific rules.
- Bare `auth.uid()` in policies on large tables without indexes.
- Storing secrets in database columns without encryption justification.
- Using `service_role` in mobile or web bundles.

## Review Checklist

- [ ] Migration is idempotent-safe and named clearly
- [ ] RLS policies match product auth model
- [ ] Indexes on FK and policy filter columns
- [ ] Timestamps use `timestamptz`
- [ ] No breaking change without migration path
- [ ] EXPLAIN reviewed for new hot queries

## References

- [Supabase ó Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase ó Securing your API](https://supabase.com/docs/guides/api/securing-your-api)
- [Supabase ó Postgres Indexes](https://supabase.com/docs/guides/database/postgres/indexes)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/current/)
- [Supabase RLS Policy Examples (GitHub)](https://github.com/supabase/supabase/blob/master/examples/prompts/database-rls-policies.md)

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `specloom-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.

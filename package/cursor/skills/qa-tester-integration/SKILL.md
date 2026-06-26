---
name: qa-tester-integration
description: >-
  INTERNAL — sdd-qa-tester agent only. Integration test execution protocol.
  Not user-invokable.
disable-model-invocation: true
---

# SDD Integration Testing

Loaded by **sdd-qa-tester** when `test_type: integration` or during full suite.

## Scope

- Multiple modules/services working together
- API route + service + repository boundaries
- DB queries against test database or Supabase local (never prod)
- Auth middleware + protected endpoints

## Procedure

1. Identify integration boundaries from spec Requirements and **Changes**.
2. Read `AGENTS.md` for integration test command.
3. Run full integration suite; if scoped suite exists, run scoped + smoke full.
4. Record command, exit code, pass/fail counts, duration.

## Pass criteria

- Exit code 0
- All API contracts in spec Requirements verified
- DB migrations apply cleanly on test instance
- RLS policies tested with `authenticated` / `anon` roles — not superuser

## Supabase / database

- Use test project or local stack — never `service_role` against prod for tests
- Verify cross-tenant isolation in multi-tenant specs
- UPDATE/DELETE policies must return expected row counts

## Failure output

Include `remediation.layer` (`frontend` | `backend` | `database`) and suspected files.

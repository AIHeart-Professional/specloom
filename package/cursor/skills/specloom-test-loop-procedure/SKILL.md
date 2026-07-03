---
name: specloom-test-loop-procedure
description: INTERNAL — specloom-test-loop only. Test implementation iteration (max 5). Not user-invokable.
disable-model-invocation: true
---

# Test Loop Procedure

**Max 5 iterations** per test session.

## Skill boundary

Delegate **specloom-*-test-standards** only. They load **test-*** skills — never **code-***.

## Per iteration

1. Read uncovered files + spec acceptance gaps from prior result
2. For each layer in `layers[]`:
   - Build `TEST_STANDARDS_HANDOFF` with spec + feature paths
   - Return delegation to **specloom-tester** — tester executes Task calls
3. When `parallel: true` → multiple layers same iteration
4. Re-run coverage + full test suite
5. **Pass:** `coverage_percent == 100` AND all tests green AND spec criteria mapped

## Fail

Return `status: fail` with coverage gap + unmapped spec criteria. **specloom-tester** surfaces to user.

## Layer → agent map

| layer | agent |
|-------|-------|
| frontend | specloom-frontend-test-standards |
| backend | specloom-backend-test-standards |
| database | specloom-database-test-standards |

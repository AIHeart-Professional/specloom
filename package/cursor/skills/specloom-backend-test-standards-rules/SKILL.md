---
name: specloom-backend-test-standards-rules
description: INTERNAL — specloom-backend-test-standards only. Backend test types, coverage, spec/feature mapping. Not user-invokable.
disable-model-invocation: true
---

# Backend Test Standards

## Spec / feature mapping (mandatory)

Map every test to spec **Requirements**, task acceptance criteria, or parent **feature** acceptance criteria. Record `spec_ref` on `tests_added[]`.

## Test types

| Type | Scope |
|------|-------|
| **unit** | Services, utilities, pure functions |
| **integration** | API routes, DB interactions (test DB) |
| **regression** | Spec acceptance criteria |

## Coverage target

**100%** on manifest backend production files.

## Commands

From `AGENTS.md` — pytest/jest with coverage flags.

## Patterns

- Mock external services at integration boundaries
- Use **test-python** / **test-typescript** fixtures — not code-* developer skills
- Assert response shapes and status codes match spec Requirements

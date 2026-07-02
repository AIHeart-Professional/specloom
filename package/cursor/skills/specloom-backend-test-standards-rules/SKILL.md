---
name: specloom-backend-test-standards-rules
description: INTERNAL — specloom-backend-test-standards only. Backend test types and coverage rules. Not user-invokable.
disable-model-invocation: true
---

# Backend Test Standards

## Test types

| Type | Scope |
|------|-------|
| **unit** | Services, utilities, pure functions |
| **integration** | API routes, DB interactions (test DB) |
| **regression** | Spec acceptance criteria |

## Coverage target

**100%** on manifest backend files.

## Commands

From `AGENTS.md` — pytest/jest with coverage flags.

## Patterns

- Mock external services at integration boundaries
- Use fixtures per `docs/code/python/CORE.md` test section

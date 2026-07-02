---
name: specloom-specloom-system-advisor-reference
description: >-
  INTERNAL — specloom-system-advisor only. SpecLoom system map — agents, skills, workflows.
  Not user-invokable.
disable-model-invocation: true
---

# SpecLoom System Reference

Global install: `~/.cursor/agents/`, `~/.cursor/skills/`. Repo: `{repo}/docs/`.

## User entry (speak natural language)

| Agent | Role |
|-------|------|
| **specloom-work-creator** | Planning — ideas, features, specs |
| **specloom-implement** | Implementation — code, validation, tests |

## Orchestrators (internal unless invoked directly)

| Agent | Role |
|-------|------|
| **specloom-worker** | Implementation loop (≤10) |
| **specloom-validator** | Draft + code quality |
| **specloom-tester** | Test suite (100% coverage) |
| **specloom-git** | Branches, push, merge (`ai-workflow`) |

## Domain agents

| Agent | Layer |
|-------|-------|
| **specloom-frontend-developer** | UI |
| **specloom-backend-developer** | API |
| **specloom-database-developer** | Supabase/Postgres |
| **specloom-*-validator** | Per-layer quality |
| **specloom-*-test-standards** | Per-layer tests |
| **specloom-update-knowledgebase** | Docs sync |

## Session contract

All orchestrators: work discovery → `no_work` or git `task_start` → work → git merge → reply.

**Priority:** specs before features.

## Key skills

| Skill | Purpose |
|-------|---------|
| **specloom-orchestrator-session** | Work queue + git bookends |
| **specloom-implement-protocol** | Handoff JSON schemas |
| **specloom-work-creator-*** | Planning docs |
| **code-*** / **test-*** | Universal coding/testing standards |

## Output contract

User-facing agents → natural language. All other `specloom-*` → JSON only.

See **WORKFLOW.md** in the specloom repo for full lifecycle.

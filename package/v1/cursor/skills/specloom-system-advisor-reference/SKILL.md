---
name: specloom-specloom-system-advisor-reference
description: >-
  INTERNAL — specloom-system-advisor only. SpecLoom system map — agents, skills, workflows.
  Not user-invokable.
disable-model-invocation: true
---

# SpecLoom System Reference

Global install: `~/.cursor/agents/`, `~/.cursor/skills/`. Repo: `{repo}/docs/`.

## User entry — five independent peers

| Agent | Invoke | Role | Loop cap |
|-------|--------|------|----------|
| **specloom-work-creator** | `@specloom-work-creator` | Planning | — |
| **specloom-implement** | `@specloom-implement` | Implementation | worker **10** |
| **specloom-validator** | `@specloom-validator` | Quality | standardized **3** |
| **specloom-tester** | `@specloom-tester` | Tests | test **5** |
| **specloom-git** | `@specloom-git` | Git-only | — |

**Peers never Task-delegate each other.** User chains manually.

## Sub-agents (internal)

| Agent | Parent | Role |
|-------|--------|------|
| **specloom-worker** | implement | Implementation loop (≤10) |
| **specloom-standardized-loop** | validator | Quality loop (≤3) |
| **specloom-test-loop** | tester | Test loop (≤5) |
| **specloom-*-developer** | worker | Per-layer code |
| **specloom-*-validator** | standardized-loop | Per-layer quality |
| **specloom-*-test-standards** | test-loop | Per-layer tests |
| **specloom-update-knowledgebase** | implement / tester | Docs sync |

## Session contract

All peers: work discovery → `no_work` or git `task_start` → scope → git merge → reply.

**Priority:** specs before features.

## Key skills

| Skill | Purpose |
|-------|---------|
| **specloom-orchestrator-session** | Independence + work queue + git bookends + approval mode |
| **specloom-approval-mode** | `/manual` `/auto` `/approve` for implement/validator/tester |
| **specloom-implement-protocol** | Handoff JSON schemas |
| **specloom-work-creator-*** | Planning docs |
| **code-*** / **test-*** | Universal coding vs testing standards (separate flows) |

## Output contract

Five peer orchestrators → natural language. All other `specloom-*` → JSON only.

**code-*** → specloom-implement domain developers only. **test-*** → specloom-tester only. Never cross-load.

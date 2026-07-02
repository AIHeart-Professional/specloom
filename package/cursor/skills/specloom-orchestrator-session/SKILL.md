---
name: specloom-orchestrator-session
description: >-
  INTERNAL — specloom-work-creator, specloom-implement, specloom-validator, specloom-tester, specloom-git.
  Work discovery, queue priority, no-work exits, git bookends. Not user-invokable.
disable-model-invocation: true
---

# Orchestrator Session Protocol

## Five independent peer orchestrators

| Agent | User entry | Scope |
|-------|------------|-------|
| **specloom-work-creator** | `@specloom-work-creator` | Planning docs only |
| **specloom-implement** | `@specloom-implement` | Implementation via **specloom-worker** only |
| **specloom-validator** | `@specloom-validator` | Quality via **specloom-standardized-loop** only |
| **specloom-tester** | `@specloom-tester` | Tests via **specloom-test-loop** only |
| **specloom-git** | `@specloom-git` | Git branch / push / merge only |

## Independence rule (mandatory)

**Peer orchestrators must NEVER Task-delegate another peer orchestrator.**

```
FORBIDDEN: work-creator → implement | validator | tester | git
FORBIDDEN: implement → work-creator | validator | tester | git
FORBIDDEN: validator → work-creator | implement | tester | git
FORBIDDEN: tester → work-creator | implement | validator | git
```

User runs each orchestrator **separately** in pipeline order.

### Allowed sub-agents (not peers)

| Parent | May delegate |
|--------|----------------|
| **specloom-work-creator** | *(none — reads skills, edits docs directly)* |
| **specloom-implement** | **specloom-worker**, **specloom-update-knowledgebase** (`task_sync` only) |
| **specloom-worker** | domain developers, **specloom-worker-validation** |
| **specloom-validator** | **specloom-standardized-loop** |
| **specloom-standardized-loop** | domain validators |
| **specloom-tester** | **specloom-test-loop**, **specloom-update-knowledgebase** (`finalize_work_records` only) |
| **specloom-test-loop** | test-standards agents |
| **specloom-git** | *(none — runs git commands directly)* |

**specloom-system-advisor** — any peer may delegate for help questions only.

---

## Recommended user pipeline (manual chaining)

```
@specloom-work-creator   → planning + sign-off
@specloom-git            → task_start (or git runs inside each orchestrator session)
@specloom-implement      → worker loop (≤10) + worker-validation
@specloom-validator      → standardized loop (≤3)
@specloom-tester         → test loop (≤5)
@specloom-git            → merge (or merge at end of each orchestrator session)
```

Each step is a **separate invocation**. No orchestrator auto-chains the next.

---

## Session contract (every peer orchestrator)

```
1. Work discovery → no_work? → "No work available" & STOP (no git)
2. Git start — run **specloom-git-workflow** `task_start` (shell on ai-workflow)
3. Do this agent's scope only on branch
4. Git end — `task_push` + `merge_to_ai_workflow` per **specloom-git-workflow**
5. Reply to user (only after merge attempt)
```

**specloom-git** orchestrator: steps 2–4 are the entire session (git-only).

Orchestrators run git **themselves** via skill + shell — they do **not** invoke `@specloom-git` agent.

---

## Work discovery

Load **specloom-work-creator-docs-planning** for queue paths.

### Blocked → `no_work`

- `blocked_work.json` hit
- Spec/feature `Status: Blocked`
- `pendingSignOff` unresolved
- `stopReason: needs_user`

### Priority: specs before features

No feature planning while open spec work exists (unless user names a feature).

### Per-agent `no_work`

| Agent | `no_work` when |
|-------|----------------|
| **work-creator** | No planning queue work; blocked; awaiting sign-off |
| **implement** | No Ready/In Progress tasks; all tasks already Complete |
| **validator** | Nothing to validate for chosen mode; preconditions fail |
| **tester** | Tasks incomplete; validator not passed; `tests_passed` |
| **git** | No git action requested and no branch context in user message |

---

## Iteration caps (own agent only)

| Agent | Cap | Sub-loop |
|-------|-----|----------|
| **implement** | via worker | **10** |
| **validator** | via standardized-loop | **3** |
| **tester** | via test-loop | **5** |
| **work-creator** | — | no loop |
| **git** | — | no loop |

**Do not** list other agents' caps in an orchestrator's agent file.

---

## No work response

```markdown
## No work available

Nothing for **specloom-implement** right now.

**Reason:** [specific]

**Next:** [suggest which peer orchestrator to run next]
```

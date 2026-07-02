# SpecLoom — Four-Agent Workflow

Every orchestrator shares **specloom-orchestrator-session**: work discovery → git start → work → git merge → reply.

**No work** → `no work available` immediately. **No git** on no_work.

**Priority:** specs always before features.

---

## Universal session contract

```mermaid
flowchart LR
  START[Agent invoked] --> SCAN{Work available?}
  SCAN -->|no| NOWORK[No work available → user]
  SCAN -->|yes| GIT1[specloom-git task_start]
  GIT1 --> WORK[Pipeline work on branch]
  WORK --> GIT2[specloom-git push + merge]
  GIT2 --> REPLY[Reply to user]
```

| Step | Rule |
|------|------|
| 0 | Scan queues + `blocked_work.json` + blocked status |
| 1 | `no_work` → stop, no git |
| 2 | `specloom-git task_start` off `ai-workflow` |
| 3 | All work on `git_task_branch` |
| 4 | `task_push` + `merge_to_ai_workflow` **before** user reply |
| Delegated | Sub-agents use parent branch; parent owns merge |

---

## Work priority (global)

```
Specs (Pending / In Progress with open tasks)
  → only when none: Features (Ready, spec queue)
    → only when none: Ideas (user-requested)
```

**Blocked** spec, feature, or `blocked_work.json` entry → **no work** for that item.

---

## 1. specloom-work-creator

**Entry:** `@specloom-work-creator`

```mermaid
flowchart TB
  WC[specloom-work-creator]
  WC --> SCAN1{Planning work?}
  SCAN1 -->|no| N1[No work available]
  SCAN1 -->|yes| G1[git task_start]
  G1 --> PLAN[create/revise idea · feature · spec]
  PLAN --> VALD[specloom-validator draft]
  VALD --> SIGN[sign-off if pass]
  G2[git merge] --> DONE1[Reply]
  SIGN --> G2
```

| No work when |
|--------------|
| No Ready features with spec queue rows |
| Spec work exists (spec-over-feature) |
| Blocked feature/spec |
| Awaiting sign-off |

**Git:** start + merge every session.

---

## 2. specloom-implement

**Entry:** `@specloom-implement`

```mermaid
flowchart TB
  IMP[specloom-implement]
  IMP --> SCAN2{Ready tasks?}
  SCAN2 -->|no| N2[No work available]
  SCAN2 -->|yes| G3[git task_start]
  G3 --> WRK[specloom-worker ×10]
  WRK --> WV[worker-validation]
  WV --> VAL[specloom-validator impl]
  VAL --> TST[specloom-tester]
  TST --> KB[update-knowledgebase]
  G4[git merge] --> DONE2[Reply]
  KB --> G4
```

| No work when |
|--------------|
| No Ready/In Progress tasks |
| Spec blocked |
| `blocked_work.json` |

**Git:** one branch for full pipeline; validator/tester use same branch (`session_owner: false`).

---

## 3. specloom-validator

**Entry:** direct invoke OR delegated by work-creator / implement

```mermaid
flowchart TB
  VAL[specloom-validator]
  VAL --> SCAN3{Validation pending?}
  SCAN3 -->|no| N3[no_work]
  SCAN3 -->|yes| OWN{session_owner?}
  OWN -->|yes| G5[git start]
  OWN -->|no| BR[use parent branch]
  G5 --> VWORK[validate]
  BR --> VWORK
  VWORK --> OWN2{session_owner?}
  OWN2 -->|yes| G6[git merge]
  OWN2 -->|no| RET[JSON to parent]
  G6 --> RET
```

| Priority | Mode |
|----------|------|
| 1 | Implementation validation |
| 2 | Draft validation (only if no impl work) |

| No work when |
|--------------|
| Draft: nothing to validate |
| Impl: tasks incomplete / worker-validation not passed |
| Blocked |

---

## 4. specloom-tester

**Entry:** direct invoke OR delegated by implement

```mermaid
flowchart TB
  TST[specloom-tester]
  TST --> SCAN4{Tests needed?}
  SCAN4 -->|no| N4[no_work]
  SCAN4 -->|yes| OWN3{session_owner?}
  OWN3 -->|yes| G7[git start]
  OWN3 -->|no| BR2[parent branch]
  G7 --> TLOOP[test-loop ×5]
  BR2 --> TLOOP
  TLOOP --> OWN4{session_owner?}
  OWN4 -->|yes| G8[git merge]
  OWN4 -->|no| RET2[JSON to parent]
  G8 --> RET2
```

| No work when |
|--------------|
| Tasks incomplete |
| Validator not passed |
| `tests_passed` |
| Blocked |

---

## specloom-git (sub-agent)

Called at **start** and **end** of every `session_owner: true` session.

| Phase | Action |
|-------|--------|
| Start | `task_start` → new branch off `ai-workflow` |
| End | `task_push` → `merge_to_ai_workflow` |

Never parallel. Merge failure → report blocked, not success.

---

## Full lifecycle (typical)

```
@specloom-work-creator
  git → spec draft → validate → sign-off → promote → git merge

@specloom-implement
  git → implement → validate → test → knowledgebase → git merge
```

Validator/tester may also run standalone with own git bookends.

---

## JSON status values

| status | Meaning |
|--------|---------|
| `no_work` | Nothing to do — no git ran |
| `complete` | Work done + merged (if session_owner) |
| `fail` | Work failed; merge attempted per policy |
| `blocked` | Git merge/push failed or rule of 3 |

---
name: specloom-contract
description: >
  INTERNAL — all v2 agents. SoT, hierarchy, thresholds, forbidden matrix.
  Not user-invokable.
disable-model-invocation: true
---

# SpecLoom v2 contract

## Hierarchy

```
Product Linear Team  (not Specloom meta-team)
  └─ Overview (Project + Document)
       └─ Phase (Project + Document)
            └─ Brief (Issue KEY-n) + Queue fields
```

Planning SoT = **Linear**. Docs repo = browseable mirror only.

## User entry

**`@specloom`** — Main Orchestrator (handoff + NLP only)  
**`@specloom-document`** — optional direct docs entry  

Internals (never user entry for execution):  
`project-manager` · `loop` · `implementation` · `security` · `tester` · `repository`

## Git

```
specloom/<brief-1> … specloom/<brief-N>  (stacked PRs)
  → Repository merge_stack → ai-workflow → main (release)
```

Run_set = ordered Briefs; sequential gates; stack merge when batch done.

## Thresholds

| Gate | Pass |
|------|------|
| confidence | ≥ 0.99 |
| ux_confidence (visual) | ≥ 0.99 |
| coverage | ≥ 0.99 (language ignore directives OK) |
| security | zero High/Critical |
| Loop retries | ≤ 5 then FAILED → user |

## Hard splits

| Agent | May | Must not |
|-------|-----|----------|
| Orchestrator | Task agents; NLP to user | Code, Linear, git, queue resolve, retries |
| Project Manager | All Linear; Task Spec | Call Loop / workers |
| Loop | Impl → Security → Tester; retries | User NLP; Linear Done; merge trunk |
| Document | Docs repo + type skills | App features |
| Repository | App remotes; merge to `ai-workflow` | Invent docs content |

## Forbidden (global)

- Auto-run next Brief after Done  
- Specloom meta-team for product Briefs  
- Peer-chaining workers  
- Freestyle langs without `code-*` / `test-*`  
- Docs as planning SoT  

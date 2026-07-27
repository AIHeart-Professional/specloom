---
name: specloom-queue
description: >
  INTERNAL — brief/build/test/validate. Brief dependency order, Linear status mapping,
  auto-advance next work. Not user-invokable.
disable-model-invocation: true
---

# Work queue

## Goal

All work Briefs exist with **explicit order**. Peers always know **next** item. No “which of many?” stall when queue is clear.

## Brief body fields (required)

In every work Brief (after Goal or in frontmatter block):

```markdown
## Queue
queue_order: 10
depends_on: []          # e.g. [SPE-5, SPE-6]
blocks: []              # open question ids if any
```

- `queue_order`: integer, lower = earlier (10, 20, 30…)  
- `depends_on`: must be **Done** before this Brief can be Ready  
- Planner/brief sets order from architecture (scaffold → data → API → UI → polish)

## Ordering algorithm

1. List Phase Briefs (label `brief`)  
2. Topological sort by `depends_on` (fail if cycle → fix before Ready)  
3. Break ties with `queue_order`, then Issue id  
4. **Runnable** = deps all Done AND `blocks` empty AND body complete  

## How many Ready?

- **Default:** at most **one** Ready (or Building/Testing/Validating) per product — the queue head  
- All other runnable Briefs stay **Backlog** / Todo until promoted  
- Multiples Ready only if user says `parallel N` — then pick N lowest queue_order  

## Linear status mapping (no custom states required)

Prefer SpecLoom named states if team has them. **Else fallback:**

| SpecLoom stage | Linear state (typical) | Required label |
|----------------|------------------------|----------------|
| Backlog | Backlog / Todo | `specloom:backlog` (optional) |
| Ready | Todo / Backlog / Triage | **`specloom:ready`** |
| Building | In Progress | **`specloom:building`** |
| Testing | In Progress | **`specloom:testing`** |
| Validating | In Progress | **`specloom:validating`** |
| Done | Done / Completed | remove stage labels |

**Never block the pipeline** because MCP cannot create workflow states. Create/use labels instead. Comment once if custom states missing.

Resolve stage = label if present, else infer from state type (unstarted→Ready candidate, started→Building, completed→Done).

## Promote next

After a Brief → Done:

1. Recompute runnable set  
2. Set previous head labels cleared  
3. Lowest runnable → add `specloom:ready`, state Todo/unstarted  
4. Return `next_brief_key` for auto-start  

## Auto-start (allowed Tasks)

| From | May Task | When |
|------|----------|------|
| **specloom-brief** | **specloom-run** | Plan done; queue head Ready |
| **specloom-run** | build / validate / test / document | Internal only — see specloom-run-protocol |

Default: brief→**run** (one SPE). Run does **not** auto-start the next SPE after Done.  
User may say `manual` to skip Task from brief.


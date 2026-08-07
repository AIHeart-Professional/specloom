---
name: specloom-queue
description: >
  INTERNAL — Project Manager and the run-set workflow. Brief dependency order,
  tracker-independent stage mapping, auto-advance next work. Not user-invokable.
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
depends_on: []          # e.g. [BUD-5, BUD-6]
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

## Stage mapping

Stages are tracker-independent. The adapter (**specloom-tracker**) maps them.

| SpecLoom stage | Label | Linear | GitHub |
|----------------|-------|--------|--------|
| Backlog | `specloom:backlog` | Backlog / Todo | open |
| Ready | **`specloom:ready`** | Todo / Triage | open |
| Building | **`specloom:building`** | In Progress | open |
| Testing | **`specloom:testing`** | In Progress | open |
| Validating | **`specloom:validating`** | In Progress | open |
| Done | no stage label | Done | closed as `completed` |

**The label is the stage of record on both trackers.** Linear may additionally carry a native
workflow state; GitHub has none. Reading the label rather than the state is what lets one queue
algorithm serve both.

Never block the pipeline because a tracker cannot create a workflow state. Comment once and carry on with labels.

Exactly one `specloom:` stage label at a time. Remove the old one in the same edit as the add.


## Promote next

After a Brief → Done:

1. Recompute runnable set  
2. Set previous head labels cleared  
3. Lowest runnable → add `specloom:ready`, state Todo/unstarted  
4. Return `next_brief_key` for auto-start  

## Who starts work

Nothing in this skill starts execution.

| Agent | On queue change |
|-------|-----------------|
| **specloom-project-manager** | recompute runnable, promote the head, return `next_brief_key` |
| the main thread | decides whether to launch the `specloom-run-set` workflow with a `run_set` |
| the run-set workflow | reads the queue to confirm a Brief, never to select new work |

PM must **never** start execution. That rule lives in **specloom-contract** and this skill does not override it.


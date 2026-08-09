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
blocks: []              # DERIVED — inverse of depends_on; do not hand-author
```

- `queue_order`: integer, lower = earlier (10, 20, 30…)  
- `depends_on`: must be **Done** before this Brief can be Ready  
- `blocks`: **not authored** — see *Derived field: `blocks`* below  
- Planner/brief sets order from architecture (scaffold → data → API → UI → polish)

## Derived field: `blocks`

`blocks` is never hand-authored. It is the **inverse of `depends_on`**, recomputed from the graph:

```
blocks(B) = { X : B ∈ depends_on(X) }
```

B blocks exactly the Briefs that name B in their own `depends_on`. Recompute it for **every
affected Brief** whenever any `depends_on` changes — at plan time, on a Brief edit, and on any
re-plan. A hand-edited `blocks` is overwritten on the next recompute; the field is a rendering of
the dependency graph, not an input to it.

Only the **body `blocks:` field** needs recomputing. On a tracker with native relations, writing
`depends_on` → `blocked-by` already creates the inverse `blocking` edge automatically (see the
adapter), so native relations stay correct without a second write.

## Ordering algorithm

1. List Phase Briefs (label `brief`)  
2. Topological sort by `depends_on` (fail if cycle → fix before Ready)  
3. Break ties with `queue_order`, then Issue id  
4. **Runnable** = deps all Done AND no unresolved Open Questions AND body complete  

Note: `blocks` is **not** a readiness gate — it is the derived inverse of `depends_on` (the
Briefs this one unblocks). Readiness is gated by `depends_on`; unresolved Open Questions are
tracked separately (Phase Completion criteria), not in the `blocks` field.

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


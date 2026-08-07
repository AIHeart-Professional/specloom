---
name: document-proposal
description: >
  INTERNAL — specloom-document. Feature proposal documents and the proposal index,
  including rejected ones. Not user-invokable.
disable-model-invocation: true
---

# Proposal documents

```
proposals/
├── README.md                    the index — including rejected
└── NNNN-kebab-title.md          one proposal per file
```

## Per file

Written from the `DISCOVERY_RESULT` payload, not from memory.

```markdown
# P-0012. <title>

Date: YYYY-MM-DD
Status: proposed | accepted | parked | rejected
Cost shape: small | medium | large
Touches: frontend, backend

## Problem
In the user's terms. No solution here.

## Evidence
| claim | source | kind | as of |
|-------|--------|------|-------|

## Proposal
What to build, at the level a Brief could be written from it.

## Benefit
**Who:** 
**Observable:** what is true afterwards that is not true now, checkably.

## Unknowns
- what would change the answer

## Alternatives
| option | why not |

## Outcome
Filled in when the user decides. If rejected, **why** — that reason is the value.
```

## The index earns its keep on rejection

```markdown
| id | title | status | cost | decided | why |
|----|-------|--------|------|---------|-----|
| P-0012 | Offline queue | accepted | medium | 2026-08-02 | → BUD-31 |
| P-0011 | Plugin API | rejected | large | 2026-07-28 | see ADR 0006 |
| P-0009 | Bulk import | parked | small | 2026-07-20 | after BUD-22 |
```

**Rejected proposals stay listed forever, with the reason.** That row is what stops the next
discovery run re-proposing it — and it is the only durable record of a decision that produced no
code. Never prune the index.

## Rules

- Status changes only on the user's decision. `specloom-discovery` writes `proposed`; nothing
  else moves it
- On accept, record the Brief key it became. The trail from proposal to shipped work is the
  thing you will want a year later
- Never edit `Problem` or `Evidence` after a decision — the record is what was argued at the
  time, not a tidied version
- A proposal that became a Brief is not deleted. It is the *why*; the Brief is the *what*

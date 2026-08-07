---
name: specloom-discovery-scan
description: >
  INTERNAL — specloom-discovery. Build the picture of what the product is for and what already
  exists, before proposing anything. Not user-invokable.
disable-model-invocation: true
---

# Scan

Runs first, always. Everything after it depends on knowing what is already here.

## Read, in this order

| Source | Question it answers |
|--------|--------------------|
| Overview | what is this product for, and for whom |
| Phases | how the work was carved up, and what is deliberately later |
| Briefs **done** | what exists — the real capability surface |
| Briefs **open** | what is already planned; the dedupe set |
| `docs/proposals/` | what was proposed before, accepted or rejected, and why |
| `docs/decisions/` | what was decided against, and on what grounds |
| the code on `ai-workflow` | what exists that the Briefs never described |
| `README` / `system/` | what the product claims to do publicly |

Read the Overview **first and completely**. A proposal that does not serve the stated goal is
noise regardless of how good the idea is.

## `docs/decisions/` is the most important one

An ADR that says "we will not do X, because Y" is a rejection with reasoning attached.
Re-proposing X without addressing Y is the single most annoying thing this agent can do. If a
proposal contradicts an ADR, it must name that ADR and say what changed.

## Finding gaps

Four kinds, in rough order of how often they are worth acting on:

| Gap | Look for |
|-----|----------|
| **Stated but unbuilt** | an Overview goal with no Phase, no Brief and no code behind it |
| **Half-built** | a capability that works for one case and silently fails others — one layer done, the rest assumed |
| **Implied by what exists** | users can now do A and B; the obvious C nobody wrote down |
| **Load-bearing and undefended** | something everything depends on with no tests, no fallback, one owner |

The second and fourth are the ones a human rarely raises, because from the inside a half-built
thing feels finished and a fragile dependency feels stable until it isn't.

## Dedupe surface

Build this before proposing anything:

```yaml
already:
  open:     ["BUD-14 offline sync", "BUD-19 export"]
  done:     ["BUD-03 auth", "BUD-07 budget list"]
  rejected: ["P-004 plugin API — see ADR 0006"]
  decided:  ["ADR 0006: no third-party plugins before 1.0"]
```

A proposal matching anything here is dropped, or reframed as an explicit extension of that item
with the difference stated.

## What not to count as a gap

- Anything in a Phase marked as later — that is sequencing, not an omission
- Missing tests on a Brief still in flight — gate 3 has it
- A capability a `docs/decisions/` record rejected, unless the reasoning has expired
- Your own preference about how something should have been built — that is a finding for gate 2,
  not a feature proposal

## Output

```yaml
scan:
  goal: one sentence, from the Overview, in its words not yours
  capabilities: []        # what exists, from done Briefs + code
  planned: []             # open Briefs
  gaps: [{ kind, description, evidence: [source] }]
  already: { open, done, rejected, decided }
```

A gap with no `evidence` source is not a gap, it is a hunch. Drop it.

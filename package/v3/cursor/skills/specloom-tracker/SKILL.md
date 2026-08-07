---
name: specloom-tracker
description: >
  INTERNAL — specloom-project-manager and specloom-loop. Which tracker this product uses,
  the operations every adapter must provide, and the one-tracker invariant. Not user-invokable.
disable-model-invocation: true
---

# Tracker

SpecLoom keeps its plan in an issue tracker. Which one is a **per-product choice made once, at
bootstrap**, and recorded on the Overview.

| `tracker` | Adapter |
|-----------|---------|
| `linear` | **specloom-tracker-linear** |
| `github` | **specloom-tracker-github** |

## The invariant

**One product, one tracker. Always.**

Not two at once, not a fallback when the first is full, not "Linear for Phases and GitHub for
Briefs". The whole design rests on a single ordered queue that one agent writes. Two trackers
means `depends_on` cannot be resolved across the split, the topological sort silently drops
edges, and "one Ready head" becomes unenforceable because neither side can see the other.

If a tracker fills up or you want to change, that is a deliberate migration a human runs — not
something an agent decides mid-Brief.

## Choosing

Asked once, during **specloom-brief-bootstrap**, before any Phase or Brief exists:

```
Which tracker for this product?
  linear — richer hierarchy and relations; free plan caps at 250 issues and 2 teams
  github — no issue cap, lives beside the code, needs gh CLI 2.94+
```

Record on the Overview and never infer it again:

```yaml
tracker: github
tracker_ref: acme/budget-tracker      # linear → team key; github → owner/repo
```

Every later call reads `tracker` from the Overview. An agent that cannot determine the tracker
stops and asks — it does not guess, and it does not default.

## Operations an adapter must provide

Both adapters expose the same verbs. Callers use these names and never tracker-specific ones.

| Operation | Returns |
|-----------|---------|
| `resolve_product` | tracker id for this product; fail if absent |
| `create_overview` | overview ref |
| `create_phase(title, overview)` | phase ref |
| `create_brief(title, body, phase)` | brief key + url |
| `read_brief(key)` | title, body, stage, dependencies |
| `list_briefs(phase?)` | briefs with stage and queue fields |
| `set_stage(key, stage)` | ok — `backlog\|ready\|building\|testing\|validating\|done` |
| `set_dependencies(key, depends_on[])` | ok |
| `comment(key, text)` | ok |
| `close(key, outcome)` | ok — `completed \| not_planned` |

Anything an adapter cannot do natively it emulates and **says so in its result**, so a
capability gap never looks like a success.

## Brief key

Callers need one stable string for branch names and payloads.

| Tracker | Native | `brief_key` |
|---------|--------|-------------|
| linear | `BUD-11` | `BUD-11` |
| github | `acme/budget-tracker#11` | `GH-11` |

Branches are always `specloom/<brief_key>`, so `specloom/BUD-11` or `specloom/GH-11`. The adapter
maps back to the native reference; nothing outside the adapter handles a native id.

## Queue fields

Independent of tracker. They live in the **Brief body**, not in tracker custom fields:

```markdown
## Queue
queue_order: 10
depends_on: []
blocks: []
```

This is why the tracker is swappable at all. Do not move these into tracker-native fields for
one adapter's convenience — the body is the portable contract, and an adapter may *additionally*
mirror them into native relations where it has them.

## Unavailable

Same rule for either tracker, from **specloom-resolve-work**: resolving and planning halt;
in-flight Briefs and merges proceed; Done transitions defer to `.specloom/pending-tracker.json`
and drain on reconnect. Never lose completed work to an unreachable tracker.

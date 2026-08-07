---
name: document-adr
description: >
  INTERNAL — specloom-document. Architecture Decision Records.
disable-model-invocation: true
---


# ADRs

One decision per file, immutable once accepted.

```
decisions/NNNN-kebab-title.md
```

## Template

```markdown
# NNNN. <decision, as a statement>

Date: YYYY-MM-DD
Status: proposed | accepted | superseded by NNNN

## Context
The forces. What made a decision necessary. No solution yet.

## Decision
What we will do, active voice: "We will ...".

## Alternatives
Each option genuinely considered, and why it lost.

## Consequences
What becomes easier. What becomes harder. What we accept.
```

## Rules

- **Never edit an accepted ADR.** Supersede it with a new one and update the old Status. The
  record of what was believed then is the value
- Alternatives are mandatory. An ADR with one option is a note, not a decision
- Consequences must include a cost. A decision with no downside was not a decision
- Number sequentially, never reuse

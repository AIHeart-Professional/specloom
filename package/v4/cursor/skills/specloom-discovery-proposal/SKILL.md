---
name: specloom-discovery-proposal
description: >
  INTERNAL — specloom-discovery. The proposal shape, the no-score rule, and what gets rejected
  before it reaches the user. Not user-invokable.
disable-model-invocation: true
---

# Proposals

## Shape

```yaml
- id: P-012
  title: short, what it is
  problem: >
    the problem in the user's terms, not the solution. If you cannot state a problem
    without naming your solution, you have a solution looking for a problem.
  evidence:
    - claim: ""
      source: ""          # url, file path, Brief key, ADR number
      kind: codebase | primary | measured | practice | opinion
      as_of: "2026-08"    # when the source is time-sensitive
  proposal: >
    what to build, at the level a Brief could be written from it. Not an implementation.
  benefit:
    who: ""               # which user, in their words
    observable: >
      what is true afterwards that is not true now, phrased so you could check it
  unknowns:
    - ""                  # what would change the answer
  cost_shape: small | medium | large
  touches: [frontend, backend, database]
  depends_on: []          # existing Briefs or capabilities
  alternatives: 
    - option: ""
      why_not: ""
  recommendation: propose | park
  parked_because: ""      # required when parked
```

## No scores

There is no RICE, no ICE, no impact rating, no priority number, no confidence percentage.

Those multiply guesses together and present the product as measurement. Reach × Impact ×
Confidence ÷ Effort is four estimates and one division; the output has the authority of
arithmetic and the content of a hunch. This system removed `confidence: 0.99` from its gates for
the same reason, and it is not coming back through the product door.

`cost_shape` is a **t-shirt size, deliberately coarse** — small is inside one Brief, medium is a
few, large needs its own Phase. It is a shape, not a number, and it is not multiplied by
anything.

## The observable is the whole benefit claim

Weak, and rejected:

> "Improves developer experience"
> "Makes the app faster"
> "Users will find this valuable"

Strong, and accepted:

> "A Brief that fails gate 2 names the failing gate in the first line of the report, instead of
> the operator reading four attempts of findings to work out which one was stuck"
> "Cold start drops below the 2 s the Overview sets as the target; it is currently 5.1 s measured
> on the ai-workflow build"

The test: **could someone check whether it came true?** If not, it is a feeling, and it goes in
`unknowns` or the proposal does not ship.

## Rejection rules — apply before returning

| Condition | Action |
|-----------|--------|
| An evidence claim with no `source` | drop the claim; if nothing survives, drop the proposal |
| `benefit.observable` not checkable | **reject the proposal** |
| No `unknowns` listed | **reject** — a proposal with no unknowns is under-examined, not certain |
| Duplicates an open or done Brief | drop, unless framed as an extension with the difference named |
| Contradicts a `docs/decisions/` record | drop, unless it names the ADR and says what changed |
| Rests only on `opinion` sources | allowed, but the thinness must appear in `unknowns` |
| Contains a score of any kind | strip the score; if it was the only justification, reject |

Dropping is silent and mandatory. Report the count of dropped proposals in the result so a very
selective run is legible rather than looking lazy.

## How many

**Three to five proposals is a good run. Zero is a valid run.**

More than about six means the filter is not being applied — the marginal proposal is there
because it was generated, not because it was worth the reader's attention. Rank by how much the
evidence actually supports them and cut the tail.

## Parked

A proposal that is real but not now. Parking is not rejection, and the reason matters:

```yaml
recommendation: park
parked_because: "depends on BUD-22 which is not started"
```

Parked proposals stay in the document. Next run reads them and does not re-derive them from
scratch — that is how this agent stops repeating itself across sessions.

## What happens next

The proposal document is written by **specloom-document** via `document-proposal`. The user
reads it and accepts, parks or rejects each one.

**Only then** does PM turn accepted proposals into Briefs. This agent never writes to the
tracker and never assumes acceptance. A proposal is an argument, not a decision.

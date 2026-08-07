---
name: specloom-ui-layout
description: >
  INTERNAL — specloom-implementation. Building UI from Image Files and visual criteria.
  Load only for visual Briefs. Not user-invokable.
disable-model-invocation: true
---

# Building to a reference

Load when the Brief has `visual: true` or lists Image Files.

## Order of authority

1. **Written visual criteria** — the contract
2. **Image Files** — evidence for the criteria
3. **Existing components** — how this codebase already expresses it
4. Your judgement — last, and only for what none of the above settles

Where the mockup and a criterion disagree, the criterion wins and the discrepancy is a `minor`
finding. Do not quietly follow the picture.

## Before writing

Read every Image File the Brief lists. A visual Brief implemented without opening its references
is a `critical` finding against yourself.

Extract, in order: layout structure, spacing rhythm, type scale, colour roles, component states,
and what is deliberately absent.

## Reuse before creation

Search for an existing component that already renders this pattern. A second nearly-identical
card component is a `major` finding — a design system that drifts is worse than one that bends.

Use the codebase's existing tokens. A hard-coded hex or pixel value where a token exists is a
`major` finding, and its `source` is the token file.

## States

A screen is not done at its default state. Implement, and be ready for the Tester to check:
loading, empty, error, and the interactive states of every control. Missing states are the
commonest visual-gate failure.

## Responsive

Where the Brief names breakpoints, implement each. Where it does not, do not invent them —
build the reference viewport and raise an open question.

## Accessibility

Not optional, and not the Tester's job to add afterwards: every control reachable by keyboard,
a visible focus style, an accessible name on every icon-only control, and text contrast at least
4.5:1. Failures here are `major`, sourced to the repo's accessibility doc when one exists and to
WCAG 2.1 AA when it does not.

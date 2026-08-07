---
name: specloom-visual-diff
description: >
  INTERNAL — specloom-tester. Per-criterion visual checking against Image Files.
  Replaces ux_confidence. Not user-invokable.
disable-model-invocation: true
---

# Visual checking

`ux_confidence ≥ 0.99` is retired. A single number could not say **which** screen was wrong,
and averaging four criteria let one clear failure hide behind three passes.

## Unit of judgement

One **criterion**, one **Image File**, one verdict.

```yaml
visual_results:
  - criterion: "tab bar shows five items; the active item is tinted"
    image: ux/refs/home.webp
    result: pass | fail
    note: "shows four items; Settings missing"    # required when fail
```

Every visual criterion in the Brief must appear exactly once. A criterion with no result is a
`critical` finding against yourself.

## Method

1. Render the built UI at the same viewport as the reference
2. Capture a screenshot per screen named in the criteria
3. Compare **against the written criterion**, not against the image overall

Point 3 is the whole discipline. The criterion is the contract; the mockup is evidence for it.
A screenshot differing from the mockup in a way no criterion mentions is at most `minor`.

## What counts as a failure

| Difference | Verdict |
|------------|---------|
| A named element absent, or present when the criterion excludes it | fail |
| Count wrong where the criterion states a count | fail |
| Hierarchy or order contradicting the criterion | fail |
| Colour, spacing or type differing beyond a stated tolerance | fail |
| Anti-aliasing, font hinting, platform chrome, scrollbars | not a failure |
| A difference the criteria never mention | `minor` finding, not a fail |

## Tolerances

When the Brief states none, use: colour ΔE ≤ 3, spacing ±4 px or ±2 %, font size ±1 px. State
the tolerance you applied in `note` so a rerun is comparable.

## Findings

A failed criterion becomes a `major` finding with `owner: build`:

```yaml
- severity: major
  gate: tester
  owner: build
  file: src/screens/Home.tsx
  issue: tab bar renders four items, criterion requires five
  rule: "tab bar shows five items; the active item is tinted"
  source: ux/refs/home.webp
  remediation: add the Settings tab between Profile and Help
```

`file` is the component that renders it, not the image — findings must point where the fix goes.

## Missing references

No Image File for a stated visual criterion → `critical` finding against the Brief, owner
`build`, routed to UX ensure. Never invent a reference to compare against, and never pass a
visual criterion you could not check.

---
name: specloom-discovery-research
description: >
  INTERNAL — specloom-discovery. Outside research into how comparable tools solve a gap,
  what sources count as evidence, and when to stop. Not user-invokable.
disable-model-invocation: true
---

# Outside research

Runs **after** the scan, and only for gaps the repo cannot answer on its own. Research first and
you will propose things you already shipped.

## What it is for

Two questions, and only these two:

1. **How do comparable tools solve this gap?** — approaches worth borrowing, and their costs
2. **Does this already exist well enough to adopt instead of build?** — the cheapest proposal is
   often "use the thing that exists"

Not for: general market research, feature lists scraped from competitors, or "what is trending".
A feature that a competitor has is not evidence that you need it.

## Source quality

Evidence carries a `kind`, and they are not interchangeable:

| kind | Example | Weight |
|------|---------|--------|
| `primary` | official docs, a spec, the source of the tool itself, a changelog | strongest |
| `measured` | a benchmark with published method, an issue thread with reproduction | strong |
| `practice` | how several established projects actually do it | moderate |
| `opinion` | a blog post arguing for an approach | **weak — never load-bearing** |

A proposal resting only on `opinion` sources is not researched, it is persuaded. Say so in
`unknowns` rather than presenting it as settled.

Prefer primary sources over articles about them. An article summarising a spec can be wrong
about the spec, and you have no way to tell from inside the article.

## Recency

State the date of anything time-sensitive. Tooling, APIs and limits move. A 2023 comparison of
two libraries may describe neither as it is now.

If a claim depends on a version, name the version.

## Cost of adopting

When research turns up an existing solution, the proposal must carry its real shape, not just
its existence:

- what it adds as a dependency, and that project's health
- its licence, and whether that fits
- what it forces on the design that you would not otherwise choose
- what happens if it is abandoned

"There is a library for this" is a starting point. "There is a library, MIT, active, and it
assumes a Postgres backend we do not have" is a finding.

## When to stop

Stop when one more search would not change the recommendation.

Concretely: stop after the third source that says the same thing, or when the remaining unknowns
are about **your** context rather than the outside world — those cannot be researched, only
tried, and they belong in `unknowns`.

Do not research every gap. Research the ones where the answer would change what you propose.

## Recording

Every research-backed claim carries its source in the proposal:

```yaml
evidence:
  - claim: "SQLite WAL mode allows concurrent readers during a write"
    source: "https://sqlite.org/wal.html"
    kind: primary
    as_of: "2026-08"
```

An unsourced claim is dropped by **specloom-discovery-proposal**, exactly like an unsourced
finding is dropped by a gate.

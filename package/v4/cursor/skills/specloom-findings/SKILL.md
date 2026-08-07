---
name: specloom-findings
description: >
  INTERNAL — gate agents (implementation, tester) and the run-set workflow.
  The finding shape, validity rules and the pass rule that replaced confidence scores.
  Load before returning any gate result. Not user-invokable.
disable-model-invocation: true
---

# Findings

v3 has **no numeric quality scores**. A gate passes or fails on findings.

v2 asked agents to emit `confidence_score`, `code_confidence` and `ux_confidence`, each
passing at `≥ 0.99`. The contract stated the threshold, so an agent that had just done the
work and then read the threshold emitted `0.99` nearly every time. That is not a stop
condition — it is the loop grading its own homework.

## Shape

```yaml
findings:
  - severity: critical | major | minor
    gate: implementation | tester | quality
    owner: build | test                 # routes the retry
    verdict: confirmed | plausible      # quality gate only — see specloom-quality-gate
    file: src/auth/filter.ts            # required
    line: 42                            # optional
    issue: one sentence, what is wrong
    rule: the rule being violated
    source: docs/code/typescript/CORE.md#naming   # required
    remediation: the concrete fix
```

## Validity — enforce before returning

| Rule | Action |
|------|--------|
| No `file` | **drop the finding** |
| No `source` | **drop the finding** |
| `source` path does not resolve in the repo or standards root | **drop the finding** |
| No `owner` | default by gate: implementation→build, tester→test, quality→build |

Dropping is silent and mandatory. A finding you cannot anchor to a file and a written rule
is an opinion, and opinions do not block a merge.

This cuts both ways: it stops a gate inventing objections, and it forces a real objection to
name the document it comes from. If a rule matters and no document states it, write the
document — do not smuggle it in as a finding.

## Severity

| Severity | Use when | Blocks |
|----------|----------|--------|
| `critical` | a Brief acceptance criterion is unmet, a `docs/decisions/` record is contradicted, or a security rule is broken | yes |
| `major` | a documented standard is violated in a way that needs rework | yes |
| `minor` | style, naming, an uncovered file, a non-blocking inconsistency | no — recorded only |

## Pass rule

```
gate passes  =  zero critical  AND  zero major
```

Applies identically to Implementation and Tester. Nothing else is a pass condition.

## What is still numeric

Two things, because both are measured rather than asserted:

| Signal | Who | Why it stays |
|--------|-----|--------------|
| `coverage` | Tester | a tool computes it; reproducible |
| secret-scan severity | Implementation | pattern/entropy classification from **specloom-security-secrets**, not a judgement |

Neither is a self-report.

## Visual criteria

`ux_confidence ≥ 0.99` is gone. A visual Brief carries a list of visual criteria; each one
resolves to `pass` or `fail` against a named Image File:

```yaml
visual_results:
  - criterion: "tab bar has five items, active item tinted"
    image: ux/refs/home.webp
    result: pass | fail
    note: ""                # required when fail
```

A failed criterion becomes a `major` finding owned by `build`. Averaging criteria into one
number hid which screen was wrong.

## Returning

Every gate result carries `findings: []` and `state: green | red`. See
**specloom-contract** for the payloads.

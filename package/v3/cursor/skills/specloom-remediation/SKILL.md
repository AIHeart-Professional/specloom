---
name: specloom-remediation
description: >
  INTERNAL — specloom-loop. Route gate findings to the right agent by owner, and decide
  when to stop retrying. Not user-invokable.
disable-model-invocation: true
---

# Remediation routing

Only the **Loop** routes. Workers never Task each other.

## By owner

| `owner` | Next | Then |
|---------|------|------|
| `build` | Implementation, with the findings as `remediation[]` | re-run the gate that raised them |
| `test` | Tester | re-run Tester |
| `security` | Implementation with the security findings | re-run Security, then continue forward |
| mixed `build` + `test` | Implementation first, then Tester | never both at once |

A gate that goes green after remediation does **not** re-run the gates before it, unless
Implementation changed files those gates had already cleared — then re-run from Security.

## What gets passed on

Only `critical` and `major` findings. `minor` findings travel in the record, never as
remediation — asking an agent to fix style during a failure retry is how retries turn into
refactors.

Pass the findings verbatim. Do not summarise: `file`, `line`, `rule`, `source` and `remediation`
are what make the retry targeted.

## Repeat detection

Track `(file, rule)` across attempts for the Brief.

| Pattern | Action |
|---------|--------|
| Same `(file, rule)` fails twice | pass it again, flagged `repeat: true` |
| Same `(file, rule)` fails three times | stop the gate early — do not spend the last attempt |

Three identical failures mean the agent cannot act on that finding. A fourth attempt spends
tokens to produce the same result. Stop and say which finding is immovable — that is the thing a
human needs to see.

## Stop

Per-gate attempts, the Brief total of 6, or the token ceiling — whichever first. See
**specloom-loop-protocol**. The Orchestrator reports; it never retries on its own.

---
name: specloom-usage
description: >
  INTERNAL — @specloom, and every agent that returns a result. Work receipts, and the
  end-of-session token report sourced from harness telemetry. Not user-invokable.
disable-model-invocation: true
---

# Usage reporting

## The rule that shapes this

**An agent cannot know its own token usage.** There is no API for it — a subagent's context
starts fresh and carries only the prompt it was handed. Any number an agent states about its own
consumption is invented.

> "Subagents have no API to query their own token usage."
> — [Agent SDK · subagents](https://code.claude.com/docs/en/agent-sdk/subagents)

So SpecLoom splits the question in two:

| Question | Who answers | How |
|----------|-------------|-----|
| **How much did each agent cost?** | the harness | `claude_code.token.usage` via OTLP |
| **What did each agent actually do?** | the agent | a work receipt of things it can count |

Never let an agent answer the first one. v1 and v2 had a `tokens_used` field in every result
payload; it was filled with a guess on every call.

---

## Work receipts — what agents return

Every result payload carries a `receipt`. These are countable facts the agent observed while
working, not estimates:

```json
"receipt": {
  "files_read": 11,
  "files_written": 4,
  "tool_calls": 23,
  "commands_run": [{ "cmd": "npm run build", "exit": 0 }],
  "skills_loaded": ["specloom-contract", "specloom-findings", "specloom-coding"],
  "images_read": 2,
  "attempt": 1
}
```

Rules:

- Count, do not estimate. If you did not track it, omit the key
- `skills_loaded` is the honest record of conditional loading — it is how a drifting load
  pattern becomes visible
- **Never** add a token or cost field. The verifier rejects it

A receipt explains *why* an agent was expensive once telemetry says that it was. Files read and
images read are usually the answer.

---

## Token report — what the Orchestrator shows

`@specloom` ends **every** user-facing reply with the usage table. Not on request — always. A
cost you have to ask for is a cost you stop asking about.

### Source

```bash
node scripts/usage-collector.mjs --report
```

The collector receives `claude_code.token.usage` over OTLP/HTTP JSON and groups by
`query_source` and `agent.name`, scoped to `session.id`.

### Format

```markdown
### Token usage — session 8f2a…

| agent | input | output | cache read | billable | share |
|-------|------:|------:|-----------:|---------:|------:|
| specloom-implementation | 41,000 | 9,800 | 88,000 | 50,800 | 32.1% |
| specloom-tester | 38,000 | 11,200 | 76,000 | 49,200 | 31.1% |
| @specloom (main) | 18,000 | 4,200 | 120,000 | 22,200 | 14.0% |
| … | | | | | |
| **Total** | | | | **158,200** | |

Since your last message. Measured by the harness, not self-reported.
```

`billable = input + output + cacheCreation`. `cacheRead` is shown because it is large and
informative, but it is not new spend — presenting it inside the total would overstate cost
several-fold.

### When telemetry is not running

Say so plainly and do not substitute an estimate:

```markdown
### Token usage

Not available — the usage collector is not running. Start it with
`node scripts/usage-collector.mjs`, and set `CLAUDE_CODE_ENABLE_TELEMETRY=1` before launching.

Work this session: 4 agents · 23 tool calls · 11 files read · 4 written.
```

The receipt totals still say something true. A fabricated token count says nothing.

---

## Setup

```bash
node scripts/usage-collector.mjs          # terminal 1

export CLAUDE_CODE_ENABLE_TELEMETRY=1     # terminal 2, before launching claude
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=http/json
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
export OTEL_METRIC_EXPORT_INTERVAL=5000
claude
```

`OTEL_METRIC_EXPORT_INTERVAL` defaults to 60000 ms, which is too slow for an end-of-turn report.
5000 keeps the table current without much overhead.

Telemetry env vars are read at launch. Whether Claude Code picks up mid-session changes is not
documented — set them before starting.

## Interpreting it

| Pattern | Usually means |
|---------|---------------|
| Implementation and Tester dominate | normal — they read source and produce diffs |
| Main is high | the Orchestrator is doing domain work it should have handed off |
| Cache read very large vs input | context is being re-sent; a long session, not waste |
| One gate spikes on a retry | check `attempt` in its receipt against the per-gate budget |
| A skill appears in `skills_loaded` that its load condition excludes | conditional loading is drifting |

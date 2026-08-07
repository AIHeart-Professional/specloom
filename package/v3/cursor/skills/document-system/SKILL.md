---
name: document-system
description: >
  INTERNAL — specloom-document. Runtime, integrations, environment, data flow.
disable-model-invocation: true
---


# System docs

Answers **how does this run**, not how it is built.

## Files

```
system/
├── README.md         index
├── runtime.md        processes, entry points, how it starts
├── integrations.md   external services, auth model, failure behaviour
└── overview.md       request and data flow end to end
```

## Rules

- Name every external dependency and **what happens when it is unavailable** — the part
  everyone omits and everyone needs at 3am
- Environment variables: name, purpose, required or optional, default. **Never a value**
- Data flow follows one real request from entry to storage and back
- Unknown → `_TBD_`

## Never

Secrets, credentials, internal hostnames, or a production topology diagram detailed enough to
be an attack map.

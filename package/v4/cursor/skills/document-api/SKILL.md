---
name: document-api
description: >
  INTERNAL — specloom-document. HTTP, RPC and event interface reference.
disable-model-invocation: true
---


# API docs

Only for interfaces something **outside this module** calls.

## Per endpoint

| Field | Required |
|-------|----------|
| method + path, or event name | yes |
| purpose, one sentence | yes |
| auth: required scope or role | yes |
| request shape with types | yes |
| success response with a real example | yes |
| error responses: status, code, when | yes |
| idempotency and rate limits | when applicable |

## Rules

- **Generate from the source of truth** where one exists — an OpenAPI spec, a router, a schema.
  Hand-written API docs drift within one release
- Every example must be real. A fabricated response is worse than none
- Document errors as carefully as successes. Callers integrate against failures
- Breaking changes get a `document-changelog` entry too

## Never

Real tokens, keys or customer data in examples. Use obvious fixtures.

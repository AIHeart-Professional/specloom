---
name: specloom-security-secrets
description: >
  INTERNAL — specloom-implementation. Secret detection on added lines: patterns, entropy,
  allowlist handling. Runs on every Brief diff before the gate returns. Not user-invokable.
disable-model-invocation: true
---

# Secret detection

Scope: **added lines in the Brief diff.** A secret already on the base branch is a separate
incident, not this Brief's gate — report it as `minor` with a note so it is visible but does
not block unrelated work.

## Detect

| Class | Signal |
|-------|--------|
| Provider keys | `AKIA[0-9A-Z]{16}`, `AIza[0-9A-Za-z_-]{35}`, `sk-[A-Za-z0-9]{20,}`, `ghp_`, `gho_`, `xox[baprs]-` |
| Private keys | `-----BEGIN (RSA\|EC\|OPENSSH\|PGP) PRIVATE KEY-----` |
| Connection strings | scheme with inline credentials: `postgres://user:pass@`, `mongodb+srv://`, `amqp://` |
| JWT | three base64url segments separated by dots, with a decodable header |
| Generic assignment | an identifier matching `(secret\|token\|passwd\|password\|api[_-]?key\|credential)` assigned a literal ≥ 12 chars |
| High entropy | a literal ≥ 20 chars with Shannon entropy ≥ 4.0 bits/char and no dictionary structure |

## Severity

| Case | Severity |
|------|----------|
| A live-looking provider key or private key | **Critical** |
| Connection string with a real-looking password | **Critical** |
| Generic assignment or high entropy, not obviously a placeholder | **High** |
| Value present but clearly a placeholder or fixture | **Low** |

## Placeholders and fixtures — not secrets

Treat as Low, not High, when the value is any of:

- an obvious placeholder: `xxx`, `changeme`, `your-key-here`, `<...>`, `REPLACE_ME`, all-same-character
- a documented test vector (RFC examples, provider sandbox keys)
- inside a path matching `**/{test,tests,__tests__,fixtures,examples}/**` **and** the value is
  syntactically invalid for its provider

A real key in a test file is still Critical. "It's only a test" is not a mitigation — test files
are committed.

## Allowlist

A repo may carry `.specloom-secrets-allow` at its root:

```
# path:line-pattern  # reason (required)
src/demo/config.ts:AKIAEXAMPLE  # provider-published example key
```

Rules:

- An entry without a reason is ignored
- An allowlist entry is a `minor` finding on first sight, so the decision stays visible
- Never write to this file yourself — propose the line in `remediation`

## Findings

`source` for a secrets finding is this skill plus the class:
`specloom-security-secrets#provider-keys`. `remediation` must name the removal *and* the
rotation — a secret in git history is compromised even after deletion.

```yaml
- severity: critical
  gate: security
  owner: build
  file: src/api/client.ts
  line: 12
  issue: AWS access key id committed in source
  rule: no provider credentials in tracked files
  source: specloom-security-secrets#provider-keys
  remediation: move to env var AWS_ACCESS_KEY_ID, delete the line, and rotate the key — it is in git history
```

---
name: specloom-security-owasp
description: >
  INTERNAL — specloom-security. OWASP category checks against the Brief diff, with the
  in-scope trigger for each. Not user-invokable.
disable-model-invocation: true
---

# OWASP checks

Run a category **only when the diff is in scope for it**. Categories that cannot apply produce
no findings and are listed in `checks_run` as skipped, so a green result is legible.

| Category | In scope when the diff | Look for |
|----------|------------------------|----------|
| **A01 Broken access control** | adds or edits a route, handler, resolver, RLS policy or guard | a mutation path with no authorization check; an identifier taken from the request and used to fetch another user's row; a guard applied to the list endpoint but not the detail one |
| **A02 Cryptographic failures** | touches hashing, tokens, storage of personal data, TLS config | MD5 or SHA-1 for passwords; a hand-rolled cipher; a hard-coded IV or salt; `verify=False` |
| **A03 Injection** | builds a query, command, path or template from a variable | string-concatenated SQL; `exec`/`eval` on request data; shell invocation with `shell=True` and interpolation; path join on unsanitised input |
| **A04 Insecure design** | adds an auth, payment, reset or invite flow | a reset token that does not expire or is not single-use; an enumerable identifier where a random one is required |
| **A05 Misconfiguration** | edits config, headers, CORS, container or CI files | `Access-Control-Allow-Origin: *` alongside credentials; debug enabled in a production path; a default credential |
| **A06 Vulnerable components** | adds or bumps a dependency | a version with a known advisory; a pin removed in favour of a floating range |
| **A07 Auth failures** | touches login, session, MFA, password rules | session id not rotated on privilege change; no rate limit on a credential endpoint; a token compared with `==` rather than a constant-time compare |
| **A08 Integrity failures** | adds deserialization, plugin loading, auto-update | `pickle.loads`, `yaml.load` without `SafeLoader`, unsigned update fetch |
| **A09 Logging failures** | edits logging or error handling | a secret, token or full request body written to a log; an auth failure that logs nothing |
| **A10 SSRF** | makes an outbound request with a variable URL | a user-supplied host fetched with no allowlist |

## Severity mapping

| Situation | Severity |
|-----------|----------|
| Reachable from an unauthenticated path, or leaks credentials or another user's data | **Critical** |
| Reachable only by an authenticated user, or requires an unlikely precondition | **High** |
| Defence in depth missing but no exploit path in this diff | **Medium** → `major` |
| Style or hardening suggestion | **Low** → `minor` |

**Reachability decides severity.** If you cannot trace a path from an entry point to the code,
it is not Critical. Say so in `issue` rather than inflating it — a gate that cries Critical is
one the operator learns to override.

## Findings

`source` is this skill plus the category: `specloom-security-owasp#a03-injection`. `remediation`
must be the concrete change, not "sanitize input".

## Out of scope here

Secrets → **specloom-security-secrets**. Stack-specific tooling → **specloom-security-stack**.
Dependency advisories are only in scope when this diff changed the manifest.

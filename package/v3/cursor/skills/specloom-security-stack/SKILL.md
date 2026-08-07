---
name: specloom-security-stack
description: >
  INTERNAL — specloom-security. Mount a stack SAST profile when one exists; behave honestly
  when none does. Not user-invokable.
disable-model-invocation: true
---

# Stack profiles

Optional layer on top of secrets and OWASP. Load only when the Brief declares a stack that has
a profile.

## Resolution

1. Read the Brief `tech_stack`
2. Look for `security/{stack}.md` in the standards root (**specloom-standards-fetch**)
3. Missing → record `stack` as skipped in `checks_run` and continue

**A missing profile is not a failure and not a silent pass.** It appears in the result so a
green Security gate never implies more coverage than actually ran.

## Built-in profiles

| Stack | Checks |
|-------|--------|
| **react / typescript** | `dangerouslySetInnerHTML` with non-literal input; `href={userValue}` permitting `javascript:`; secrets reaching a `NEXT_PUBLIC_`/`VITE_` variable; `postMessage` with `*` target |
| **rust** | `unsafe` blocks added without a justifying comment; `.unwrap()` on external input in a request path; a dependency with a RUSTSEC advisory |
| **tauri** | an over-broad `allowlist` in `tauri.conf.json`; a command exposed to the frontend without validation; filesystem scope widened to `$HOME` or `**` |
| **python** | `subprocess` with `shell=True`; `yaml.load` without `SafeLoader`; Jinja autoescape disabled |
| **postgres** | a table added with RLS enabled and no policy; a policy using `USING (true)`; `SECURITY DEFINER` without a pinned `search_path` |

## Tooling

Run a scanner when the repo already configures one — `npm audit`, `cargo audit`, `pip-audit`,
`semgrep` with the repo's ruleset. Record the exact command and exit code.

Never install a scanner to satisfy the gate. Record it as unavailable instead.

## Findings

`source` is the profile path when one was loaded (`security/react.md#dangerous-html`), otherwise
this skill plus the check name. A tool-produced finding cites the tool and rule id.

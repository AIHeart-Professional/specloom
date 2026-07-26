---
name: code-tauri
description: >
  INTERNAL — specloom-frontend/backend. Tauri 2 app standards (security, IPC, capabilities).
  Always pair with code-rust (and frontend code-* for the WebView UI). Not user-invokable.
---

# Tauri — coding standards

Target **Tauri 2**. Rust core + WebView frontend. Always also load **code-rust** for `src-tauri`.  
Frontend stack skills separately (`code-react`, `code-typescript`, …).

## Official sources

- [Tauri 2 Security](https://v2.tauri.app/security/)
- [Capabilities](https://v2.tauri.app/security/capabilities/)
- [IPC / Isolation](https://v2.tauri.app/concept/inter-process-communication/isolation/)
- [Tauri 2 Docs](https://v2.tauri.app/)

## Trust model (non-negotiable)

- Treat **WebView frontend as untrusted** relative to Rust core
- All privileged work goes through **commands / IPC** with validation in Rust
- **Capabilities** grant least privilege — do not enable broad FS/shell/network “for convenience”
- Prefer **CSP** + tight capability files under `src-tauri/capabilities/`
- Consider **Isolation pattern** when IPC surface is sensitive

## Non-negotiables

- Validate **every** command argument in Rust (types + business rules); never trust frontend shapes alone
- Explicit allowlists for windows/webviews in capabilities
- No shipping with debug-only permissions left on in production builds
- Keep `tauri.conf.json` / capabilities reviewed on every permission change
- Do not expose raw shell, arbitrary path, or unrestricted HTTP from the WebView without scoped capability + validation
- Secrets stay in Rust / OS keychain patterns — never embed secrets in frontend bundles

## Project layout

| Path | Role |
|------|------|
| `src-tauri/` | Rust core, commands, plugins, capabilities |
| Frontend dir (`src/`, etc.) | WebView UI — use matching `code-*` |
| `src-tauri/capabilities/` | Permission grants |

## Commands / IPC

- Small, intentional command surface; name commands clearly
- Return `Result` with structured errors the UI can handle
- Prefer serializable DTOs; avoid leaking internal paths/OS errors verbatim to UI when sensitive
- Register only needed plugins; audit plugin permissions

## Anti-patterns

- `withGlobalTauri` / overly open APIs in production without review
- Capability files that grant `*` / unrestricted scopes
- Business logic only in the WebView for security-sensitive operations
- Skipping input validation because “TypeScript types already checked”

## Interop

| Concern | Also load |
|---------|-----------|
| Rust style / errors | **code-rust** |
| React UI | **code-react** + **code-typescript** |
| Tests | **test-tauri** + **test-rust** (+ frontend test-*) |

## Review checklist

- [ ] Capabilities least-privilege
- [ ] Commands validate input
- [ ] No secrets in frontend
- [ ] CSP / security config sane for target
- [ ] `code-rust` rules satisfied in `src-tauri`

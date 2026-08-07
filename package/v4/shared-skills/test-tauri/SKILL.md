---
name: test-tauri
description: >
  INTERNAL — specloom-test-* agents. Tauri 2 testing standards.
  Pair with test-rust and frontend test-* as needed. Not user-invokable.
---

# Tauri — testing standards

Testing only. Cover Rust commands, capabilities assumptions, and critical UI↔IPC flows.

## Official sources

- [Tauri 2 Security](https://v2.tauri.app/security/)
- [Rust Book — Tests](https://doc.rust-lang.org/book/ch11-00-testing.html)
- Frontend test stack per UI framework (`test-react`, `test-typescript`, …)

## Required styles

| Style | Scope |
|-------|--------|
| **unit** | Pure Rust helpers; command handlers with mocked state |
| **integration** | `src-tauri` public command API; capability-gated paths |
| **system** | App launch smoke; critical user flow via WebView automation when Brief requires |
| **performance** | Startup / heavy command latency when Brief asks |

## Stack

| Layer | Tool |
|-------|------|
| Rust | `cargo test` in `src-tauri` (**test-rust**) |
| UI | RTL / Vitest / Playwright per frontend skills |
| IPC | Invoke commands in tests with valid + invalid payloads |

## Principles

- Test **deny paths**: invalid IPC input must fail safely
- Assert capability boundaries — privileged ops unreachable without grant
- Do not require real OS dialogs in unit tests — mock boundaries
- Map to Brief acceptance (`brief_key`)
- Frontend E2E only for critical paths (login/lock/backup), not every screen

## Anti-patterns

- Only happy-path `invoke` tests
- E2E that clicks through entire app every Brief
- Skipping Rust tests because “UI covers it”

## Review checklist

- [ ] `cargo test` in `src-tauri` green
- [ ] Invalid command payloads covered
- [ ] Critical IPC flows covered per Brief
- [ ] Frontend tests loaded matching UI stack

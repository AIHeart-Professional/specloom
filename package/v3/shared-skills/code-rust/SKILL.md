---
name: code-rust
description: >
  INTERNAL — specloom-implementation/backend/database. Rust coding standards (API Guidelines + style).
  Pair with test-rust. Not user-invokable.
---

# Rust — coding standards

Apply to every `.rs` file unless Brief documents an approved exception.  
Also load **code-tauri** when working in a Tauri `src-tauri` crate.

## Official sources

- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [The Rust Style Guide](https://doc.rust-lang.org/nightly/style-guide/)
- [The Rust Book](https://doc.rust-lang.org/book/)
- [Clippy lints](https://rust-lang.github.io/rust-clippy/master/)

## Non-negotiables

- Prefer **safe Rust**; every `unsafe` block needs a `// SAFETY:` comment listing invariants
- Public APIs follow **Rust API Guidelines** (naming, conversions, errors, docs)
- **Errors:** use `Result` + meaningful error types (`thiserror` / `anyhow` at app boundaries as project chooses); implement `std::error::Error` for library error types; prefer `?` over `unwrap`/`expect` in non-test code
- **Naming (C-CASE):** `UpperCamelCase` types/traits; `snake_case` functions/modules; `SCREAMING_SNAKE_CASE` consts/statics
- Conversions: `as_` / `to_` / `into_` prefixes per guidelines; use `From` / `TryFrom` / `AsRef` / `AsMut`
- Types that cross threads: be intentional about `Send` + `Sync`
- No silent discard of `Result` (`let _ =` only with justified comment)

## Tooling (required in CI / local before Done)

| Tool | Role |
|------|------|
| `rustfmt` | Format — `cargo fmt` |
| `clippy` | Lints — `cargo clippy -- -D warnings` (or project-equivalent deny list) |
| `cargo test` | Unit / integration / doctests |
| `cargo doc` | Public items documented |

## Modules and APIs

- Keep modules cohesive; avoid huge `lib.rs` / `main.rs` dumps — extract modules
- Public items: rustdoc with examples where non-trivial; document **Errors** / **Panics** / **Safety**
- Prefer owned vs borrowed deliberately; avoid unnecessary `.clone()`
- Feature flags: real names, no placeholder words (C-FEATURE)

## Anti-patterns

- `unwrap()` / `expect()` in production paths without invariant proof
- Stringly-typed errors (`String` / `&str` as sole error type in libraries)
- Ignoring Clippy / rustfmt drift
- Catch-all `#[allow(...)]` without scoped justification
- Blocking the async runtime with sync I/O when the crate is async

## Interop

- Tauri commands / IPC: also **code-tauri**
- FFI / C bindings: document safety; minimize unsafe surface

## Review checklist

- [ ] `cargo fmt` clean
- [ ] `cargo clippy` clean (project deny level)
- [ ] No unjustified `unwrap` in non-test code
- [ ] Public API naming + docs match guidelines
- [ ] `unsafe` documented

---
name: test-rust
description: >
  INTERNAL — specloom-test-* agents. Rust testing standards (Book + Cargo).
  Do not load code-rust here. Not user-invokable.
---

# Rust — testing standards

Testing only — no production feature work. Pair with **code-rust** on the build side.

## Official sources

- [Writing Tests — The Rust Book](https://doc.rust-lang.org/book/ch11-01-writing-tests.html)
- [Test Organization — The Rust Book](https://doc.rust-lang.org/book/ch11-03-test-organization.html)
- [cargo test](https://doc.rust-lang.org/cargo/commands/cargo-test.html)

## Required styles

| Style | Scope |
|-------|--------|
| **unit** | `#[cfg(test)]` modules colocated with code; may touch private items |
| **integration** | `tests/` directory — public API only, separate crates |
| **system** | Binary / app smoke (e.g. Tauri command round-trip, CLI) when Brief requires |
| **performance** | Criterion or targeted benches when Brief asks — not default for every Brief |

## Stack

| Tool | Use |
|------|-----|
| `cargo test` | Unit + integration + doctests |
| `#[test]` / `assert!` / `assert_eq!` | Assertions |
| `#[should_panic]` / `Result` in tests | Expected failures |
| Doctests | Examples in rustdoc must compile/run |

## Principles

- AAA; one behavior per test; descriptive names
- Tests must not depend on shared mutable env when run in parallel (default); use `-- --test-threads=1` only when necessary and documented
- Prefer `Result` in tests over nested unwraps when clarifying failures
- Map coverage to Brief acceptance (`brief_key`)
- Integration tests import the library like an external user

## Anti-patterns

- Testing only through `unwrap` panics with no assertion message
- Integration tests that reach private internals via hacks
- Order-dependent tests that fail under parallel `cargo test`
- Skipping doctests that are part of public API contract

## Commands

```
cargo test
cargo test <filter>
cargo test --test <integration_file>
cargo test -- --nocapture
```

## Review checklist

- [ ] Unit tests for critical modules
- [ ] Integration tests for public boundaries when crate is a lib
- [ ] `cargo test` green on `ai-workflow`
- [ ] Brief acceptance criteria covered

---
name: test-csharp
description: >-
  INTERNAL — specloom-game-test-standards only. C# testing per Microsoft conventions and xUnit.
  Unit, integration, system, performance. Do not load code-csharp. Not user-invokable.
---

# C# Testing Standards

Professional C# test standards aligned with [pytest-style assert clarity](https://docs.pytest.org/en/stable/how-to/assert.html) idioms in xUnit/NUnit, [C# coding conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions) for test code, and .NET testing best practices.

## Required test styles (all four per spec work)

| Style | Scope | Layout |
|-------|-------|--------|
| **unit** | Pure classes, validators, math | `Tests/Unit/` |
| **integration** | Multiple services, DB, file I/O with test doubles | `Tests/Integration/` |
| **system** | Full host, API, or game entry with test config | `Tests/System/` |
| **performance** | Benchmarks, latency smoke | `Tests/Performance/` |

Map every test to **spec** Requirements or **feature** acceptance criteria (`spec_ref`).

## Stack (read `AGENTS.md`)

| Tool | Use |
|------|-----|
| **xUnit** (default) or **NUnit** / **MSTest** | Test runner |
| **coverlet** + `dotnet test --collect:"XPlat Code Coverage"` | Coverage |
| **FluentAssertions** (optional) | Readable assertions |
| **BenchmarkDotNet** | Performance tests |
| **Moq** / **NSubstitute** | Mocks at boundaries |

## Test code style (PEP 8 parallel for C#)

Apply **code-csharp** conventions to test projects:

- Test classes: `{TypeUnderTest}Tests` or nested `public class Tests`
- Test methods: descriptive names — `Method_WhenCondition_ExpectedResult` or `Should_Expected_When_Condition`
- **Arrange–Act–Assert** with blank lines between sections
- One logical behavior per test method
- No `any` / nullable suppressions without comment

## Assertions

- Use **`Assert`** (xUnit) or FluentAssertions — never `return true` from test methods
- Float compare: `Assert.Equal(expected, actual, precision: 3)` or `actual.Should().BeApproximately(...)`
- Exceptions: `Assert.Throws<T>(() => ...)` or `await Assert.ThrowsAsync<T>(...)`
- Async tests: `public async Task Name()` — always await

## Structure

```
Tests/
  Unit/
  Integration/
  System/
  Performance/
  GlobalUsings.cs
  TestHelpers/
```

Mirror production namespace under `Tests/`.

## Unit tests

- Test **public behavior** — not private implementation
- Mock at **boundaries** (HTTP, filesystem, clock) — not internals of class under test
- Use **`[Theory]` + `[InlineData]`** for input matrices
- **`IClassFixture`** / **`ICollectionFixture`** for expensive shared setup

## Integration tests

- Real test database or in-memory provider when spec allows
- **`WebApplicationFactory<T>`** for ASP.NET integration
- Transaction rollback or fresh DB per test
- Never production services in CI

## System tests

- End-to-end flows from spec acceptance criteria
- Minimal mocking — only external third parties
- Test configuration via `appsettings.Testing.json` or env vars

## Performance tests

- **`[Benchmark]`** (BenchmarkDotNet) or project smoke script
- Assert thresholds documented in spec or `AGENTS.md`
- Mark `[Trait("Category", "Performance")]` — optional separate CI job

## Coverage

- **100%** on manifest game-layer production files (see **specloom-game-test-standards-rules**)
- Cover exception paths and boundary values

## Anti-patterns

- Testing private methods via reflection
- Shared mutable static state between tests without reset
- `Thread.Sleep` — use `Task.Delay` with timeout helpers or polling
- Flaky timing without tolerance

## References

- [Unit testing best practices](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices)
- [xUnit documentation](https://xunit.net/)
- [Coverlet](https://github.com/coverlet-coverage/coverlet)

## Codex Port

Internal — **specloom-game-test-standards** only.

---
name: test-{{SLUG}}
description: >
  INTERNAL — specloom-test-* agents. Testing standards for {{DISPLAY}}.
  Do not load code-{{SLUG}} here. Not user-invokable. generated: init
---

# {{DISPLAY}} — testing standards

`generated: init` · refine in **specloom-standards** `test/{{SLUG}}/CORE.md`

Testing only — no production feature work.

## Required styles

| Style | Scope |
|-------|--------|
| **unit** | Isolated units / pure logic |
| **integration** | Cross-module / host bridge |
| **system** | Full app path / E2E smoke |
| **performance** | Critical-path timing when Brief asks |

## Official sources

- {{DOC_URL_1}}
- {{DOC_URL_2}}

## Stack

| Tool | Use |
|------|-----|
| {{TEST_TOOL}} | {{TEST_ROLE}} |

## Principles

- Behavior over implementation
- AAA; one focus per test
- Mock at boundaries
- Map to Brief acceptance (`brief_key`)

## Anti-patterns

- {{ANTI_1}}
- {{ANTI_2}}

## Notes

_Init-generated. Promote into specloom-standards when stable._

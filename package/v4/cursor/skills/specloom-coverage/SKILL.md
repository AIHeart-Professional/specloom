---
name: specloom-coverage
description: >
  INTERNAL — specloom-tester and the run-set workflow. Coverage floor, the ratchet, and auditing
  ignore directives. Not user-invokable.
disable-model-invocation: true
---

# Coverage

## Floor, not a target

```
pass = coverage ≥ coverage_floor
```

`coverage_floor` is a product setting, default **0.90**, recorded on the Overview.

## The ratchet

| Situation | Action |
|-----------|--------|
| Brief lands above the floor | raise the floor to the achieved value, return it as `new_floor` |
| Brief lands at the floor | floor unchanged |
| Brief lands below the floor | `state: red` — coverage regressed |
| No floor recorded yet | first green Brief sets it; do not fail the first run |

The floor only rises. This gives the same protection a flat 0.99 was reaching for, without
paying for the last nine percent in tests nobody trusts.

## Measured set

Coverage is computed over the Brief's **production files** — the paths in `changes[]` from
Implementation, excluding test files, generated code and vendored directories. Not the whole
repo; a Brief is not accountable for code it did not touch.

Missing coverage tool → `state: red` with a `critical` finding against the repo config. Do not
estimate coverage.

## Ignore directives

Honoured for genuinely unreachable code:

| Stack | Directive |
|-------|-----------|
| Python | `# pragma: no cover` |
| JS / TS | `/* istanbul ignore next */`, c8 and nyc equivalents |
| Rust | `#[cfg(not(tarpaulin_include))]` |
| Other | as documented in `test-{lang}` |

### Audit — required

For every ignore directive **added in this Brief**, decide:

| Covers | Verdict |
|--------|---------|
| A defensive branch that cannot be reached from any entry point | allowed |
| A framework initializer or generated boilerplate | allowed |
| An `Err`/`catch` arm for an error the caller cannot produce | allowed |
| Any line implementing an acceptance criterion | **`major` finding — reject** |
| A whole function, file or module | **`major` finding — reject** |

An ignore added in the same commit that raised coverage above the floor deserves particular
scrutiny. Say so in the finding.

## Reporting

```json
"coverage": {
  "percent": 0.93,
  "floor": 0.90,
  "new_floor": 0.93,
  "measured_files": 12,
  "uncovered_files": ["src/x.ts"],
  "ignores_added": [{ "file": "", "line": 0, "verdict": "allowed|rejected", "why": "" }]
}
```

Per-layer figures go in `findings` as `minor`, so one weak layer stays visible instead of being
averaged away by a strong one.

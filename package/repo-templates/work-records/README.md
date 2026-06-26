# Work Records

Per-spec audit folder in the **same repo** (not a separate git repository).

## Path

```
docs/specs/work-records/SPEC-{spec_id}/
├── manifest.json       # Machine-readable work done — AGENTS READ THIS ONLY
├── work-done.md        # Human-readable log — agents never read
├── implementation.md   # After tests pass — detailed narrative
├── testing.md          # After tests pass — sdd-qa-tester output
└── completion.json     # After tests pass — metadata
```

Example: `docs/specs/work-records/SPEC-042/`

## Lifecycle

```
First task complete
  → sdd-records-keeper creates manifest.json + work-done.md

Each task complete
  → sdd-records-keeper updates manifest.json + appends work-done.md + spec Changes

All tasks complete
  → manifest.status = awaiting_tests

Work validation
  → sdd-qa-tester reads manifest.json only

Test gate
  → sdd-qa-tester reads manifest.json + spec Changes + Requirements + codebase
  → loads test-* skills per manifest.layers

Tests pass
  → sdd-records-keeper writes implementation.md, testing.md, completion.json
  → manifest.status = tests_passed

Sign-off + archive
  → spec moves to archived/; work-records/ folder stays
```

## Templates

| File | Template |
|------|----------|
| manifest.json | `manifest.template.json` |
| work-done.md | `work-done.template.md` |
| implementation.md | `implementation.template.md` |
| testing.md | `testing.template.md` |
| completion.json | `completion.template.json` |

## Agent rule

From work-records, agents read **`manifest.json` only**. Humans read `work-done.md` via orchestrator or directly.

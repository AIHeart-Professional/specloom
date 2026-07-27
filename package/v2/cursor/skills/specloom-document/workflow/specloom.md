# SpecLoom workflow (this product)

last_updated: {{DATE}}

## Peers

```
@specloom-init → @specloom-brief → @specloom-run
@specloom-document
@specloom-git
```

Internal: `specloom-build` · `specloom-validate` · `specloom-test` (only via run)

## Stages (Brief)

`Backlog → Ready → Building → Testing → Validating → Done`  
Labels `specloom:*` if team lacks custom states.

## Run loop (one SPE)

```
build → validate code_quality (≥99%) → test → validate test_quality (≥99% + 100% coverage)
```

≤5 retries per gate → else BLOCKED + user alert. Push `ai-workflow` on success. No auto-run next SPE.

## Docs updates

| Event | Docs action |
|-------|-------------|
| Init complete | `bootstrap` docs repo |
| Brief create/edit | `sync_brief` → `specs/active/` |
| Brief Done | `closeout` via run |
| User request / gaps | `@specloom-document` `scan` |

## Notes

_Preserve this section on rescan._

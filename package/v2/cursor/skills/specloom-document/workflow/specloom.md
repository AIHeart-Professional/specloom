# SpecLoom workflow (this product)

last_updated: {{DATE}}

## Peers

```
@specloom-init → @specloom-brief → @specloom-build → @specloom-test → @specloom-validate
@specloom-document   # docs repo bootstrap / scan / closeout helper
@specloom-git        # repo bootstrap
```

## Stages (Brief)

`Backlog → Ready → Building → Testing → Validating → Done`  
Labels `specloom:*` if team lacks custom states.

## Full-auto chain

brief → build → test → validate → build(next)  
Say `manual` to stop Task handoffs.

## Docs updates

| Event | Docs action |
|-------|-------------|
| Init complete | `bootstrap` docs repo |
| Brief create/edit | `sync_brief` → `specs/active/` |
| Brief Done | `closeout` → archive + refresh indexes |
| User request / gaps | `@specloom-document` `scan` |

## Notes

_Preserve this section on rescan._

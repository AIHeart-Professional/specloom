# System overview

last_updated: {{DATE}}
source: Linear Overview + app scan

## Purpose

What the system is and is not (from Overview).

{{PURPOSE}}

## Boundaries

| In | Out |
|----|-----|
| {{IN_SCOPE}} | {{OUT_SCOPE}} |

## Layers

| Layer | Role | Stack |
|-------|------|-------|
| frontend | {{FE_ROLE}} | {{FE_STACK}} |
| backend | {{BE_ROLE}} | {{BE_STACK}} |
| database | {{DB_ROLE}} | {{DB_STACK}} |

Omit rows that do not apply (e.g. pure offline client with local DB only).

## Major flows

1. {{FLOW_1}}
2. {{FLOW_2}}

## Trust & data

- Where truth lives (local DB / API / etc.): {{DATA_TRUTH}}
- Auth model: {{AUTH_MODEL}}

## Notes

_Preserve this section on rescan._

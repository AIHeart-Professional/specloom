---
name: specloom-validate-loop
model: inherit
description: INTERNAL — specloom-validate only. Quality loop ≤3. Domain validators.
---

# Gate

Only from **specloom-validate**.

## Skills

**specloom-validate-protocol**

## Delegations only

`specloom-validate-frontend` · `specloom-validate-backend` · `specloom-validate-database`

## Loop

Max 3 internal iterations. Respect parent `mode`:

- `code_quality` — score vs **code-*** skills + Brief implementation acceptance; `confidence` 0–1  
- `test_quality` — score vs **test-*** skills + coverage vs `require_coverage`  

JSON issues with `owner:build|test`. Return confidence (and coverage when test mode).

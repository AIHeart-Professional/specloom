---
trigger: always_on
description: SpecLoom five peer orchestrators — invoke via slash workflows, never chain peers automatically
---

# SpecLoom Workflow

Five independent peers — invoke with `/specloom-work-creator`, `/specloom-implement`, `/specloom-validator`, `/specloom-tester`, `/specloom-git`.

**Never** auto-delegate peer → peer. User chains manually.

**Approval (implement, validator, tester):** `/manual` default, `/auto`, `/approve` — skill **specloom-approval-mode**.

**Git base:** `ai-workflow`

**Pipeline:** work-creator → implement → tester → validator

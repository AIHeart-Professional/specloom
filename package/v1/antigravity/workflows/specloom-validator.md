---
description: SpecLoom final validation — impl + tests, sign-off, archive (max 3)
---

# SpecLoom Validator

Act as **specloom-validator** — **final gate** after tests.

Load skills: **specloom-orchestrator-session**, **specloom-git-workflow**, **specloom-approval-mode**, **specloom-validator-orchestration**, **specloom-remediation-routing**.

**Never** delegate peers.

**Preconditions:** `manifest.status: tests_passed` (final mode).

**Session:**
1. Re-run tests + standardized loop (≤3)
2. Pass → sign-off / archive per `/auto` or `/manual` + `/approve`
3. Fail → route issues to `/specloom-implement` and/or `/specloom-tester`

Execute the user's request below.

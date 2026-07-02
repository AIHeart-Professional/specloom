# Spec Creation Loop

> Coordinator priority **2**. Ready feature → spec draft.

## Flow (via specloom-implement)

```
specloom-work-creator (create_spec) → specloom-validator (spec) → pass | revise (max 3)
```

## Procedure

1. Ready feature issue (`sdd:status:ready`) + next Spec Queue row - fetch via **specloom-git-planning**.
2. Derive `git_spec_branch = feature/<spec-slug>` from the Spec Queue topic.
3. **specloom-implement** -> **specloom-git** `spec_start` from `ai-workflow`; branch must exist before docs work.
4. **specloom-implement** -> **specloom-update-knowledgebase** `link_spec_branch` so the parent feature issue records the branch and URL.
5. **specloom-implement** -> **specloom-work-creator** `create_spec`, `parent_feature: github:owner/repo#N`, `git_spec_branch`.
6. **specloom-implement** -> **specloom-validator** `validation_type: spec`.
7. Fail -> **specloom-work-creator** `revise_draft` (max 3).
8. Pass with `total_confidence >= 99` -> **awaiting_sign_off**: set `pendingSignOff`, `humanApprovalRequired: true`, stop. **specloom-implement** presents review card. **Do not** `mark_ready` until user approves in chat.
9. After user sign-off -> **specloom-update-knowledgebase** `mark_ready`: spec `Pending`, tasks `Ready`, parent feature `Spawned Specs` row updated.
10. Stop.

## Stop conditions

- Spec validation pass awaiting user sign-off, or incomplete after 3 attempts
- Branch creation/linking blocked

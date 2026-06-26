# Spec Creation Loop

> Coordinator priority **2**. Ready feature → spec draft.

## Flow (via sdd-orchestrator)

```
sdd-docs (create_spec) → sdd-validation (spec) → pass | revise (max 3)
```

## Procedure

1. Ready feature issue (`sdd:status:ready`) + next Spec Queue row - fetch via **sdd-github-planning**.
2. Derive `git_spec_branch = feature/<spec-slug>` from the Spec Queue topic.
3. **sdd-orchestrator** -> **sdd-github** `spec_start` from `ai-workflow`; branch must exist before docs work.
4. **sdd-orchestrator** -> **sdd-updates** `link_spec_branch` so the parent feature issue records the branch and URL.
5. **sdd-orchestrator** -> **sdd-docs** `create_spec`, `parent_feature: github:owner/repo#N`, `git_spec_branch`.
6. **sdd-orchestrator** -> **sdd-validation** `validation_type: spec`.
7. Fail -> **sdd-docs** `revise_draft` (max 3).
8. Pass with `total_confidence >= 99` -> **awaiting_sign_off**: set `pendingSignOff`, `humanApprovalRequired: true`, stop. **sdd-project-lead** presents review card. **Do not** `mark_ready` until user approves in chat.
9. After user sign-off -> **sdd-updates** `mark_ready`: spec `Pending`, tasks `Ready`, parent feature `Spawned Specs` row updated.
10. Stop.

## Stop conditions

- Spec validation pass awaiting user sign-off, or incomplete after 3 attempts
- Branch creation/linking blocked

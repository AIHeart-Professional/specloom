# Feature Definition Loop

> Coordinator priority **3**. Backlog idea issue -> new feature issue.

## Flow (via specloom-implement)

```text
specloom-work-creator (create_feature) -> specloom-validator (feature) -> pass | revise (max 3)
```

Skills: **specloom-work-creator-docs-planning**, **specloom-work-creator-create-feature**.

## Procedure

1. Read `active_work.json`, `github-planning.json`, or resolve repo with `gh repo view` when config is missing during migration.
2. Resolve earliest backlog idea issue per **specloom-git-planning**.
3. Fetch source idea issue with `gh issue view`; do not read comments unless requested.
4. **specloom-implement** -> **specloom-work-creator** `DOCS_HANDOFF` action `create_feature`, `source: github:owner/repo#N`.
5. Create a **new** `[FEAT-NNN]` issue. Never rename or relabel the idea issue into a feature.
6. **specloom-implement** -> **specloom-validator** `validation_type: feature`, `source` + feature GitHub ref.
7. Fail -> **specloom-work-creator** `revise_draft` with `rewrite_instructions` (attempt +1).
8. Pass with `total_confidence >= 99` -> **awaiting_sign_off**: set `pendingSignOff`, `humanApprovalRequired: true`, stop. Present review card. **Do not** `mark_ready` until user approves in chat.
9. After user sign-off -> **specloom-update-knowledgebase** `mark_ready`: set feature `Ready` or `Draft`; promote/close source idea.
10. Update root `docs/README.md` Feature Queue to list open `sdd:feature` issues and next action.
11. Stop.

## Required feature format

Feature issue must include YAML frontmatter with `sdd_type: feature`, matching `[FEAT-NNN]`, `source_issue`, token budget fields, dependencies, required body sections, Spec Queue, Spawned Specs, and Completion Status.

## Stop conditions

- Feature validation pass awaiting user sign-off
- Feature promoted after sign-off and source idea closed
- Feature remains Draft because dependencies/open questions block Ready.
- Incomplete after 3 attempts; record blocker.
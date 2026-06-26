---
name: sdd-create-feature
description: >-
  INTERNAL - sdd-docs agent only. Author features as GitHub Issues. Not user-invokable.
disable-model-invocation: true
---

# SDD Create Feature

Creates **high-level WHAT** as **GitHub Issues** (`sdd:feature`). Specs (`docs/specs/`) are **low-level HOW** spawned from features.

Load **sdd-github-planning** before acting.

## Three layers

| Layer | Location | Meaning |
|-------|----------|---------|
| **Idea** | GitHub Issue | Backlog problem/opportunity - created by **sdd-create-idea** |
| **Feature** | GitHub Issue | Promoted WHAT to build - this skill |
| **Spec** | `docs/specs/` | HOW - one implementation unit from a feature Spec Queue |

Flow: **Idea issue (`sdd:idea`) -> Feature issue (`sdd:feature`) -> spec branch + spec files -> implement + validate -> PR merge to `ai-workflow` -> archive specs -> complete feature**.

## Feature vs Spec

| | Feature | Spec |
|---|---------|------|
| **Level** | High - WHAT | Low - HOW |
| **Location** | GitHub Issue | `docs/specs/` |
| **Naming** | `[FEAT-NNN]` title + `sdd_id` | `MMDDYY_short-description.md` |
| **Complete** | Issue closed + `sdd:status:complete` after sign-off and archived specs | `docs/specs/archived/` |

## Promotion rule

When promoting an idea, **never convert the idea issue in place**.

Correct promotion:

1. Read source idea issue with `gh issue view`.
2. Create a new feature issue titled `[FEAT-NNN] ...` with `sdd:feature` and matching status label.
3. Set feature frontmatter `source_issue: <idea number>`.
4. Validate/revise the feature issue until it follows the required format.
5. If feature is ready to spawn specs, set frontmatter `status: Ready` and label `sdd:status:ready`; otherwise keep `Draft` + `sdd:status:draft`.
6. Update the source idea body frontmatter to `status: promoted`, keep title `[IDEA-NNN] ...`, labels `sdd:idea` + `sdd:status:promoted`, then close it with comment `Promoted to feature #N`.

Wrong promotion:

- Renaming `[IDEA-NNN]` to `[FEAT-NNN]`.
- Changing `sdd_type: idea` to `feature` on the same issue.
- Leaving a promoted idea open with `sdd:status:backlog`.

## Required feature issue format

Frontmatter must include:

```yaml
---
sdd_type: feature
sdd_id: "001"
priority: "001"
spec_id: "001"
status: Ready
source_issue: 12
git_base_branch: ai-workflow
estimated_tokens: 0
tokens_used: null
token_variance: null
created: MM-DD-YYYY
last_updated: MM-DD-YYYY
dependencies: []
---
```

Required body sections, in order:

1. `# Feature Name`
2. Promotion/source note when created from an idea
3. `## Summary`
4. `## Goal`
5. `## User Value`
6. `## Dependencies`
7. `## Scope`
8. `## Acceptance Criteria`
9. `## UX References`
10. `## Context Links`
11. `## Spec Queue`
12. `## Spawned Specs`
13. `## Token Budget`
14. `## Open Questions`
15. `## Completion Status`

## Critical rules

1. **`sdd_id`:** 3-digit priority (`001` = next feature for spec creation).
2. **ID match:** `sdd_id: "001"` matches `[FEAT-001]` in title.
3. **One planning type:** feature issue has `sdd:feature`; source idea keeps `sdd:idea`.
4. **One status:** labels mirror frontmatter status exactly.
5. **Dependencies:** list feature `sdd_id` refs; verify dependency issues are `sdd:status:complete` before Ready/spec spawn.
6. **Spec Queue:** ordered table; next spec = lowest pending row.
7. **One feature != one spec:** feature may spawn many specs.
8. **Token Budget:** required in frontmatter and body, with estimated total and per-spec rollup.
9. **Feature Queue docs:** update root `docs/README.md` Feature Queue to list open `sdd:feature` issues; `docs/features/` is legacy fallback only.
10. **Sign-off gate:** do not mark feature Complete until all Acceptance Criteria are met, all spawned specs are archived, and user explicitly signs off.

## Priority / next feature for spec

1. Query Ready feature issues (`sdd:status:ready`) and choose lowest `sdd_id`.
2. Verify all dependency feature issues are Complete.
3. Verify Spec Queue has a pending row.
4. Spawn one spec from the lowest pending Spec Queue row without changing the feature's WHAT.

## Create workflow

```
- [ ] Step 1: Resolve REPO; choose next feature sdd_id
- [ ] Step 2: If from idea: gh issue view source_issue
- [ ] Step 3: Read architecture, code standards, decisions, knowledge, and existing feature issues
- [ ] Step 4: Fill feature-issue-template.md exactly
- [ ] Step 5: Create new GitHub issue with sdd:feature + sdd:status:draft or sdd:status:ready
- [ ] Step 6: Validate feature format and revise as needed
- [ ] Step 7: If promoted from idea and feature is accepted: mark source idea promoted and close it
- [ ] Step 8: Update docs/README.md Feature Queue with open sdd:feature issues
```

### Status labels

| Status | Label | Meaning |
|--------|-------|---------|
| **Draft** | `sdd:status:draft` | Feature needs answers, dependencies, or revision |
| **Ready** | `sdd:status:ready` | Feature can spawn next Spec Queue row |
| **In Progress** | `sdd:status:in-progress` | One or more specs reference this feature |
| **Complete** | `sdd:status:complete` + close issue | All criteria met, specs archived, validation/PR merge recorded |

Update body and labels together via `gh issue edit`; frontmatter `status` must match label.

## During spec work

When spawning a spec from Spec Queue row:

1. Update feature issue **Spawned Specs** table.
2. Mark the Spec Queue row spawned/in progress in the feature body.
3. Set label `sdd:status:in-progress` and frontmatter `status: In Progress`.
4. Keep feature Summary/Goal/User Value/Scope stable unless user approves a feature revision.

## On feature complete

1. All Acceptance Criteria checked in issue body.
2. All Spawned Specs are in `docs/specs/archived/`.
3. User sign-off recorded.
4. Token Budget actuals and variance synced.
5. **sdd-updates** sets `sdd:status:complete`, closes feature issue, and leaves source idea closed/promoted.

## Related

- Template: **sdd-github-planning** -> `feature-issue-template.md`
- GitHub planning: **sdd-github-planning**
- Specs: **sdd-create-spec**
- User map: **sdd-system-reference**
- Execute specs: **sdd-orchestrator**
---
name: sdd-github-planning
description: >-
  INTERNAL - sdd-loop, sdd-docs, sdd-validation, sdd-updates agents only.
  Ideas and features live as GitHub Issues; query/create/update via gh CLI.
  Not user-invokable.
disable-model-invocation: true
---

# SDD GitHub Planning

**Ideas** and **features** are **GitHub Issues** in the project repo. Specs stay in `docs/specs/`.

Features = WHAT to build. Specs = HOW to build it. Local `docs/features/` is legacy fallback only unless a repo explicitly enables `legacy_docs_fallback: true`.

## Pipeline

1. Idea issue: `sdd:idea` + `sdd:status:backlog`.
2. Feature issue: `sdd:feature` + `sdd:status:draft` or `sdd:status:ready`.
3. Spec files: one `docs/specs/MMDDYY_short-description.md` per feature Spec Queue row.
4. Implement + validate specs.
5. User sign-off.
6. Archive completed specs.
7. Complete feature issue: `sdd:status:complete` + closed.

Promotion creates a **new feature issue**. Never mutate an idea issue into a feature issue.

## Config (per repo)

Path: `docs/automation/github-planning.json`

Resolve `repository` at runtime if empty:

```bash
gh repo view --json nameWithOwner -q .nameWithOwner
```

Template: **sdd-workflow-setup** -> `automation/github-planning.template.json`.

## Labels (bootstrap once per repo)

```bash
REPO="<owner>/<name>"
for L in "sdd:idea" "sdd:feature" "sdd:status:backlog" "sdd:status:draft" "sdd:status:ready" "sdd:status:in-progress" "sdd:status:complete" "sdd:status:promoted"; do
  gh label create "$L" --repo "$REPO" --color "0E8A16" --force 2>/dev/null || true
done
```

| Label | Meaning |
|-------|---------|
| `sdd:idea` | Backlog idea issue |
| `sdd:feature` | Feature (WHAT) issue |
| `sdd:status:backlog` | Idea not yet promoted |
| `sdd:status:draft` | Feature draft / not ready for specs |
| `sdd:status:ready` | Feature can spawn next spec |
| `sdd:status:in-progress` | Active spec(s) reference this feature |
| `sdd:status:complete` | Feature done - all specs archived and signed off |
| `sdd:status:promoted` | Idea closed after promotion to feature |

Every planning issue has **exactly one** `sdd:idea` or `sdd:feature` label and **exactly one** `sdd:status:*` label.

## Issue reference format

Canonical: `github:owner/repo#123`

Handoffs may also pass `github_issue: 123` when `repository` is in config.

Parse frontmatter from issue **body** (YAML between `---` lines). Required keys:

| Key | Idea | Feature |
|-----|------|---------|
| `sdd_type` | `idea` | `feature` |
| `sdd_id` | `001` (3-digit queue) | `001` |
| `priority` | `001` | `001` |
| `status` | `backlog` or `promoted` | `Draft` \| `Ready` \| `In Progress` \| `Complete` |

Feature-only required keys: `spec_id`, `source_issue`, `git_base_branch`, `active_spec_branch`, `estimated_tokens`, `tokens_used`, `token_variance`, `created`, `last_updated`, `dependencies[]`.

## Issue title convention

```text
[IDEA-001] Short title
[FEAT-001] Short title
```

`NNN` in title must match `sdd_id` in body frontmatter. Use `[FEAT-NNN]`, not `[FEATURE-NNN]`.

## Feature body sections

Feature issue body must use this order:

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

Labels mirror status: `status: Ready` means issue has `sdd:status:ready` and no other `sdd:status:*` label. After feature validation passes with `total_confidence >= 99`, `sdd-updates mark_ready` performs this status change automatically.

## Body templates

- Idea: [idea-issue-template.md](idea-issue-template.md)
- Feature: [feature-issue-template.md](feature-issue-template.md)

## gh CLI commands

Set `REPO` from config. **Never** read issue comments unless handoff says `include_comments: true`.

### List earliest promotable idea

```bash
gh issue list --repo "$REPO" --label "sdd:idea" --label "sdd:status:backlog" \
  --state open --json number,title,body,labels --limit 100 \
  | jq 'sort_by(.body | capture("sdd_id: \"(?<id>[0-9]+)\"")? // {id:"999"} | .id | tonumber) | .[0]'
```

Fallback sort: parse `[IDEA-NNN]` from title ascending.

### List next Ready feature (lowest NNN, deps met)

```bash
gh issue list --repo "$REPO" --label "sdd:feature" --label "sdd:status:ready" \
  --state open --json number,title,body --limit 100
```

Filter in agent: parse `sdd_id`, verify `dependencies` (each ref must be `sdd:status:complete` on linked feature issue). Pick lowest `sdd_id` with a pending Spec Queue row.

### View issue (source of truth)

```bash
gh issue view 42 --repo "$REPO" --json number,title,body,labels,state,url
```

### Create idea

```bash
gh issue create --repo "$REPO" \
  --title "[IDEA-001] Title" \
  --label "sdd:idea,sdd:status:backlog" \
  --body-file /path/to/body.md
```

### Create feature (from idea)

```bash
gh issue create --repo "$REPO" \
  --title "[FEAT-001] Title" \
  --label "sdd:feature,sdd:status:ready" \
  --body-file /path/to/body.md
```

Use `sdd:status:draft` instead of `ready` only when open questions, dependencies, or validation failures remain.

Required feature fields:

```yaml
sdd_type: feature
sdd_id: "001"
priority: "001"
spec_id: "001"
status: Ready
source_issue: 12
```

Add source note in body:

```markdown
Promoted from idea [github:owner/repo#12](https://github.com/owner/repo/issues/12).
```

### Promote source idea after feature validation

Do this only after the feature issue exists and passes format validation.

1. Keep source title as `[IDEA-NNN] ...`.
2. Keep source issue label `sdd:idea`.
3. Update source body frontmatter to `status: promoted`.
4. Replace `sdd:status:backlog` with `sdd:status:promoted`.
5. Close source issue with comment `Promoted to feature #N`.

```bash
gh issue edit 12 --repo "$REPO" --remove-label "sdd:status:backlog" --add-label "sdd:status:promoted"
gh issue close 12 --repo "$REPO" --reason completed --comment "Promoted to feature #43"
```

### Link active spec branch

Before spec authoring, create and push `feature/<spec-slug>` from `ai-workflow`, then update the parent feature body:

```yaml
active_spec_branch: feature/<spec-slug>
```

Also add/update the `Spawned Specs` row with the branch URL:

```markdown
| docs/specs/MMDDYY_short-description.md | feature/<spec-slug> | Draft | https://github.com/owner/repo/tree/feature/<spec-slug> | Active |
```

Agents must use this branch for all work on that spec until it is merged into `ai-workflow` and deleted.

### Update feature status / body

```bash
gh issue edit 43 --repo "$REPO" --body-file /path/to/body.md
gh issue edit 43 --repo "$REPO" --remove-label "sdd:status:draft" --add-label "sdd:status:ready"
```

Always sync frontmatter `status` when changing status labels.

### Complete feature (all specs archived + validation/PR merge recorded)

```bash
gh issue edit 43 --repo "$REPO" --remove-label "sdd:status:in-progress" --add-label "sdd:status:complete"
gh issue close 43 --repo "$REPO" --reason completed
```

### Next `sdd_id` for ideas or features

For the next idea, list all open+closed issues with label `sdd:idea`, parse max idea `sdd_id`, add 1, zero-pad to 3 digits.

For the next feature, list all open+closed issues with label `sdd:feature`, parse max feature `sdd_id`, add 1, zero-pad to 3 digits.

Do not reuse source idea ID unless the project policy explicitly wants feature IDs to mirror ideas.

## docs/README.md queue requirement

Root `docs/README.md` must expose open SDD planning queues:

- Idea Queue: open issues labeled `sdd:idea` + `sdd:status:backlog`.
- Feature Queue: open issues labeled `sdd:feature`, with status and next action.

Do not point Feature Queue at `docs/features/` except as legacy fallback.

## Coordinator queries (sdd-loop)

| Priority | Query |
|----------|-------|
| Ready tasks | Unchanged - `docs/specs/` |
| Ready feature -> spec | Lowest Ready feature issue with dependencies Complete and pending Spec Queue row |
| Idea -> feature | Earliest backlog idea issue |

Store active pointers in `active_work.json`:

```json
{
  "activeIdeaIssue": "github:owner/repo#12",
  "activeFeatureIssue": "github:owner/repo#43"
}
```

## Spec / manifest linkage

Spec branch:

```text
feature/<spec-slug>
```

Spec frontmatter:

```yaml
parent_feature: github:owner/repo#43
github_feature_issue: 43
git_spec_branch: feature/spec-slug
```

`manifest.json`:

```json
"parent_feature": "github:owner/repo#43",
"git_spec_branch": "feature/spec-slug"
```

**sdd-create-spec** Required Context: parent feature body fetched via `gh issue view` - never use repo paths for features.

## Token efficiency

- Coordinator: `gh issue list --json number,title,labels` - no folder walks.
- Feature/spec creation: fetch issue body only for selected source/parent.
- **Never** load full issue comment threads by default.

## Agents that load this skill

| Agent | Use |
|-------|-----|
| **sdd-loop** | Coordinator queries, handoff `github_issue` fields |
| **sdd-docs** | create_idea, create_feature, revise_draft on issues |
| **sdd-validation** | feature + spec validation - fetch parent/source issues |
| **sdd-updates** | Close/label feature issue on archive; token budget sync in issue body |

## Prerequisites

- `gh` CLI authenticated (`gh auth status`).
- `docs/automation/github-planning.json` present, or repo resolved with `gh repo view` when config is missing during migration.
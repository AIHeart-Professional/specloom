---
name: specloom-work-creator-create-spec
description: >-
  INTERNAL — specloom-work-creator agent only. Author docs/specs/ with Required Context. Not user-invokable.
disable-model-invocation: true
---

# SDD Create Spec

Creates **low-level HOW** specs from **high-level WHAT** features. **One spec = one Spec Queue row.**

## Critical Rules

1. **Parent required:** `parent_feature: docs/features/NNN_short-description.md`
2. **Required Context:** explicit path table — **only** docs subagents may read
3. **No extra context:** if not in Required Context, subagents do not load it
4. **Task Directives:** Language, Code Standards, Image Files, Asset Files, Source Files per task
5. **Subset rule:** every Task Code Standards + Image/Asset path must appear in Required Context
6. **Code docs:** `docs/code/<lang-or-topic>/CORE.md` mandatory per language; add specific files only when needed (e.g. `docs/code/react/theme-styling.md`)
7. **Changes:** append file-level change log during implementation — required for sign-off
8. **Sign-off:** user confirms after reviewing Changes before archive
9. **`spec_id`:** 3-digit from parent feature `NNN` (e.g. `014`) — used in git branch `task/014-001-slug`
10. **Task slug:** each task block includes kebab slug ? branch `task/{spec_id}-{task_seq}-{slug}`
11. **Token Budget (required):** set `estimated_tokens` + per-task estimates at creation; at sign-off set `tokens_used`, compute `token_variance`; sum tasks into spec totals
12. **Work Records path:** `docs/specs/work-records/SPEC-{spec_id}/` — populated after **specloom-validator** passes (not at spec creation)

Git base branch: **`ai-workflow`**. See `docs/automation/git-workflow.md`.

## Token Budget rules

| When | Action |
|------|--------|
| Spec created | Fill **Token Budget** + frontmatter `estimated_tokens`; estimate each task row |
| Task completes | Set task **Used**; add task `tokens_used` from agent Result |
| Spec sign-off | Sum task Used ? spec **Tokens used**; compute **Variance**; sync frontmatter |
| Spec archived | **sdd-records-keeper** rolls spec totals into parent feature **Per-spec rollup** |

Variance formula: **`token_variance = tokens_used - estimated_tokens`**.

Reject sign-off if Token Budget has `_pending_` Used or Variance.

## Required Context rules

List **only** paths needed for this spec. Allowed locations:

| Location | Example |
|----------|---------|
| `docs/code/` | `docs/code/typescript/CORE.md`, `docs/code/react/theme-styling.md` |
| `docs/architecture/` | `docs/architecture/system_overview.md` |
| `docs/knowledge/` | `docs/knowledge/pitfalls.md` |
| `docs/images/` | `docs/images/auth/login.png` — design/reference image only |
| `docs/images/assets/` | `docs/images/assets/logo.png` — application asset to copy/import/use |
| `docs/workflows/` | `docs/workflows/daily-spec-automation.md` |
| `docs/decisions/` | `docs/decisions/ux.md` |
| `docs/specs/archived/` | prior completed specs |
| Parent feature | `docs/features/NNN_short-description.md` |

Read parent feature file for Spec Queue row + Acceptance Criteria.

Always include parent feature (issue or path). Include repo `docs/code/` extension paths per language used.

**Image directory rule:** `docs/images/assets/**` are application assets to use in the app. Every other `docs/images/**` file is a design/reference image only. Do not treat reference images as shippable assets, and do not treat assets as validation/reference screenshots unless explicitly duplicated/listed as such.

**Do not** list entire folders. **Do not** say "read architecture/" — list exact files.

## Task directive rules

| Field | Rule |
|-------|------|
| **Language** | Programming language for task |
| **Code Standards** | `CORE.md` for that language + additional `docs/code/**/*.md` or none |
| **Image Files** | Design/reference images under `docs/images/**`, excluding `docs/images/assets/**`, or `None` |
| **Asset Files** | Application assets under `docs/images/assets/**` to copy/import/use, or `None` |
| **Source Files** | Repo paths or `None` |

Validate before `Pending`:

- [ ] Required Context table complete — no vague entries
- [ ] Every Task Code Standards path ? Required Context
- [ ] Every Task Image path ? Required Context and is not under `docs/images/assets/` (or None)
- [ ] Every Task Asset path ? Required Context and is under `docs/images/assets/` (or None)
- [ ] Each language has matching `CORE.md` in Required Context
- [ ] Changes section exists (header + empty table OK at creation)
- [ ] Sign-off section present
- [ ] Token Budget section present with estimated tokens + per-task estimates
- [ ] Open Questions section present (empty table OK if none)

## Create Workflow

```
- [ ] Step 1: Pick parent feature — lowest NNN Ready, deps met, next Spec Queue row
- [ ] Step 2: Read parent feature
- [ ] Step 3: Search docs/decisions/ — no duplicate questions
- [ ] Step 4: Decide exact Required Context paths (minimal set)
- [ ] Step 5: Build Task Directives — subsets of Required Context
- [ ] Step 6: Filename MMDDYY_short-description.md
- [ ] Step 7: Fill spec-template.md
- [ ] Step 8: Validate subset rule + directive completeness
- [ ] Step 9: Update parent feature Spawned Specs
- [ ] Step 10: Pending + docs/README.md Active Specs
```

## During implementation

- Append **Changes** row per file touched: Date, Task ID, File, What changed
- Update task checkboxes
- Do not add Required Context paths mid-flight without user approval + spec update
- Subagents return `changes` in Result ? sdd-records-keeper merges into spec **Changes**

## On Complete

1. Sign-off checkboxes + Reviewed by + date
2. Token Budget finalized (`tokens_used`, `token_variance`, per-task Used)
3. Status ? Complete
4. sdd-records-keeper archives ? `docs/specs/archived/` + parent feature rollup
5. Update `docs/knowledge/changelog.md`

## Related

- Features: **specloom-work-creator-create-feature**
- Execute via **specloom-work-creator** ? **specloom-work-creator** (this skill).
- Structure: **specloom-work-creator-docs-structure**

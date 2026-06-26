---
name: technical-writer-docs-planning
description: >-
  INTERNAL — sdd-workflow-coordinator, sdd-technical-writer, sdd-qa-tester,
  sdd-records-keeper. Query and allocate docs/ideas and docs/features. Not user-invokable.
disable-model-invocation: true
---

# SDD Docs Planning (ideas + features)

**Ideas** and **features** live as **markdown files** in the repo. Specs stay in `docs/specs/`.

| Layer | Path | Status values |
|-------|------|---------------|
| **Idea** | `docs/ideas/NNN_short-description.md` | `backlog` → promoted to `docs/ideas/archived/` |
| **Feature** | `docs/features/NNN_short-description.md` | `Draft`, `Ready`, `In Progress`, `Complete` → `docs/features/archived/` |
| **Spec** | `docs/specs/MMDDYY_*.md` | `Pending` → `docs/specs/archived/` |

## Paths

```
docs/ideas/
docs/ideas/archived/
docs/features/
docs/features/archived/
```

## Next ID (3-digit NNN)

Scan **both** active and `archived/` folders for the prefix. Parse leading `NNN` from filenames. Next = max + 1, zero-pad to 3 digits.

Examples: `001_better-discovery.md`, `014_auth-system.md`.

## Ideas (optional inbox)

`docs/ideas/` is **optional**. Automations and coordinator **do not** read or promote ideas.

**Manual promotion only:** user asks **sdd-project-lead** → `feature_definition` workflow or **sdd-technical-writer** `create_feature` with `source: docs/ideas/NNN_*.md`.

## Feature queue

**Ready feature** = file in `docs/features/` with frontmatter `status: Ready`.

**Next for spec creation:**

1. Lowest `priority` / NNN among `status: Ready`
2. All **Dependencies** feature IDs are `Complete` (archived under `docs/features/archived/`)
3. **Spec Queue** has a pending row

## Promotion (idea → feature)

**Never convert the idea file in place.**

1. Read source `docs/ideas/NNN_slug.md`
2. Create **new** `docs/features/NNN_slug.md` (same NNN or next feature NNN per queue rules — use same NNN when 1:1 promotion)
3. Set feature `source_idea: docs/ideas/NNN_slug.md`
4. Move idea to `docs/ideas/archived/NNN_slug.md`; set `status: promoted`
5. Update `docs/README.md` Idea Queue + Feature Queue tables

## Feature complete

1. All Acceptance Criteria checked
2. All spawned specs in `docs/specs/archived/`
3. Token Budget actuals filled
4. **sdd-records-keeper** sets `status: Complete`, moves file to `docs/features/archived/`

## active_work.json fields

| Field | Example |
|-------|---------|
| `activeIdea` | `docs/ideas/001_better-discovery.md` |
| `activeFeature` | `docs/features/014_auth-system.md` |

Do not use `activeIdeaIssue` / `activeFeatureIssue` (deprecated).

## docs/README.md queues

Agent maintains:

- **Idea Queue** — backlog ideas in `docs/ideas/`
- **Feature Queue** — active features in `docs/features/` with status + next action
- **Active Specs** — `docs/specs/` Pending files

## Handoff path references

Use repo paths in Handoffs — not `github:owner/repo#N`:

```yaml
source: docs/ideas/001_better-discovery.md
parent_feature: docs/features/014_auth-system.md
draft: docs/features/014_auth-system.md
```

## Related skills

- **technical-writer-create-idea** — author idea files
- **technical-writer-create-feature** — author feature files
- **technical-writer-create-spec** — author specs from feature Spec Queue

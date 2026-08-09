---
name: specloom-tracker-github
description: >
  INTERNAL — specloom-project-manager. GitHub Issues adapter: sub-issues, issue types,
  dependencies, stage labels. Loaded only when the Overview says tracker is github.
  Not user-invokable.
disable-model-invocation: true
---

# GitHub adapter

Implements the operations in **specloom-tracker**. Loaded only when `tracker: github`.

## Requires

`gh` CLI **2.94.0 or later** — that is the version that added `--type`, `--parent`,
`--blocked-by` and `--blocking`. Check once per session:

```bash
gh --version
gh auth status
```

Older `gh` → report the version and stop. Do not emulate parents with body text and call it a
hierarchy.

## Mapping

| SpecLoom | GitHub |
|----------|--------|
| product | repository (`tracker_ref` = `owner/repo`) |
| Overview | issue typed `Overview`, pinned |
| Phase | issue typed `Phase`, parent of its Briefs |
| Brief | issue typed `Brief`, `--parent <phase>` |
| `brief_key` | `GH-<number>` |
| stage | `specloom:*` label — GitHub has only open/closed |
| `depends_on` | body block **and** native `--blocked-by` |
| Done | closed as `completed` |
| abandoned | closed as `not_planned` |

## Issue types, and the fallback

Issue types are configured at the **organization** level. A personal repository cannot define
them.

| Situation | Behaviour |
|-----------|-----------|
| Org repo with `Overview` / `Phase` / `Brief` types defined | use `--type` |
| Org repo, types not yet defined | create them once, record it on the Overview |
| Personal repo | fall back to labels `specloom:overview` / `:phase` / `:brief` |

The fallback is a real degradation — the hierarchy still works through `--parent`, but Projects
hierarchy view groups by type, so a personal repo loses that view. Say which mode is active in
`create_overview`'s result rather than letting the difference surface later as a puzzle.

## Commands

```bash
# Overview
gh issue create --repo <owner/repo> --title "Overview: <product>" \
  --type Overview --body-file overview.md
gh issue pin <n> --repo <owner/repo>

# Phase — numbered from P0 (naming: specloom-planning)
gh issue create --repo <owner/repo> --title "Phase P0: <name>" \
  --type Phase --body-file phase.md

# Brief, parented to its Phase — P<phase>-<i>: work item i in that Phase
gh issue create --repo <owner/repo> --title "P0-1: <brief title>" \
  --type Brief --parent <phase-number> --body-file brief.md \
  --label specloom:backlog

# dependencies — mirror the body block into native relations
gh issue edit <n> --repo <owner/repo> --add-blocked-by <m>
gh issue edit <n> --repo <owner/repo> --remove-blocked-by <m>

# stage
gh issue edit <n> --repo <owner/repo> \
  --remove-label specloom:backlog --add-label specloom:ready

# read
gh issue view <n> --repo <owner/repo> --json number,title,body,labels,state,stateReason
gh issue list --repo <owner/repo> --label specloom:brief --state open \
  --json number,title,body,labels --limit 200

# done
gh issue close <n> --repo <owner/repo> --reason completed
```

Always pass `--repo`. The agent's working directory is a product repo, a docs repo, or a
worktree, and a bare `gh issue` picks up whichever remote it lands next to.

## Stages

Exactly one `specloom:` stage label at a time. Remove the old one in the **same** `gh issue edit`
call as the add — two calls leave a window where a Brief has two stages, and a concurrent
`list_briefs` will see it.

| Stage | Label | Issue state |
|-------|-------|-------------|
| backlog | `specloom:backlog` | open |
| ready | `specloom:ready` | open |
| building | `specloom:building` | open |
| testing | `specloom:testing` | open |
| validating | `specloom:validating` | open |
| done | no stage label | closed as `completed` |

Create the label set once at `create_overview`, with colours, so a human reading the issue list
can see the pipeline.

## Dependencies

Write both:

1. The `## Queue` body block — portable, and what the queue algorithm actually reads
2. Native `--blocked-by` — what a human sees in the GitHub UI

Where they disagree, **the body block wins** and the mismatch is reported. The body is the
contract; native relations are a rendering of it. Do not read the queue from native relations —
a human editing them in the UI would silently reorder the plan.

## Rate limits

REST allows 5,000 requests/hour authenticated, and issue **creation** is more tightly limited
than reads. Bootstrapping a Phase of twenty Briefs is well inside it; a tight polling loop is
not. Batch reads with `gh issue list --json` rather than fetching issues one at a time.

On a `403` naming a secondary rate limit, stop and report the reset time. Never spin.

## What GitHub does not have

| Missing | Consequence |
|---------|-------------|
| Workflow states | labels carry stage — already the SpecLoom default |
| A "Cancelled" distinct from "Done" | `not_planned` on close |
| Project-level documents | the Overview issue body **is** the document; the docs repo mirrors it |
| Estimates and cycles | not used by SpecLoom |

Nothing SpecLoom depends on is absent. The queue block, stage labels and parent links cover the
whole contract.

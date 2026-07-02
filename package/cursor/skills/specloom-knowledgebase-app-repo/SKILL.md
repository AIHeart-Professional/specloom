---
name: specloom-knowledgebase-app-repo
description: >-
  INTERNAL — specloom-update-knowledgebase only. Rules for updating application repo documentation.
  Not user-invokable.
disable-model-invocation: true
---

# Knowledgebase — Application Repository

Use when `target_repo: app` or `both`.

## Editable paths

| Path | Purpose |
|------|---------|
| `AGENTS.md` | Build/test commands when spec requires new commands |
| `docs/code/**` | Project-specific code standards extensions |
| `README.md` | User-facing setup changes from spec |
| Inline code comments | Only when spec task explicitly requires |

## Do not edit

- Application source unless delegated via implementation pipeline
- `.env`, secrets, credentials

## sync_knowledge action

After implementation + tests:
1. Extract durable patterns → `docs/knowledge/` in docs repo (via cross-repo handoff if split)
2. Update `AGENTS.md` if new test/lint commands were added during tester loop
3. Note breaking changes in spec Changes table (docs repo skill handles spec file)

## Monorepo

When docs and app share one repo, combine with **specloom-knowledgebase-docs-repo** in single pass.

## Split repos

Handoff may include:
```yaml
docs_repo_root: /path/to/docs-repo
app_repo_root: /path/to/app-repo
```

Edit each root per its skill. Return `files[]` with repo prefix in summary.

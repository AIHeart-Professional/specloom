---
name: specloom-resolve-work
description: >
  INTERNAL — v2 peers. Resolve Overview/Phase/Brief from Linear + git. Not user-invokable.
disable-model-invocation: true
---

# Resolve work

## Algorithm

1. Linear MCP required. Fail if missing.
2. If peer is **specloom-init**: bootstrap mode — no Phase/Issue required.
3. If user names Issue key → that work Brief.
4. Else find **one** Issue status ∈ {Building, Testing, Validating}. Prefer label `brief`.
5. If peer is **specloom-brief** and no in-flight Issue: use Overview + active Phase (`In Progress`).
6. Load work Brief body + Phase Document. Load Overview if Phase unclear.
7. Branch: linked PR → its branch; else `task/<KEY>-<slug>`; else from `ai-workflow`.
8. Tasks: unchecked = remaining. Checked → verify git before skip.
9. `standards_ref` from Brief or workspace pin (**specloom-standards-fetch**).

## no_work

- No matching Brief for build/test/validate state
- Status `Done` / `Blocked` without user override
- Multiple in-flight without disambiguation → ask once, stop
- specloom-brief with no Overview → tell user `@specloom-init`

## Output pointers (internal)

```
brief_key, phase_project, overview_id, branch, open_tasks[], standards_root, standards_ref
```

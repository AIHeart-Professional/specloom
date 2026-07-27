---
name: specloom-linear-team
description: >
  INTERNAL — specloom-planner / brief. Ensure one Linear Team per product (not default
  Specloom meta-team). Create via GraphQL if MCP lacks teamCreate. Not user-invokable.
disable-model-invocation: true
---

# Per-product Linear team

## Rule

**Every product** gets its own Linear **Team**.  
Do **not** put app Overview / Phase / Briefs on the meta team **Specloom** (except when the product *is* SpecLoom itself).

| SpecLoom | Linear |
|----------|--------|
| Product | **Team** (name + key) |
| Overview | Project `Overview — {Product}` on that team (+ Document) |
| Phase | Project `P0 — …` on that team (+ Document) |
| Brief | Issue on that team (`{KEY}-n`) |

(Initiative optional later if MCP/API adds it; Project Overview is SoT until then.)

## When

Init **before** creating Overview / Phases / Briefs.  
Brief peer: verify active Overview’s team; never silently fall back to Specloom.

## Derive

From product name:

| Field | Rule |
|-------|------|
| `team_name` | Product display name (e.g. `Budget Tracker`) |
| `team_key` | 2–5 **uppercase** letters, unique in workspace. Prefer consonants acronym (`BUD`, `TRK`). Ask user if collision / ambiguous |

Record on Overview:

```
# Linear
team_name: …
team_key: …
team_id: …
```

## Ensure algorithm

1. `list_teams` (Linear MCP)  
2. Match by **name** or **key** (case-insensitive name)  
3. If found → use it (`status: existing`)  
4. If missing → **create**:

### Create (MCP has no teamCreate)

Use Linear GraphQL with `LINEAR_API_KEY` (or workspace token available to agent):

```graphql
mutation TeamCreate($input: TeamCreateInput!, $copySettingsFromTeamId: String) {
  teamCreate(input: $input, copySettingsFromTeamId: $copySettingsFromTeamId) {
    success
    team { id name key }
  }
}
```

Variables:

```json
{
  "input": { "name": "<team_name>", "key": "<team_key>" },
  "copySettingsFromTeamId": "<Specloom team id if present>"
}
```

`copySettingsFromTeamId` = Specloom meta-team when available (inherit workflow-ish settings). Still create product labels below.

Shell example (PowerShell):

```powershell
$headers = @{ Authorization = $env:LINEAR_API_KEY; "Content-Type" = "application/json" }
$body = @{ query = $mutation; variables = $vars } | ConvertTo-Json -Depth 8
Invoke-RestMethod -Uri "https://api.linear.app/graphql" -Method POST -Headers $headers -Body $body
```

5. If no API key / mutation denied → **`need_user`**: ask user to create Team in Linear UI with exact name+key, then `list_teams` again  
6. Ensure issue labels on team (MCP `create_issue_label` if missing):  
   `brief`, `frontend`, `backend`, `database`,  
   `specloom:ready`, `specloom:building`, `specloom:testing`, `specloom:validating`, `specloom:backlog`  
7. Return result — **all later Linear writes use this `team`**

## Result

```json
{
  "type": "LINEAR_TEAM_RESULT",
  "status": "ok|need_user|failed",
  "team_id": "",
  "team_name": "",
  "team_key": "",
  "created": false,
  "labels_ensured": [],
  "error": null
}
```

## Downstream

- `save_project` → `setTeams` / `addTeams`: **[team_name]** only  
- `save_issue` → `team`: **team_name** (or id)  
- Issue titles: `{team_key}` prefix optional; Linear assigns `{KEY}-n`  
- Resolve-work / run: filter Issues by this team when Overview lists it  

## Forbidden

- Creating product Briefs on Specloom team “because it’s default”  
- Reusing Specloom for unrelated apps  
- Inventing a second team mid-Phase without Overview update

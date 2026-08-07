---
name: specloom-document
model: inherit
description: >
  SpecLoom Document — universal docs. Docs repo create + type skills. User or main thread.
---

# Document

## Skills — load by condition

| Load | When |
|------|------|
| **specloom-contract** | always, first |
| **document-router** | always — classifies the request and names the type skill |
| **document-repo** | creating or bootstrapping the docs repo itself |
| **document-scan** | filling docs from the app on `ai-workflow` |
| the type skill named by the router | exactly one per request, usually |

Do **not** pre-load the type skills. `document-router` names the one this request needs; that
is its entire purpose.

| Request | Type skill |
|---------|-----------|
| architecture, structure, dependencies | **document-architecture** |
| runtime, integrations, data flow | **document-system** |
| team process, SpecLoom usage | **document-workflow** |
| HTTP / RPC / event reference | **document-api** |
| Brief sync, active and archived specs | **document-spec** |
| UX index, refs, image policy | **document-ux** |
| a decision with alternatives | **document-adr** |
| a feature proposal from discovery | **document-proposal** |
| project or package README | **document-readme** |
| deploy, incident, restore | **document-runbook** |
| release notes | **document-changelog** |
| PR or release body | **document-pr** |


## Allowed Tasks

- **specloom-repository** — push assist only (docs create = `document-repo`)

## Role

Any documentation request. `document-router` picks type skill(s).

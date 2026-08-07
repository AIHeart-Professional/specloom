---
name: document-router
description: >
  INTERNAL — specloom-document. Classify a documentation request and name the one type skill that serves it.
disable-model-invocation: true
---


# Router

Runs first on every Document call. Its output is a **skill name**, not prose.

## Classify

| The request is about | Type skill |
|----------------------|-----------|
| how the system is built — modules, layers, dependencies | **document-architecture** |
| how it runs — services, integrations, env, data flow | **document-system** |
| how the team works — process, SpecLoom usage, conventions | **document-workflow** |
| an interface others call — HTTP, RPC, events | **document-api** |
| a Brief's spec record — active or archived | **document-spec** |
| screens, refs, image policy | **document-ux** |
| a decision, its alternatives and consequences | **document-adr** |
| a feature proposal, its evidence and unknowns | **document-proposal** |
| what this project is and how to start it | **document-readme** |
| an operational procedure — deploy, incident, restore | **document-runbook** |
| what changed in a release | **document-changelog** |
| a PR or release body | **document-pr** |
| filling docs from the code itself | **document-scan** |
| creating the docs repo | **document-repo** |

## Rules

- **One skill per request.** Ambiguity between two means the request is two requests — say so
  and do the first.
- **Never load all of them.** Selecting is this skill's only job; pre-loading defeats it.
- Unmatched → ask one clarifying question. Do not guess at a type and produce the wrong artifact.

## Modes

| Mode | Trigger |
|------|---------|
| **pipeline** | called by the main thread during closeout — spec + changelog, no questions |
| **freeform** | a user asked for a document directly — may ask a clarifying question |

## Output

```json
{ "type_skill": "document-adr", "mode": "freeform", "target": "docs/decisions/0007-queue-order.md" }
```

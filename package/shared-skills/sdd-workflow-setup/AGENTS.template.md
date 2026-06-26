# Agent Rules

Respond concisely. Minimize tokens.

## SDD

Spec execution via user-level **sdd-orchestrator** -> **sdd-loop** + sub-agents.

This file: **project commands** + repo pointers only.

## Planning

- Ideas live as GitHub Issues labeled `sdd:idea`.
- Features live as GitHub Issues labeled `sdd:feature`.
- Specs live in `docs/specs/`.
- Do not use local `docs/features/` unless `legacy_docs_fallback: true` is explicitly enabled.
- Promoting an idea creates a new `[FEAT-NNN]` issue; source `[IDEA-NNN]` becomes `sdd:status:promoted` and closes.

## Project pointers

- Read `docs/README.md` before work.
- Active specs: `docs/specs/`.
- Feature Queue: GitHub Issues labeled `sdd:feature`.
- Idea Queue: GitHub Issues labeled `sdd:idea` + `sdd:status:backlog`.
- Automation: `docs/automation/` - base branch **`ai-workflow`**, one spec branch `feature/<spec-slug>` created before spec authoring and deleted after PR merge.
- Git: always merge signed-off tasks into **`ai-workflow`**.
- UX/reference images: `docs/images/` excluding `docs/images/assets/`.
- Application image assets: `docs/images/assets/`.
- Language rules: `docs/code/<lang>/CORE.md` (mandatory before lang edits).
- Decisions: `docs/decisions/` - search before asking clarifying questions.
- Knowledge: `docs/knowledge/` - app memory only, not agent rules.

## Knowledge boundary

`docs/knowledge/` = durable product/implementation memory. No agent operating rules.

## Project Commands

<!-- Replace after scaffolding -->

Build:

```bash
# Example: npm run build
```

Test:

```bash
# Example: npm test
```

Dev:

```bash
# Example: npm run dev
```
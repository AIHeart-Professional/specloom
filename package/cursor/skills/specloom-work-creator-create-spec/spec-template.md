# Short Description

date: MM-DD-YYYY
status: Pending
parent_feature: docs/features/NNN_short-description.md
spec_id: "014"
spec_queue_row: 1
layers: frontend, backend, database
parallel: no
estimated_tokens: 0
tokens_used: null
token_variance: null

## Goal

- What this spec accomplishes and **why** now
- User/business impact
- Measurable success criteria

## Required Context

> **Only these doc paths may be read for this spec.** Subagents load **nothing else**.
> Every path in Task Directives must appear here. If not listed, do not read it.

| Path | Purpose |
|------|---------|
| `docs/features/NNN_short-description.md` | Parent feature (WHAT) |
| `docs/architecture/system_overview.md` | System boundaries |
| `docs/code/typescript/CORE.md` | Language rules (mandatory per language used) |
| `docs/code/react/theme-styling.md` | Styling rules — example optional code doc |
| `docs/images/auth/login-form.png` | Design/reference image |
| `docs/images/assets/logo.png` | Application asset to copy/import/use |
| `docs/knowledge/pitfalls.md` | Known traps |
| `docs/specs/archived/MMDDYY_prior-spec.md` | Prior related work |

Allowed sources: `docs/code/`, `docs/architecture/`, `docs/knowledge/`, `docs/images/` (design refs, except `docs/images/assets/` app assets), `docs/workflows/`, `docs/decisions/`, `docs/specs/archived/`, parent feature (GitHub issue).

**Not listed = do not read.**

## Requirements

### Functional

- Detailed behavior the feature must implement
- User flows and edge cases

### Data

| Entity | ID | Fields | Notes |
|--------|-----|--------|-------|
| entityName | UUID | field: type | purpose |

Data flow: user action ? API ? persistence ? client state

### API / Interface

| Endpoint | Method | Request | Response | Errors |
|----------|--------|---------|----------|--------|
| `/path` | POST | `{}` | `{}` | 400, 401, 404 |

### Security

- Auth, authz, validation, sensitive data handling

## Task Directives

> Every task: Language, Code Standards (CORE.md + listed code docs), Image Files, Asset Files, Source Files.
> Code Standards + Image Files + Asset Files must be **subsets of Required Context** above.
> `docs/images/assets/**` are app assets. Other `docs/images/**` files are design/reference images.

| ID | Task | Layer | Language | Code Standards | Image Files | Asset Files | Source Files |
|----|------|-------|----------|----------------|-------------|-------------|--------------|
| T1 | Example: style login form | frontend | typescript | `docs/code/typescript/CORE.md`, `docs/code/react/theme-styling.md` | `docs/images/auth/login-form.png` | `docs/images/assets/logo.png` | `src/components/auth/LoginForm.tsx` |
| T2 | Example: add login API | backend | python | `docs/code/python/CORE.md` | `None` | `None` | `src/routes/auth/login.py` |

### Task checklist

#### T1: Style login form

- **Layer:** frontend
- **Language:** typescript
- **Task slug:** filter-model
- **Git branch:** `task/014-001-filter-model` (derived: spec_id + task seq + slug)
- **Code standards:**
  - `docs/code/typescript/CORE.md`
  - `docs/code/react/theme-styling.md`
- **Image files:**
  - `docs/images/auth/login-form.png`
- **Asset files:**
  - `docs/images/assets/logo.png`
- **Source files:**
  - `src/components/auth/LoginForm.tsx`
- [ ] Read only Required Context + this task's Code Standards, Image Files, and Asset Files
- [ ] Implement per Requirements
- [ ] Run Validation commands
- [ ] Append rows to **Changes** section

#### T2: Add login API

- **Layer:** backend
- **Language:** python
- **Code standards:**
  - `docs/code/python/CORE.md`
- **Image files:** None
- **Asset files:** None
- **Source files:**
  - `src/routes/auth/login.py`
- [ ] Read only Required Context + this task's Code Standards
- [ ] Implement per Requirements
- [ ] Run Validation commands
- [ ] Append rows to **Changes** section

## Changes

> **Manual review log.** Append each session. Required before sign-off.

| Date | Task | File | What changed |
|------|------|------|--------------|
| MM-DD-YYYY | T1 | `src/example.tsx` | Example — replace with actual changes |

## Token Budget

> **Required on every spec.** Set estimate at creation; record actual at sign-off before archive.

| Metric | Value | Notes |
|--------|-------|-------|
| **Estimated tokens** | 0 | Expected agent cost for all tasks in this spec |
| **Tokens used** | _pending_ | Actual total when work completes |
| **Variance** | _pending_ | `tokens_used - estimated_tokens` (positive = over budget) |

### Per-task breakdown

> Update **Used** after each task completes. Spec **Tokens used** = sum of task Used.

| Task | Estimated | Used | Variance |
|------|-----------|------|----------|
| T1 | 0 | _pending_ | _pending_ |
| T2 | 0 | _pending_ | _pending_ |

**Estimation guidance:** task count, layers, source file count, Required Context size, validation complexity.

## Validation

### Commands

```bash
# project build/test from AGENTS.md
```

### Test coverage

| Type | Why | Where | How |
|------|-----|-------|-----|
| Unit | Isolate logic | path | cases |
| Integration | Layer wiring | path | API flows |
| E2E/UAT | User workflow | local | steps matching Image Files |

### Rollback

- Fallback branch / revert plan before merge
- DB: additive migrations; document reverse if needed

## Open Questions

| Date | Question | Answer |
|------|----------|--------|
| MM-DD-YYYY | Example — unresolved scope choice | _Pending_ |

> Shown on review card before user sign-off. Answer in chat or leave default noted in review.

## Sign-off

> Spec cannot archive until sign-off complete.

- [ ] All task checklists complete
- [ ] **Changes** section accurate and reviewed
- [ ] **Token Budget** finalized (Used, Variance — no `_pending_`)
- [ ] Validation commands passed
- [ ] User confirmed Complete

| Field | Value |
|-------|-------|
| Reviewed by | |
| Signed off | MM-DD-YYYY |
| Notes | |

## Completion Status

- Last Updated: MM-DD-YYYY
- Updated By: cursor | user | codex
- Owner:
- Status: Inactive | Pending | Complete
- Token Budget: see **Token Budget** section (required)
- Work Records: `docs/specs/work-records/SPEC-{spec_id}/` (written after testing passes)

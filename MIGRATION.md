# SDD → SpecLoom Migration Guide

## Agent rename map

| Old (`sdd-*`) | New (`specloom-*`) | Notes |
|---------------|-------------------|-------|
| `sdd-project-lead` | `specloom-implement` | Implementation orchestrator only — no docs/ideas/features |
| `sdd-workflow-coordinator` | `specloom-worker` | Max 10 loop iterations; dev agents + worker-validation only |
| `sdd-frontend-developer` | `specloom-frontend-developer` | Same contract, new prefix |
| `sdd-backend-developer` | `specloom-backend-developer` | Same contract, new prefix |
| `sdd-database-developer` | `specloom-database-developer` | Same contract, new prefix |
| *(new)* | `specloom-worker-validation` | App runs + doc/spec/feature rules; 0–100 confidence JSON |
| `sdd-qa-tester` (work) | `specloom-validator` | Code quality orchestrator |
| *(new)* | `specloom-standardized-loop` | 3-iteration sub-loop for validators |
| *(new)* | `specloom-frontend-validator` | Domain code quality |
| *(new)* | `specloom-backend-validator` | Domain code quality |
| *(new)* | `specloom-database-validator` | Domain code quality |
| `sdd-qa-tester` (test) | `specloom-tester` | Test suite orchestrator |
| *(new)* | `specloom-test-loop` | 5-iteration sub-loop for test standards |
| *(new)* | `specloom-frontend-test-standards` | Frontend test implementation |
| *(new)* | `specloom-backend-test-standards` | Backend test implementation |
| *(new)* | `specloom-database-test-standards` | Database test implementation |
| `sdd-records-keeper` | `specloom-update-knowledgebase` | Docs sync with per-repo skills |
| `sdd-technical-writer` | **`specloom-work-creator`** | Planning — ideas, features, specs; user-facing |
| `sdd-release-engineer` | **`specloom-git`** | Git sub-agent — branches, push, merge, PR |
| `sdd-system-advisor` | **`specloom-system-advisor`** | Help routing |

## Skill rename map

| Old skill | New skill |
|-----------|-----------|
| `project-lead-protocol` | `specloom-implement-protocol` |
| `workflow-coordinator-loops` | `specloom-worker-loops` |
| `workflow-coordinator-task-execution` | `specloom-worker-task-execution` |
| `workflow-coordinator-validation` | Split → worker-validation + validator + tester skills |
| `qa-tester-work-validation` | `specloom-frontend/backend/database-validator` skills |
| `qa-tester-test-validation` | `specloom-*-test-standards` skills |
| `technical-writer-*` | `specloom-work-creator-*` |
| `records-keeper-work-records` | `specloom-knowledgebase-work-records` |
| release engineer workflow | `specloom-git-workflow` |
| `frontend-developer-*` | `specloom-frontend-developer-*` |
| `backend-developer-*` | `specloom-backend-developer-*` |
| `database-developer-*` | `specloom-database-developer-*` |

## JSON contracts

### WORKER_VALIDATION_RESULT

```json
{
  "type": "WORKER_VALIDATION_RESULT",
  "from": "specloom-worker-validation",
  "status": "pass|fail",
  "confidence_score": 0,
  "app_runs": true,
  "rules_compliance": { "score": 0, "violations": [] },
  "findings": [],
  "tokens_used": 0
}
```

**Pass:** `confidence_score >= 99` AND `app_runs: true`.

### VALIDATION_RESULT (specloom-validator pipeline)

```json
{
  "type": "VALIDATION_RESULT",
  "from": "specloom-validator",
  "status": "pass|fail",
  "confidence_score": 0,
  "layer_scores": { "frontend": 0, "backend": 0, "database": 0 },
  "findings": [],
  "remediation": [],
  "spec_validation_section": null,
  "tokens_used": 0
}
```

**Pass:** `confidence_score >= 99`. On fail, `spec_validation_section` is markdown appended to spec under `## Validation Results`.

### TEST_RESULT (specloom-tester pipeline)

```json
{
  "type": "TEST_RESULT",
  "from": "specloom-tester",
  "status": "pass|fail|no_work",
  "coverage_percent": 0,
  "layers": { "frontend": {}, "backend": {}, "database": {} },
  "findings": [],
  "tokens_used": 0
}
```

**Pass:** `coverage_percent == 100` AND all tests green. **`no_work`** when spec tasks incomplete.

## Workflow changes

### Before (monolithic project lead)

```
sdd-project-lead → sdd-workflow-coordinator → dev agents → sdd-qa-tester(work+test) → sdd-records-keeper
```

### After (separated pipelines)

```
specloom-implement
  → specloom-worker (×10) → dev agents + specloom-worker-validation
  → specloom-validator → specloom-standardized-loop (×3) → domain validators
  → specloom-tester → specloom-test-loop (×5) → test-standards agents
  → specloom-update-knowledgebase
```

## Rules preserved

- **Rule of 3** → per-pipeline iteration caps (worker 10, standardized 3, test 5)
- **JSON only** for sub-agents; **specloom-implement** translates to natural language
- **Git base branch:** `ai-workflow`
- **Confidence bar:** 99 = success for validation gates
- **Test coverage:** 100% on spec work or fail after 5 loops

## Status

Migration complete on branch `task/specloom-agent-migration`. All runtime agents use `specloom-*` prefix. This file is the historical rename reference only.

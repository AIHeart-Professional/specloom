---
name: specloom-implement-protocol
description: >-
  INTERNAL — specloom-worker, specloom-validator, specloom-tester agents only.
  Handoff/Result packets, gate order, iteration caps. Not user-invokable.
disable-model-invocation: true
---

# SpecLoom Implement Protocol

**specloom-implement** never reads this skill directly. Loop agents read it.

Load **specloom-orchestrator-session** for work discovery, no_work, git bookends, spec-over-feature priority.

## Output contract

| Agent | User-facing |
|-------|-------------|
| **specloom-work-creator** | Yes |
| **specloom-implement** | Yes |
| **specloom-validator** | Yes |
| **specloom-tester** | Yes |
| **specloom-git** | Yes |
| **All other specloom-* agents** | **No** — JSON only |

## Independence

Peer orchestrators **never** delegate each other. User runs each step manually.

## User pipeline order (recommended)

```
specloom-work-creator → specloom-implement → specloom-validator → specloom-tester
```

Git bookends: each orchestrator runs **specloom-git-workflow** via shell, or user invokes `@specloom-git`.

## specloom-implement scope only

```
Ready tasks → specloom-worker (≤10) → worker-validation
```

## specloom-validator scope only

```
specloom-standardized-loop (≤3) OR draft-validation skill
```

## specloom-tester scope only

```
specloom-test-loop (≤5)
```

## WORKER_HANDOFF → specloom-worker

```yaml
WORKER_HANDOFF:
  from: specloom-implement
  action: run_until_complete | run_iteration | build_handoff
  session_owner: false
  git_task_branch: task/implement-014-auth-filter
  spec: docs/specs/MMDDYY_name.md
  spec_id: "014"
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json
  max_loop_iterations: 10
  active_work_path: docs/automation/state/active_work.json
```

## IMPLEMENTATION_HANDOFF → domain developers

```yaml
IMPLEMENTATION_HANDOFF:
  from: specloom-implement
  spec: docs/specs/MMDDYY_name.md
  task_id: T1
  layer: frontend | backend | database
  required_context: []
  standards: []
  image_files: []
  asset_files: []
  source_files: []
  parallel_with: null | backend
  fix_instructions: []
```

## WORKER_VALIDATION_HANDOFF → specloom-worker-validation

```yaml
WORKER_VALIDATION_HANDOFF:
  from: specloom-implement
  spec: docs/specs/MMDDYY_name.md
  spec_id: "014"
  parent_feature: docs/features/NNN_name.md
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json
  required_context: []
  standards: []
  attempt: 1
```

## VALIDATOR_HANDOFF → specloom-validator

Called by **specloom-validator** only — never from **specloom-implement** or other peers.

```yaml
VALIDATOR_HANDOFF:
  from: specloom-validator
  validation_mode: draft | implementation
  session_owner: true | false
  git_task_branch: ""   # required when session_owner: false
  draft_type: feature | spec          # when validation_mode: draft
  source: docs/ideas/001_slug.md      # feature draft: idea path
  draft: docs/features/014_auth.md    # feature or spec draft path
  parent_feature: docs/features/014_auth.md  # spec draft only
  spec: docs/specs/MMDDYY_name.md     # implementation mode
  spec_id: "014"
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json  # implementation only
  layers: [frontend, backend]
  max_loop_iterations: 3
  attempt: 1
```

## GIT workflow (peer orchestrators)

Peers run **specloom-git-workflow** via shell — **not** `GIT_HANDOFF` to `@specloom-git` agent.

`@specloom-git` is a standalone peer for git-only sessions.

```yaml
GIT_SESSION:
  from: specloom-work-creator | specloom-implement | specloom-validator | specloom-tester | specloom-git
  action: task_start | task_push | merge_to_ai_workflow | open_pr
  session_owner: true | false
  git_base_branch: ai-workflow
  git_task_branch: task/implement-014-auth-filter
  branch_slug: implement-014-auth-filter
  spec_id: "014"
  task_id: T1
  task_slug: filter-model
  spec: docs/specs/MMDDYY_name.md
```

### Session flow (owner)

```
task_start → … work … → task_push → merge_to_ai_workflow
```

Never user-reply between work and merge.

## SESSION_RESULT (no_work)

```json
{"type":"SESSION_RESULT","status":"no_work","no_work_reason":"blocked_spec|no_ready_tasks|tests_passed|awaiting_sign_off","from":"<agent>"}
```

## STANDARDIZED_LOOP_HANDOFF → specloom-standardized-loop

```yaml
STANDARDIZED_LOOP_HANDOFF:
  from: specloom-validator
  spec: docs/specs/MMDDYY_name.md
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json
  layers: [frontend, backend]
  parallel: true
  attempt: 1
  remediation_from_prior: []
```

## DOMAIN_VALIDATION_HANDOFF → specloom-*-validator

```yaml
DOMAIN_VALIDATION_HANDOFF:
  from: specloom-standardized-loop
  layer: frontend | backend | database
  spec: docs/specs/MMDDYY_name.md
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json
  required_context: []
  standards: []
  attempt: 1
```

## TESTER_HANDOFF → specloom-tester

```yaml
TESTER_HANDOFF:
  from: specloom-tester
  session_owner: true | false
  git_task_branch: ""
  spec: docs/specs/MMDDYY_name.md
  spec_id: "014"
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json
  max_loop_iterations: 5
  attempt: 1
```

## TEST_LOOP_HANDOFF → specloom-test-loop

```yaml
TEST_LOOP_HANDOFF:
  from: specloom-tester
  spec: docs/specs/MMDDYY_name.md
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json
  layers: [frontend, backend]
  parallel: true
  attempt: 1
  uncovered_files: []
```

## TEST_STANDARDS_HANDOFF → specloom-*-test-standards

```yaml
TEST_STANDARDS_HANDOFF:
  from: specloom-test-loop
  layer: frontend | backend | database
  spec: docs/specs/MMDDYY_name.md
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json
  target_files: []
  acceptance_criteria: []
  attempt: 1
```

## KNOWLEDGEBASE_HANDOFF → specloom-update-knowledgebase

```yaml
KNOWLEDGEBASE_HANDOFF:
  from: specloom-implement | specloom-tester
  action: task_sync | finalize_work_records | archive_spec | sync_knowledge
  spec_id: "014"
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json
  target_repo: docs | app | both
  repo_skill: specloom-knowledgebase-docs-repo | specloom-knowledgebase-app-repo
  implementation_results: []
  validation_result: {}
  test_result: {}
```

## Iteration caps

| Pipeline | Field | Max |
|----------|-------|-----|
| Worker | `workerLoopIterations` | 10 |
| Standardized | `standardizedLoopIterations` | 3 |
| Test | `testLoopIterations` | 5 |

## Confidence thresholds

| Gate | Pass |
|------|------|
| Draft validation (work-creator) | `confidence_score >= 99`, zero critical |
| Worker validation | `confidence_score >= 99` AND `app_runs: true` |
| Validator (implementation) | `confidence_score >= 99` |
| Tester | `coverage_percent == 100` AND all tests green |

## Spec validation section (on validator fail)

Append to spec under `## Validation Results`:

```markdown
## Validation Results

**Status:** fail
**Confidence:** {score}/100
**Attempt:** {n}/3

### Issues
1. [{layer}] {file} — {issue} → {remediation}
```

## Default skill_standards per layer

| Layer | Skills |
|-------|--------|
| frontend | specloom-frontend-developer-typescript, specloom-frontend-developer-react, specloom-frontend-developer-react-native |
| backend | specloom-backend-developer-python |
| database | specloom-database-developer-postgres |

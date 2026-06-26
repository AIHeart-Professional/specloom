---
name: project-lead-protocol
description: >-
  INTERNAL — sdd-workflow-coordinator agent only. Handoff/Result packets, gate order, rule of 3.
  Not user-invokable. Not loaded by sdd-project-lead agent.
disable-model-invocation: true
---

# SDD Orchestrator Protocol

**sdd-workflow-coordinator** agent reads this skill. **sdd-project-lead** never reads skills directly.

## Output contract (all sub-agents)

| Agent | User-facing prose |
|-------|-------------------|
| **sdd-project-lead** | Yes — sole human voice |
| **All other sdd-* agents** | **No** — JSON Results only |

Sub-agent rules:

1. **Entire reply** = one JSON object (optional ` ```json ` fence). No prose, markdown, or tables outside JSON.
2. **Low token** — short keys, omit null/empty fields, no Handoff echo, compress lists.
3. **Access denied** → `{"type":"ACCESS_DENIED","from":"<agent>","reason":"orchestrator_only"}`
4. **sdd-project-lead** parses Results and speaks to the user in natural language — **never forwards raw JSON**.

## Automation / scheduled runs

Cursor Automations invoke **sdd-project-lead** (not **sdd-workflow-coordinator** or other sub-agents directly).

| Step | Who | Output |
|------|-----|--------|
| Automation prompt | User / scheduler | — |
| Entry agent | **sdd-project-lead** | Natural language to user |
| Task delegations | Sub-agents | JSON to project lead only |

If the user sees JSON, the run violated the contract (wrong entry agent, or project lead pasted a Result instead of summarizing).

## Coordinator priority (automation)

1. Task `Ready` → `task_execution`
2. Feature `Ready` (`docs/features/`) → `spec_creation` → **sdd-technical-writer** + **sdd-qa-tester**(`spec`)
3. Else → `idle`

**Ideas:** optional inbox in `docs/ideas/`. **Never** auto-promoted. User → **sdd-project-lead** → manual `feature_definition` (or direct **sdd-technical-writer** `create_feature`).

## Rule of 3

Max **3** per gate. Fail → `incomplete`, `blocked_work.json`, stop.

| Gate | Counter |
|------|---------|
| Draft validation | `draftValidationAttempts` |
| Work validation | `workValidationAttempts` |
| Testing | `testingAttempts` |
| Task retry | `attempts` |

---

## DOCS_HANDOFF → sdd-technical-writer

```yaml
DOCS_HANDOFF:
  from: sdd-project-lead
  action: create_idea | create_feature | create_spec | revise_draft | promote_feature | promote_spec | bootstrap_repo
  source: docs/ideas/001_better-discovery.md   # idea (create_feature / validation)
  parent_feature: docs/features/014_auth-system.md  # feature (create_spec)
  spec_queue_row: 1
  rewrite_instructions: []
```

---

## VALIDATION_HANDOFF → sdd-qa-tester

Single agent for **work**, **test**, **feature**, and **spec** gates.

```yaml
VALIDATION_HANDOFF:
  from: sdd-project-lead
  validation_type: work | test | feature | spec
  attempt: 1
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json  # required: work + test
  spec: docs/specs/MMDDYY_x.md
  spec_id: "014"
  source: docs/ideas/001_better-discovery.md   # idea (feature validation)
  draft: docs/features/014_auth-system.md      # feature (feature validation)
  parent_feature: docs/features/014_auth-system.md  # feature (spec validation)
  required_context: []
  changed_files: []
  image_files: []  # design/reference images; excludes docs/images/assets/**
  asset_files: []  # app assets under docs/images/assets/**
  acceptance_criteria: []
  standards: []
  coverage_waivers: []   # test type only
```

| Type | When | Pass bar |
|------|------|----------|
| `work` | All tasks complete | `total_confidence >= 99`, alignment + quality each >= 98 |
| `test` | After work passes | `total_confidence >= 99`, coverage + test quality each >= 98 |
| `feature` / `spec` | After draft | `coverage_score >= 99`, zero critical → **awaiting_sign_off** (no auto-promote) |

**On feature/spec pass:** **sdd-workflow-coordinator** sets `pendingSignOff` + `stopReason: awaiting_sign_off` + `humanApprovalRequired: true`. **sdd-project-lead** presents review card. **Only after user chat sign-off** → **sdd-technical-writer** `promote_feature` | `promote_spec`.

**On work+test pass:** orchestrator → **sdd-records-keeper** finalize → **auto_closeout_loop** (archive + git, no user sign-off).

---

## UPDATES_HANDOFF → sdd-records-keeper

```yaml
UPDATES_HANDOFF:
  from: sdd-project-lead
  action: task_sync | finalize_work_records | archive_spec
  spec_id: "042"
  manifest_path: docs/specs/work-records/SPEC-042/manifest.json
  implementation_results: []
  validation_result: {}    # finalize: VALIDATION_RESULT (validation_type: test) with test_run
```

---

## HANDOFF → domain agents

```yaml
HANDOFF:
  from: sdd-project-lead
  spec: docs/specs/MMDDYY_name.md
  task_id: T1
  layer: frontend | backend | database
  required_context: []
  standards: []          # repo topic files e.g. docs/code/typescript/react-native-ui.md
  skill_standards: []    # optional override; defaults per layer below
  image_files: []        # design/reference images; excludes docs/images/assets/**
  asset_files: []        # app assets under docs/images/assets/**
  source_files: []
  parallel_with: null | backend
  out_of_scope: []
  fix_instructions: []
```

### Default `skill_standards` (sdd-workflow-coordinator builds if omitted)

| Layer | Skills loaded by domain agent |
|-------|------------------------------|
| frontend | frontend-developer-typescript, frontend-developer-react, frontend-developer-react-native |
| backend | backend-developer-python (+ frontend-developer-typescript if TS backend) |
| database | database-developer-postgres |

Repo `standards` paths are **extensions** only — not duplicates of universal skills.

---

## LOOP_HANDOFF → sdd-workflow-coordinator

```yaml
LOOP_HANDOFF:
  from: sdd-project-lead
  action: run_coordinator | run_until_complete | build_handoff | gate_sequence
  repo_root: .
  active_work_path: docs/automation/state/active_work.json
  max_loop_iterations: 25
  context: {}
```

---

## HELP_HANDOFF → sdd-system-advisor

```yaml
HELP_HANDOFF:
  from: sdd-project-lead
  question: user question verbatim
  topic: agents | skills | workflow | git | validation | null
```

---

## Gate order

```
all Ready tasks (continuous)
  → sdd-qa-tester(work)×3 → sdd-qa-tester(test)×3
  → sdd-records-keeper finalize → auto_closeout (archive + git)
  → coordinator (next work)
```

Draft: **sdd-technical-writer** → **sdd-qa-tester**(feature|spec) → **awaiting_sign_off** → user chat sign-off → promote → continue session.

## User involvement

User: create idea | **sign off feature/spec drafts** | answer open questions in chat | unblock | `needs_user` for unresolved decisions.

Never auto-promote feature/spec after validation pass. Work/test closeout remains automated at ≥99%.

---

## Result schemas (JSON — sub-agents only)

### IMPLEMENTATION_RESULT — frontend | backend | database

```json
{"type":"IMPLEMENTATION_RESULT","from":"sdd-frontend-developer","status":"complete|blocked|incomplete","task_id":"T1","layer":"frontend","summary":"","changes":[{"date":"","task":"T1","file":"","what":""}],"cmds":[{"cmd":"","exit":0}],"doc_updates":[],"user_q":[{"q":"","ctx":"","opts":[]}],"issues":[{"sev":"blocker|warn","msg":"","file":"","tried":""}],"tokens_used":0,"next":null}
```

### VALIDATION_RESULT — sdd-qa-tester

```json
{"type":"VALIDATION_RESULT","from":"sdd-qa-tester","validation_type":"work|test|feature|spec","status":"pass|fail","attempt":1,"alignment_score":0,"quality_score":0,"coverage_score":0,"total_confidence":0,"test_run":null,"findings":[],"rewrite_instructions":[],"remediation":{"layer":"","files":[],"issues":[]},"user_q":[],"tokens_used":0}
```

`test_run` populated when `validation_type: test` (unit, integration, e2e, cov_total, regression).

### DOCS_RESULT — sdd-technical-writer

```json
{"type":"DOCS_RESULT","from":"sdd-technical-writer","action":"create_spec","status":"complete|blocked","files":[],"summary":"","sign_off_summary":"","estimated_tokens":0,"task_token_estimates":[],"open_questions":[],"user_q":[],"needs_user":false,"tokens_used":0}
```

`sign_off_summary` = 2–4 sentence plain-language scope for project lead review card. `open_questions` = `[{"id":"Q1","question":"","default_if_unanswered":""}]` from draft Open Questions + unresolved `user_q`. `task_token_estimates` = `[{"task_id":"T1","estimated_tokens":0}]` for specs.

### UPDATES_RESULT — sdd-records-keeper

```json
{"type":"UPDATES_RESULT","from":"sdd-records-keeper","status":"complete|blocked","files":[],"summary":"","user_q":[],"needs_user":false,"tokens_used":0}
```

### GITHUB_RESULT — sdd-release-engineer

```json
{"type":"GITHUB_RESULT","from":"sdd-release-engineer","status":"complete|blocked","base":"ai-workflow","branch":"","commit":"","push":"pushed|failed","merged":false,"issues":[],"tokens_used":0}
```

### LOOP_RESULT — sdd-workflow-coordinator

```json
{"type":"LOOP_RESULT","from":"sdd-workflow-coordinator","status":"complete|blocked|needs_user|idle","stopReason":"","workflow":"task_execution","phase":"","delegations":[],"loopIterations":0,"summary":"","sign_off":null,"user_q":[],"needs_user":false,"humanApprovalRequired":false,"tokens_used":0}
```

`sign_off` when `stopReason: awaiting_sign_off`:

```json
{"artifact_type":"feature|spec","artifact_id":"FEAT-014","artifact_path":"docs/features/014_auth.md","title":"","sign_off_summary":"","estimated_tokens":0,"task_token_estimates":[],"open_questions":[],"validation_confidence":99}
```

### HELP_RESULT — sdd-system-advisor

```json
{"type":"HELP_RESULT","from":"sdd-system-advisor","q":"","facts":[],"agents":[],"skills":[],"next":null,"tokens_used":0}
```

`facts` = structured bullets for **sdd-project-lead** to phrase — not user-facing prose.

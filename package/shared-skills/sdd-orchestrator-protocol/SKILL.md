---
name: sdd-orchestrator-protocol
description: >-
  INTERNAL — sdd-loop agent only. Handoff/Result packets, gate order, rule of 3.
  Not user-invokable. Not loaded by sdd-orchestrator agent.
---


# SDD Orchestrator Protocol

**sdd-loop** agent reads this skill. **sdd-orchestrator** never reads skills directly.

## Output contract (all sub-agents)

| Agent | User-facing prose |
|-------|-------------------|
| **sdd-orchestrator** | Yes — sole human voice |
| **All other sdd-* agents** | **No** — JSON Results only |

Sub-agent rules:

1. **Entire reply** = one JSON object (optional ` ```json ` fence). No prose, markdown, or tables outside JSON.
2. **Low token** — short keys, omit null/empty fields, no Handoff echo, compress lists.
3. **Access denied** → `{"type":"ACCESS_DENIED","from":"<agent>","reason":"orchestrator_only"}`
4. **sdd-orchestrator** parses Results and speaks to the user in natural language.

## Coordinator priority

1. Task `Ready` → task_execution → domain agents
2. Feature `Ready` (GitHub) → **sdd-docs** + **sdd-validation** (`spec`)
3. Workable idea (GitHub) → **sdd-docs** + **sdd-validation** (`feature`)

## Rule of 3

Max **3** per gate. Feature/spec validation pass at `total_confidence >= 99` → **awaiting_sign_off** (user chat approval) → `sdd-updates mark_ready` after sign-off. Fail retries `sdd-docs revise_draft`. Attempt 3 fail -> `incomplete`, `blocked_work.json`, stop.

| Gate | Counter |
|------|---------|
| Draft validation | `draftValidationAttempts` |
| Work validation | `workValidationAttempts` |
| Testing | `testingAttempts` |
| Task retry | `attempts` |

---

## DOCS_HANDOFF → sdd-docs

```yaml
DOCS_HANDOFF:
  from: sdd-orchestrator
  action: create_idea | create_feature | create_spec | revise_draft | bootstrap_repo
  source: github:owner/repo#12          # idea issue (create_feature / validation)
  parent_feature: github:owner/repo#34  # feature issue (create_spec)
  github_issue: 34                      # optional numeric shortcut
  spec_queue_row: 1
  git_spec_branch: feature/spec-slug  # required for create_spec
  rewrite_instructions: []
```

---

## VALIDATION_HANDOFF → sdd-validation

Single agent for **work**, **test**, **feature**, and **spec** gates.

```yaml
VALIDATION_HANDOFF:
  from: sdd-orchestrator
  validation_type: work | test | feature | spec
  attempt: 1
  manifest_path: docs/specs/work-records/SPEC-014/manifest.json  # required: work + test
  spec: docs/specs/MMDDYY_x.md
  spec_id: "014"
  source: github:owner/repo#12          # idea issue (feature validation)
  draft: github:owner/repo#34           # feature issue (feature validation)
  parent_feature: github:owner/repo#34  # feature issue (spec validation)
  required_context: []
  changed_files: []
  git_spec_branch: feature/spec-slug
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
| `feature` / `spec` | After draft | Per draft validation skill |

**Test gate retry:** orchestrator re-delegates **sdd-validation** `test` up to **3** (`testingAttempts`). Attempt 3 fail → spec incomplete (testing).

---

## UPDATES_HANDOFF → sdd-updates

```yaml
UPDATES_HANDOFF:
  from: sdd-orchestrator
  action: mark_ready | link_spec_branch | task_sync | finalize_work_records | archive_spec
  target: feature | spec
  spec_id: "042"
  git_spec_branch: feature/spec-slug
  branch_url: https://github.com/owner/repo/tree/feature/spec-slug
  manifest_path: docs/specs/work-records/SPEC-042/manifest.json
  implementation_results: []
  validation_result: {}    # finalize: VALIDATION_RESULT (validation_type: test) with test_run
```

---

## HANDOFF → domain agents

```yaml
HANDOFF:
  from: sdd-orchestrator
  spec: docs/specs/MMDDYY_name.md
  task_id: T1
  git_spec_branch: feature/spec-slug
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

### Default `skill_standards` (sdd-loop builds if omitted)

| Layer | Skills loaded by domain agent |
|-------|------------------------------|
| frontend | code-typescript, code-react, code-react-native |
| backend | code-python (+ code-typescript if TS backend) |
| database | code-postgres |

Repo `standards` paths are **extensions** only — not duplicates of universal skills.

---

## LOOP_HANDOFF → sdd-loop

```yaml
LOOP_HANDOFF:
  from: sdd-orchestrator
  action: run_coordinator | build_handoff | gate_sequence
  repo_root: .
  active_work_path: docs/automation/state/active_work.json
  git_spec_branch: feature/spec-slug
  context: {}
```

---

## HELP_HANDOFF → sdd-help

```yaml
HELP_HANDOFF:
  from: sdd-orchestrator
  question: user question verbatim
  topic: agents | skills | workflow | git | validation | null
```

---

## Gate order

```
tasks Complete -> sdd-validation(work)x3 -> sdd-validation(test)x3 -> sdd-updates(finalize) -> sdd-github(spec_push/open_pr/merge_pr_to_ai_workflow) -> sdd-updates(archive)
```

Draft: **sdd-github spec_start** (spec only) -> **sdd-docs** -> **sdd-validation**(feature|spec)x3 -> **awaiting_sign_off** -> user chat sign-off -> **sdd-updates mark_ready**
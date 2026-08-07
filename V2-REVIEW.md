# SpecLoom v2 — Review and Plan

Review of `sdd-loop/package/v2` as it stands on 2026-08-02. Ground truth is the files, not the docs.

---

## Summary

The v2 **architecture** is good — materially better than v1, and it independently solves most of what was wrong there. The v2 **package** is roughly half-built and its documentation describes a system that no longer exists.

| | Count |
|---|---|
| Agents | 8 (3 are stubs) |
| Skills | 44 cursor + 6 shared (23 are stubs) |
| Stub files | **26 of 58** (45%) |
| Workflow docs at repo level | 4 — **only one** describes the shipped roster |
| Live files referencing deleted agents | 11 |

---

## What v2 gets right

Credit first, because these are real and several were open problems in v1.

**Referential integrity is clean.** Every skill an agent declares exists. Every agent named in an `Allowed Tasks` block exists. There are no orphan skills. Verified programmatically across all 8 agents and 50 skills — zero breaks. The v1-lineage package fails this check in five places.

**The hard split is well designed.** Orchestrator does handoff + NLP only, explicitly forbidden from git, Linear, code, queue resolution and retries. Loop never chats or merges trunk. PM never calls workers. Workers never peer-chain. This is stated once in `specloom-contract` and repeated consistently in each agent's Forbidden section.

**Loop owns its workers.** `specloom-loop` Tasks Implementation, Security and Tester directly, and `specloom-remediation` routes failures by `owner:build|test|security`. Whoever counts the retries makes the calls. This was the single worst structural defect in v1 and v2 fixed it independently.

**Trunk contention is actually addressed.** Single Ready head by default; stacked PRs per Brief; Repository is the only agent that touches `ai-workflow`; parallel mode requires isolated worktrees and Repository-serialised merges. That is a real answer, not a rule of thumb.

**Security is a first-class gate.** New in v2, absent from v1. And it is the only gate with a falsifiable pass condition: zero High/Critical, with file, line and remediation.

**Coverage got more honest.** Still 0.99, but now with language ignore directives and an explicit instruction to reject ignores that hide acceptance-criteria logic. That is a considered answer to the fake-test problem rather than a flat mandate.

**Linear as single planning SoT, PM as only writer.** Correct shape. Docs repo is explicitly a mirror, not a source.

---

## Problems

### 1. The documentation describes a different system — worst issue

Four workflow documents exist. Three of them describe rosters that are not in `package/v2/cursor/agents/`.

| Doc | Size | Describes | Status |
|---|---|---|---|
| `WORKFLOW.md` | 4 KB | v1 five-orchestrator | correctly labelled legacy |
| `WORKFLOW-LINEAR.md` | 22.8 KB | `init` · `brief` · `run` · `document` · `git` | **stale** — those agents are in `_archive/` |
| `package/v2/WORKFLOW-AND-FUNCTIONALITY.md` | 14 KB | `init` · `brief` · `run` · `build` · `build-worker` · `build-check` · `test-loop` | **stale** |
| `package/v2/WORKFLOW-V2.md` | 22.8 KB | `specloom` · PM · Loop · Impl · Security · Tester · Repository · Document | **correct** |

The actual roster:

```
specloom · specloom-project-manager · specloom-loop · specloom-implementation
specloom-security · specloom-tester · specloom-repository · specloom-document
```

**The root `README.md` is wrong about v2.** Its version table says:

> **v2** (current design) — Peers: `@specloom-init` · `brief` · `build` · `test` · `validate` · `git`

None of those six exist. It then points the v2 contract link at `WORKFLOW-LINEAR.md` — the stale doc. Anyone starting from the README installs v2 and then tries to invoke agents that were archived.

Both stale docs were edited on 1 Aug, same day as the current ones, so this is not old rot — it is three parallel descriptions being maintained at once and drifting.

### 2. 45% of the package is `# Status: STUB`

26 of 58 files are a frontmatter block, the words `Status: STUB`, and a pointer back to `WORKFLOW-V2.md`.

**All three gate workers are stubs:**

- `specloom-implementation.md`
- `specloom-security.md`
- `specloom-tester.md`

**The entire Security gate is stubs** — the agent plus all three of its skills (`security-secrets`, `security-owasp`, `security-stack`). The one genuinely new capability v2 adds over v1 currently contains no rules at all.

**The Tester gate is mostly stubs** — agent, `specloom-coverage`, `specloom-visual-diff`. Only `specloom-testing` (638 bytes, skill-loading rules) has content.

**13 of 14 `document-*` skills are stubs.** Only `document-repo` is written. Every one carries the identical body: "Expand templates + algorithms from WORKFLOW-V2 §10 / §15."

What *is* written is the planning and control half: contract, orchestrator, loop-protocol, queue, resolve-work, remediation, linear-team, brief-plan, brief-bootstrap, init-dialogue, lang-ensure, ux-refs, git-workflow, git-merge-trunk. The system can decide what to do and how to route it. It cannot yet do it.

### 3. The score problem survived the rewrite

| Gate | v1 | v2 |
|---|---|---|
| confidence | `>= 99` | `≥ 0.99` |
| ux_confidence | — | `≥ 0.99` |
| code_confidence | — | `≥ 0.99` |
| coverage | `== 100` | `≥ 0.99` + ignore directives |
| security | — | zero High/Critical |

Three of five gates are still a number the model assigns to itself. Moving the decimal point does not make a self-report calibrated. `specloom-init-dialogue` extends the same pattern to planning — "dialogue / research until confidence ≥ 0.99 (or user-accepted holes)" — where the escape hatch is also undefined.

The interesting thing is that v2 already contains the answer. The Security gate's contract — file, line, severity, remediation, High/Critical fails — is falsifiable and needs no score. Coverage is genuinely measured. Those two are fine. It is `confidence`, `code_confidence` and `ux_confidence` that are decoration.

### 4. Live skills route to deleted agents

`specloom-queue` is loaded by **both** PM and Loop. It ends with:

```
| **specloom-brief** | **specloom-run** | Plan done; queue head Ready |
| **specloom-run** | build / validate / test / document | see specloom-run-protocol |

Default: brief→**run** (one SPE). Run does not auto-start the next SPE after Done.
```

`specloom-brief`, `specloom-run` and `specloom-run-protocol` are all in `_archive/`. Worse, this table tells PM to auto-start execution, while `specloom-contract` — which the same agent also loads — says PM must **never** call Loop or workers. Two skills the same agent reads at the same time give opposite instructions.

Eleven live files reference archived agent names:

```
specloom-queue · specloom-brief-bootstrap · specloom-brief-plan · specloom-init-dialogue
specloom-init-foundation · specloom-lang-ensure · specloom-linear-team · specloom-git-workflow
specloom-domain-research · specloom-coding · specloom-project-manager (agent)
```

Most are cosmetic header references. `specloom-queue` and `specloom-brief-bootstrap` are behavioural.

### 5. The installer silently mis-installs v2

`package/v2/` contains only `cursor/` and `shared-skills/` — no `codex/`, no `antigravity/`.

`installCodex` falls back to `cursor/agents` when `codex/agents` is missing. So:

```
node scripts/install.mjs --v2 --codex
→ copies specloom.md, specloom-loop.md … into ~/.codex/agents/
```

Codex loads `.toml` — that is what `package/v1/codex/agents/` ships. The v2 install writes markdown there, reports `[ok]` for each file, and prints `Codex peers: specloom, specloom-document`. Nothing loads. Same silent fallback sends Cursor markdown to `~/.gemini/config/agents/` for Antigravity.

`--v2 --all` therefore claims four-platform support and delivers one.

Separately: with no flags, the installer defaults to **v1** *and* `--all`. `npx specloom-install` installs the legacy system everywhere.

### 6. Operational gaps in the stacked-PR model

The design is sound; four cases are unspecified.

**No revert path.** `merge_stack` merges N Briefs bottom-up into `ai-workflow`. If Brief 3 of 5 proves wrong after the merge, nothing describes undoing it. `specloom-git-merge-trunk` covers conflicts but not regret.

**Orphaned PRs on mid-set failure.** Briefs 1..i-1 have pushed branches and open stacked PRs. The contract says stop the run_set and do not merge. It does not say what happens to those PRs — closed, left open, rebased later? A failed 5-Brief set leaves four open PRs stacked on each other with no cleanup rule.

**One retry budget for three gates.** `Retry ≤ 5` covers Implementation + Security + Tester combined. A Brief that fails Security three times and then Tester twice is out of retries, and the FAILED payload cannot say which gate was actually stuck. Per-gate budgets would diagnose themselves.

**Linear is a hard dependency.** `specloom-resolve-work` opens with "Linear MCP required. Fail if missing." There is no degraded mode. If Linear is unreachable, the entire system — including work already merged and needing only a Done transition — halts.

---

## Plan

Ordered by unblocking value, not by size. Phases 1 and 2 are cheap and remove active misinformation.

### Phase 1 — Make the docs describe the shipped system

Half a day, zero behavioural risk, removes the worst failure mode (following the README into a system that isn't there).

- [ ] Root `README.md` — replace the v2 peers cell with `@specloom` and `@specloom-document`; note the six internals are not user entry
- [ ] Root `README.md` — point the v2 contract link at `package/v2/WORKFLOW-V2.md`
- [ ] `WORKFLOW-LINEAR.md` — move to `package/v2/_archive/` or add a superseded banner at line 1
- [ ] `package/v2/WORKFLOW-AND-FUNCTIONALITY.md` — same decision; if kept, regenerate its two roster tables from the 8 agent files
- [ ] Declare **one** canonical doc (`WORKFLOW-V2.md`) in `package/v2/README.md`; everything else links rather than restates

### Phase 2 — Purge stale routing from live skills

Short, and one item is a genuine contradiction the agents will hit.

- [ ] `specloom-queue` — delete the Auto-start table entirely. PM returns `next_brief_key`; the Orchestrator decides whether to Task Loop. This is what `specloom-contract` already says
- [ ] `specloom-queue` — `SPE-5, SPE-6` example → Brief keys
- [ ] `specloom-brief-bootstrap:148` — "init Tasks specloom-run" → Orchestrator Tasks Loop
- [ ] `specloom-init-dialogue:11` — `@specloom-run` → the Loop
- [ ] Header/description sweep across the remaining 8 files
- [ ] Add a `--verify` mode to `install.mjs`: every `**specloom-x**` reference must resolve to a live agent or skill, and no live file may name an archived agent. Refuse to install on a break

### Phase 3 — Write the Security gate

Highest value stub set. It is v2's one new capability, it is currently four empty files, and it is the gate whose pass condition is already well defined — so it can be written without waiting on the scoring decision.

- [ ] `specloom-security.md` — inputs, output shape, when it fails a Brief
- [ ] `specloom-security-secrets` — what counts as a secret, entropy and pattern rules, allowlist handling
- [ ] `specloom-security-owasp` — the categories actually checked, per language
- [ ] `specloom-security-stack` — how stack-specific SAST mounts, and behaviour when none is available
- [ ] Define the finding shape once: `file`, `line`, `severity`, `rule`, `remediation`

### Phase 4 — Decide the score question, then write Implementation and Tester

Doing this before Phase 5 means the two biggest agents get written once against the model you keep.

- [ ] Drop `confidence`, `code_confidence`, `ux_confidence`. Keep `coverage` (measured) and the security severity gate (falsifiable)
- [ ] Implementation and Tester return **findings** in the Security shape — a finding needs a `file` and a rule source, or it is dropped
- [ ] `ux_confidence ≥ 0.99` → per-criterion pass/fail against each listed Image File. A visual criterion either holds or it doesn't; averaging them into 0.99 hides which screen is wrong
- [ ] Update the thresholds table in `specloom-contract` and the Loop→Orchestrator payload in `WORKFLOW-V2.md` §12

### Phase 5 — Write Implementation and Tester

- [ ] `specloom-implementation.md` — layer routing, read scope, commit rules, remediation handling
- [ ] `specloom-tester.md` — AC→test mapping, coverage measurement, visual diff invocation
- [ ] `specloom-coverage` — how coverage is measured per stack, what "Brief production files" resolves to, ignore-directive audit
- [ ] `specloom-visual-diff` — the diff method, what a per-criterion failure looks like
- [ ] `specloom-ui-layout`, `specloom-lang-mount`, `specloom-git-commit`, `specloom-git-worktree`, `specloom-planning`

### Phase 6 — Close the operational gaps

- [ ] `specloom-git-merge-trunk` — add `revert_stack` taking the merge SHAs
- [ ] Stacked-PR cleanup rule on FAILED mid-set: close, keep, or convert to draft — pick one and write it
- [ ] Split `Retry ≤ 5` into per-gate budgets so FAILED names the stuck gate
- [ ] Define Linear-unavailable behaviour: which operations may proceed and which must halt

### Phase 7 — Document skills

13 stubs, lowest urgency, largest count. `document-router` first, since it selects the others.

### Installer, separately

- [ ] Either add `package/v2/codex/` + `package/v2/antigravity/`, **or** make `--codex` / `--antigravity` refuse with v2 instead of silently copying Cursor markdown
- [ ] Consider defaulting the version to v2 once Phase 1 lands, or requiring the flag explicitly

---

## The question worth asking first

Phases 3–5 are a lot of writing. Before starting them: has any Brief been taken end-to-end through v2 as it currently stands? With Implementation, Security and Tester all stubs, the answer is probably no.

If so, the cheapest next step after Phases 1–2 is to run **one small real Brief** through the pipeline with the three workers written just well enough to function, and see which of the remaining 23 stubs the run actually demands. That ordering is likely to differ from the one above — and it would tell you whether the gate thresholds matter as much as the architecture assumes.

---

## Appendix — cost and variance

Estimates from the actual file sizes. External `specloom-standards` size is a guess; image tokens are approximated at ~1.5k per UI reference. Directionally right, not precise.

### How skills load

All 44 v2 skills carry `disable-model-invocation: true`. Only `name` + `description` stay resident — about **1,259 tokens for the entire catalogue**. The bodies (~10,400 tokens in total) are read on demand. Nothing loads a skill it did not ask for.

### Per-Brief token cost

| Component | ~tokens | Share |
|-----------|---------|-------|
| Skill text actually read | 15,300 | 24% |
| Code, images, diffs, tool output | 32,600 | 51% |
| Generated output | 15,600 | 25% |
| **Clean Brief** | **63,500** | |

| Retries | Cost | Outcome |
|---------|------|---------|
| 0 | ~63k | merged |
| 1 | ~102k | merged |
| 2 | ~141k | merged |
| 5 | ~257k | **FAILED — nothing merges** |

A `run_set` of five Briefs averaging one retry each is roughly **511k tokens**. For comparison, the same Brief done by hand in one editor session is 15–30k, so v2 costs about 2–4× a single-agent session on a clean run and 6–8× when it retries. That is the ordinary multi-agent tax, not an anomaly.

**Skill text is a quarter of the cost.** Trimming skill lists is not a meaningful saving. The levers that matter are retries and how much file and image context each worker pulls.

### The retry amplifier

`Retry ≤ 5` bounds attempts, not spend. A gate whose pass condition is a self-assigned `0.99` cannot mechanically separate *done* from *stuck*, so it retries to the cap. Worst case is ~257k tokens spent to merge nothing.

This makes **Phase 4 the largest cost lever in the plan**, not only a correctness fix.

There is also no token ceiling anywhere in `specloom-loop-protocol`. Add one alongside the retry cap.

### Variance, ranked

1. **The `0.99` gates are biased, not merely uncalibrated.** `specloom-contract` states that 0.99 passes, then asks the agent to emit `confidence_score`. It will emit 0.99 nearly always — consistently passing regardless of the work.

2. **Skill selection is a model judgement.** Because `disable-model-invocation: true` prevents self-triggering, skills load only when instructed — but the agent files list them as bare bullets with no trigger conditions. Compare `specloom-coding` ("for each language slug `L`, load `code-L` if it exists") which is precise. Two runs of one Brief can execute under different rule sets, and nothing reports that it happened. `project-manager` has the widest surface: 12 skills, no conditions.

3. **26 stubs.** A stub body says "canonical rules: WORKFLOW-V2.md", so the agent either pulls a 22.8 KB document (~5.7k tokens) or improvises. Under progressive disclosure the description promises rules the body does not contain — the agent cannot tell before reading.

4. **The `specloom-queue` contradiction.** PM loads both `specloom-contract` (never Task the Loop) and `specloom-queue` (auto-Task `specloom-run`). Which wins is not deterministic.

5. **`lang-ensure` generating skills at runtime.** A generated `code-{lang}` then governs every implementation in that project. Two projects on the same stack get different rules — variance baked into the substrate rather than the run.

6. **Generated UX refs.** The highest-variance operation in the system, and its output becomes the visual acceptance criteria the Tester later diffs against.

7. **Linear label fallback.** "Prefer custom states; else labels" — two workspaces resolve stage differently.

### What is already reproducible

The forbidden matrix, the queue topological sort, branch naming, coverage (tool-measured) and the security severity gate (binary). The two gates worth keeping are also the two that are reproducible — mechanically checked things are both cheap and repeatable.

### Additions to the phases

| Phase | Add |
|-------|-----|
| **4** | Note that this is the primary cost lever, not only a correctness fix |
| **5** | Give every agent's `## Skills` list a when-to-load condition per skill, in the style of `specloom-coding`. Determinism, not token saving |
| **6** | Add a per-Brief token ceiling to `specloom-loop-protocol` alongside the retry cap |
| **6** | Pin generated `code-*` / `test-*` skills into the repo and version them rather than regenerating per project |
| **6** | Freeze generated UX refs after one review, so acceptance criteria stop moving |

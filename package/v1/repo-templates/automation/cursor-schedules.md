# Cursor Automation Prompts

**Git base branch:** `ai-workflow` for all automations.

**Agent (required):** Select **`specloom-implement`** in each automation's agent settings — not `specloom-worker` or any other sub-agent.

Workflow procedures live in **global skills** (`specloom-*`), not repo markdown.  
**specloom-implement** Task-delegates **specloom-worker** and other sub-agents. Sub-agents reply in JSON **to the project lead only**. The **final automation message to you must be natural language** — never raw JSON.

---

## Spec Executor (primary — do the work)

**Schedule:** Weekdays every 2h (`0 9,11,13,15,17,19 * * 1-5`)

**Agent:** `specloom-implement`

**Prompt:**

```
You ARE specloom-implement (sole user-facing entry). Follow ~/.cursor/agents/specloom-implement.md.

Task-delegate specloom-worker with action run_until_complete (max_loop_iterations: 25).

Sub-agents return JSON to you only — never paste LOOP_RESULT, VALIDATION_RESULT, or other JSON in your final reply. Summarize outcomes in natural language for the user.

Workflow procedures are skills (specloom-*), not repo files. Coordinator reads active_work.json workflow id and loads matching skill.

Run continuously until stopReason: idle, blocked, needs_user, awaiting_sign_off, or iteration_cap.

Feature/spec drafts: after QA validation pass (>= 99%), STOP and present review card (summary, estimated tokens, open questions). Do NOT promote until user replies approved / sign off / proceed / lgtm in chat. User may answer open questions inline first.

Auto closeout after work+test gate only — no human sign-off for implementation.

humanApprovalRequired when stopReason is awaiting_sign_off or needs_user.

Update daily_summary.md when session ends.

End with a prose session summary: stop reason, work completed, branches pushed, blocked items, questions for the user (if any).
```

**Covers:** coordinator routing, task execution, spec creation, feature definition, validation, auto closeout — all in one continuous session.

---

## SDD Review (notify only — no code, no git)

**Schedule:** Daily or after Spec Executor runs (e.g. `30 19 * * 1-5` weekdays 7:30 PM)

**Agent:** `specloom-implement`

**Prompt:**

```
You ARE specloom-implement. Notify-only run — do not implement, validate, or git push.

Read docs/automation/state/active_work.json, docs/automation/state/blocked_work.json, docs/automation/reports/latest_review.md.

If stopReason is awaiting_sign_off:
  Summarize the pending feature/spec for the user: what it will do, estimated tokens, open questions. Tell them to reply approved / sign off in chat, or answer questions / request revise.

If stopReason is needs_user OR humanApprovalRequired is true (and not awaiting_sign_off):
  Write a short summary to docs/automation/reports/latest_review.md — what needs your input and why (Open Questions, missing decisions).

If stopReason is blocked OR blocked_work.json has items:
  Include failure reason, which gate failed (draft | work | test | attempts), spec/task if known, and rule-of-3 count.
  Write to latest_review.md.

If idle with no blocked items and no needs_user ? optional one-line "no action needed" in latest_review.md or skip write.

Do not change active_work.json except updatedAt if you add a review timestamp field. Do not implement code.

Your final message to the user must be natural language (what you wrote to latest_review.md, in plain English) — not JSON.
```

**When you act:** answer Open Questions, clear items in `blocked_work.json`, or unblock per project-lead guidance.

---

## Spec Creation — superseded

**Status:** **Disable or delete.** Absorbed by **Spec Executor**.

---

## Setup

1. **Agent:** `specloom-implement` on every automation
2. Commit `docs/automation/state/`, `docs/ideas/`, `docs/features/`, report stubs
3. Base branch **`ai-workflow`**
4. Enable **Spec Executor** (required) and **SDD Review** (recommended)

## Why you saw JSON

If an automation replied with raw JSON, one of these happened:

- Agent was **specloom-worker** (or default) instead of **specloom-implement**
- Prompt said "delegate coordinator" and the run **echoed the coordinator's JSON** instead of synthesizing
- Sub-agent was invoked **without** project lead as the parent

Fix: **specloom-implement** agent + prompts above.

# Daily Spec Automation

> Superseded by **SDD Loop Engineering**. Use **workflow-coordinator-*** skills + Cursor Automations.

## Primary path

1. Cursor Automation invokes **sdd-project-lead** with `run_until_complete`
2. **sdd-workflow-coordinator** loads **workflow-coordinator-*** skill from `active_work.json` → `workflow` id
3. Updates `docs/automation/state/active_work.json`
4. Writes `docs/automation/reports/`
5. Git push via sdd-release-engineer on auto_closeout

See:

- [Automation README](../automation/README.md)
- [Cursor Schedules](../automation/cursor-schedules.md)
- **workflow-coordinator-loops** skill (index)

## Manual fallback

If no automation scheduled:

1. Set `workflow` to `coordinator` in `active_work.json`
2. Invoke **sdd-project-lead** → **sdd-workflow-coordinator** with `run_until_complete`
3. Same state/report updates apply

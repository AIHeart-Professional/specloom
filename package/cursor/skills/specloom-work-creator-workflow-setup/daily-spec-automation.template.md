# Daily Spec Automation

> Superseded by **SDD Loop Engineering**. Use **specloom-worker-*** skills + Cursor Automations.

## Primary path

1. Cursor Automation invokes **specloom-work-creator** with `run_until_complete`
2. **specloom-implement** loads **specloom-worker-*** skill from `active_work.json` ? `workflow` id
3. Updates `docs/automation/state/active_work.json`
4. Writes `docs/automation/reports/`
5. Git push via specloom-git on closeout

See:

- [Automation README](../automation/README.md)
- [Cursor Schedules](../automation/cursor-schedules.md)
- **specloom-worker-loops** skill (index)

## Manual fallback

If no automation scheduled:

1. Set `workflow` to `coordinator` in `active_work.json`
2. Invoke **specloom-work-creator** ? **specloom-implement** with `run_until_complete`
3. Same state/report updates apply

# Daily Spec Automation

> Superseded by **SDD Loop Engineering**. Use `docs/automation/loops/` + Codex automations.

## Primary path

1. Codex Automation reads loop from `docs/automation/loops/`
2. Updates `docs/automation/state/active_work.json`
3. Executes via **sdd-automation-loops** + **sdd-orchestrator**
4. Writes `docs/automation/reports/`
5. Git push via sdd-github on closeout

See:

- [Automation README](../automation/README.md)
- [Codex Schedules](../automation/cursor-schedules.md)
- **sdd-automation-loops** skill

## Manual fallback

If no automation scheduled:

1. Run `coordinator_loop.md`
2. Follow routed loop
3. Same state/report updates apply

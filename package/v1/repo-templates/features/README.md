# Features (WHAT)

**Feature** = approved high-level outcome within an active **phase**. Specs in `docs/specs/` carry the HOW.

Every feature **must** declare:

```yaml
phase: docs/phases/01-Prototype
```

See **Phase Alignment** section in feature body and `docs/phases/<NN-Name>/PHASE.md`.

## Format

Each file: `NNN_short-description.md` (e.g. `014_auth-system.md`)

See **specloom-work-creator-create-feature** → [feature-template.md](../../specloom-work-creator-create-feature/feature-template.md).

## Queue

**Next for spec:** lowest `NNN` with `status: Ready`, dependencies Complete, pending Spec Queue row.

## Archive

On Complete → `docs/features/archived/NNN_short-description.md`

## Skills

- Create/promote: **specloom-work-creator-create-feature**
- Spawn spec: **specloom-work-creator-create-spec**

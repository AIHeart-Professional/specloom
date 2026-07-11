# Features (WHAT)

**Feature** = approved high-level outcome within an active **phase**. Specs in `docs/specs/` carry the HOW.

Every feature **must** declare `phase: docs/phases/NN-Name` and a **Phase Alignment** section.

## Format

Each file: `NNN_short-description.md` (e.g. `014_auth-system.md`)

See **specloom-work-creator-create-feature** → [feature-template.md](../../specloom-work-creator-create-feature/feature-template.md).

## Queue

**Next for spec:** lowest `NNN` with `status: Ready`, dependencies Complete, pending Spec Queue row, same phase as `activeProductPhase`.

## Archive

On Complete → `docs/features/archived/NNN_short-description.md`

When all phase features archived → `docs/phases/archived/NN-Name/`

## Skills

- Create/promote: **specloom-work-creator-create-feature**
- Spawn spec: **specloom-work-creator-create-spec**
- Phase rules: **specloom-phase-alignment**

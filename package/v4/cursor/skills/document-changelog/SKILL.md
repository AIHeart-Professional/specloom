---
name: document-changelog
description: >
  INTERNAL — specloom-document. Release notes.
disable-model-invocation: true
---


# Changelog

[Keep a Changelog](https://keepachangelog.com) format, newest first.

```markdown
## [1.4.0] — 2026-08-02

### Added
- Budget detail screen (BUD-11)

### Changed
- Queue promotion now returns next_brief_key (BUD-12)

### Fixed
- Session not rotated on role change (BUD-13)

### Security
- Rotated the committed API key found in BUD-10
```

## Rules

- Sections in order: Added, Changed, Deprecated, Removed, Fixed, Security. Omit empty ones
- Written for **users of the thing**, not for its authors. "Fixed a null deref in `parseRow`" is
  a commit message; "Fixed a crash when importing a CSV with empty rows" is a changelog entry
- Every entry cites its Brief key
- Breaking changes get their own **BREAKING** callout with the migration
- `Unreleased` accumulates; it is renamed on release, never rewritten

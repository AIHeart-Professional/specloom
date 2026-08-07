---
name: specloom-coding
description: >
  INTERNAL — production code agents. Load code-{lang} skills + standards CORE + Brief paths.
  Not user-invokable.
disable-model-invocation: true
---

# specloom-coding

Before any production edit:

1. Languages = Brief Task Directives `Language` column (normalize via **specloom-lang-ensure** map / manifest aliases)
2. For each language slug `L`: **load skill `code-L` if it exists** (Cursor/Codex skills). If missing → fail and tell parent to run lang-ensure / `@specloom` language fix — do not invent rules ad hoc mid-build
3. **specloom-standards-fetch** → standards root + `manifest.yaml` (when available)
4. If standards present: always read `{language}/CORE.md`; then **only** Brief **Code Standards** topic paths
5. Topic / `code-L` skill: more specific wins for that topic; never browse other standards files
6. **Never** load `test/` or `test-*` skills here
7. If Brief Task lists **Image Files** / UX refs → follow **specloom-ux-refs** (read listed only)

No production code without steps 2 complete (and 4 when standards root exists).

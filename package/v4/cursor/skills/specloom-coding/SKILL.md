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
2. For each language slug `L`: **load skill `code-L` if it exists** (Cursor/Codex skills). If the Skill tool cannot load it, **fall back to the product's pinned copy**: Read `<repo>/.specloom/skills/code-L/SKILL.md` and follow it as the skill (pinned copies are the per-product source of truth — v3's lang-mount injected these; v4 reads them directly). Only if **neither** exists → fail with a `critical` finding so the run-set workflow routes to lang-ensure — do not invent rules ad hoc mid-build
3. **specloom-standards-fetch** → standards root + `manifest.yaml` (when available)
4. If standards present: always read `{language}/CORE.md`; then **only** Brief **Code Standards** topic paths
5. Topic / `code-L` skill: more specific wins for that topic; never browse other standards files
6. **Never** load `test/` or `test-*` skills here
7. If Brief Task lists **Image Files** / UX refs → follow **specloom-ux-refs** (read listed only)

No production code without steps 2 complete (and 4 when standards root exists).

---
name: specloom-coding
description: >
  INTERNAL — production code agents. Load language CORE + Brief Code Standards only. Not user-invokable.
disable-model-invocation: true
---

# specloom-coding

Before any production edit:

1. **specloom-standards-fetch** → standards root + `manifest.yaml`
2. Languages = Brief Task Directives `Language` column (aliases via manifest)
3. **Always** read `{language}/CORE.md` per language
4. Read **only** Brief **Code Standards** paths (normalize with manifest `root`)
5. Topic wins over CORE on conflict for that topic
6. **Never** browse other files under language dir; **never** load `test/`

No production code without steps 3–4 complete.

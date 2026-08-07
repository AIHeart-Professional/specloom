---
name: specloom-testing
description: >
  INTERNAL — test agents. Load test-{lang} skills + test CORE + Brief Test Standards.
  Not user-invokable.
disable-model-invocation: true
---

# specloom-testing

Before any test write:

1. Languages under test from Brief (same slug map as coding)
2. For each slug `L`: **load `test-L` if it exists**. If the Skill tool cannot load it, fall back to the product's pinned copy: Read `<repo>/.specloom/skills/test-L/SKILL.md` and follow it as the skill. Only if neither exists → fail to parent (lang-ensure), do not freestyle
3. **specloom-standards-fetch** when available → `test/{language}/CORE.md` + Brief **Test Standards** paths only
4. **Never** browse; **never** write production features; **never** load `code-*` unless listed under Test Standards

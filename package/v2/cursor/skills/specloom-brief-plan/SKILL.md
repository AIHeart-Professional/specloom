---
name: specloom-brief-plan
description: >
  INTERNAL — specloom-brief. Create/edit Phases and work Briefs (Issues) from Overview. Not user-invokable.
disable-model-invocation: true
---

# Phase / work-Brief planning

## Create Phase (from Overview)

1. Read Overview (Initiative): end goal + Reason + phase list gaps
2. Create Linear Project + Document:
   - **Reason** (why this milestone toward Overview)
   - Goal · In scope · Out of scope · Quality bar · Completion criteria
3. Status Project → Planned or In Progress (only one In Progress unless user says otherwise)
4. Almost always plan **multiple** Briefs for the Phase — never one mega-Brief for whole phase

## Create Brief (from Phase)

1. Read Phase Document Reason/Goal/In-Out scope
2. Create Issue on that Project:
   - Title: clear work slice
   - Labels: `brief` + layers
   - Body sections in order:
     1. **Reason** (why toward Phase/Overview)
     2. Goal
     3. Required Context (Code Standards · Test Standards · asset URLs)
     4. Requirements
     5. Task Directives (Language, layer, source files)
     6. Task checklist `- [ ]`
     7. Acceptance criteria
3. Attach standards paths via manifest `topics.when` keywords — only matches
4. Status → **Ready** when body complete

## Edit rules

- Align Brief scope to Phase In scope; refuse Phase Out of scope without user OK
- Keep Reason ≤ ~3 sentences
- Do not invent architecture paths not in Overview/Phase/prior Briefs

## Templates

See `brief-body.md` + `phase-document.md` in this skill folder.

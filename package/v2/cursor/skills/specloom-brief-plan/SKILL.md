---
name: specloom-brief-plan
description: >
  INTERNAL — specloom-brief (+ planner). Phases + ordered work Briefs. Not user-invokable.
disable-model-invocation: true
---

# Phase / work-Brief planning

## Create Phase (from Overview)

1. Read Overview Initiative  
2. Create Linear Project + Document (Reason · Goal · In/Out · Quality · Completion)  
3. One Project **In Progress**; rest Planned  
4. Multiple Briefs per Phase — never one mega-Brief  

## Create Brief (from Phase)

Every Issue must be **implementation-complete** as a spec:

1. Title: `SPE-n short-name` or Linear key + clear slice  
2. Labels: `brief` + layers (`frontend`|`backend`|`database`)  
3. Body sections:
   1. Reason  
   2. Goal  
   3. **Queue** (`queue_order`, `depends_on`, `blocks`) — **required**  
   4. Required Context (Code + Test Standards paths)  
   5. Requirements (functional / data / API / security as needed)  
   6. Task Directives (Language, layer, source files)  
   7. Task checklist  
   8. Acceptance criteria  
4. Attach standards via advisory paths / manifest `when:`  

## Ordering (with specloom-queue)

Before finishing session:

1. Assign `queue_order` + `depends_on` from architecture (e.g. scaffold → schema → API → UI)  
2. Validate no cycles  
3. Promote **only queue head** to Ready (`specloom:ready` + mapped state)  
4. All other complete Briefs → Backlog until deps Done  

## Edit rules

- Align to Phase In scope  
- Reason ≤ ~3 sentences  
- No invented architecture outside Overview/Phase  

## Templates

`brief-body.md` · `phase-document.md`

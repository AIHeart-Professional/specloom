---
name: document-repo
description: >
  INTERNAL — Document agent. Create/ensure docs git repo (<app>-docs), default main.
  Templates under templates/. Not user-invokable.
disable-model-invocation: true
---

# document-repo

## Create / ensure

1. Repo name `<app>-docs` (same owner/visibility as app when possible)  
2. Default branch **`main`**  
3. Empty shell OK — then bootstrap Specloom tree from **`templates/`** when mode is bootstrap  
4. Never invent app feature claims — scan/`_TBD_` for unknowns  

## Specloom bootstrap tree (from templates/)

`README.md`, `architecture/`, `system/`, `workflow/`, `ux/`, `specs/active|archived`

## Not this skill

- Writing typed content after tree exists → `document-architecture`, `document-system`, etc.  
- App git / `ai-workflow` → Repository  

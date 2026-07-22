---
name: specloom-build-worker
model: inherit
description: INTERNAL — specloom-build only. Build loop ≤10. Domain developers + build-check.
---

# Gate

No `BUILD_HANDOFF` / build parent → JSON `{"type":"ACCESS_DENIED","from":"specloom-build-worker"}`

## Skills

**specloom-build-protocol**

## Delegations only

`specloom-frontend` · `specloom-backend` · `specloom-database` · `specloom-build-check`

## Loop

Max 10. Unchecked task → layer agent → sync checkbox/comment via parent. All done → build-check. JSON `BUILD_RESULT` / `WORKER_RESULT` only.

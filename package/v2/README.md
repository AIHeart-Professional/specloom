# SpecLoom v2

**Canonical:** [`WORKFLOW-V2.md`](./WORKFLOW-V2.md)

**Peers:** `@specloom` (handoff + NLP only) · `@specloom-document`

```
@specloom → Task PM / Loop / Document / Repository → NLP summary
Loop: Impl → Security → Tester → SUCCESS/FAILED
Repository merges specloom/<brief> → ai-workflow
```

**Orchestrator skills:** `specloom-contract` · `specloom-orchestrator` only.

Install:
```bash
node scripts/install.mjs --v2 --cursor --force
node scripts/install.mjs --v2 --claude --force
```

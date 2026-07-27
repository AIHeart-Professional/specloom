# SpecLoom v2 (Linear Brief)

**Peers:** `@specloom-init` · `@specloom-brief` · `@specloom-run` · `@specloom-document` · `@specloom-git`

```
@specloom-init → planner → Overview + GitHub + docs + Phases + Briefs
@specloom-brief → queue + sync docs
@specloom-run → build → code validate (≥99%) → test → test validate (≥99% + 100% cov)
                 ≤5 retries/gate → push ai-workflow → Done
```

Internal only: `specloom-build` · `specloom-test` · `specloom-validate`

Install: `node scripts/install.mjs --v2 --cursor --force`

Contract: [`WORKFLOW-LINEAR.md`](../../WORKFLOW-LINEAR.md)

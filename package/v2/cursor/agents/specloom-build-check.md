---
name: specloom-build-check
model: inherit
description: INTERNAL — build-worker. Verify app runs + Brief standards compliance. No new features.
---

# Gate

Only from **specloom-build-worker**.

## Do

1. App starts / critical paths smoke (Brief-relevant)
2. Diff matches Task Directives + acceptance
3. **specloom-coding** paths honored (spot-check must/forbid)
4. Return confidence 0–100 JSON

Pass ≥99 to complete worker. Else list concrete fixes. No production feature adds. No tests (tester owns).

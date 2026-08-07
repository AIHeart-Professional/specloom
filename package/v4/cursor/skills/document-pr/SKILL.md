---
name: document-pr
description: >
  INTERNAL — specloom-document. PR and release descriptions from a run_set payload.
disable-model-invocation: true
---


# PR bodies

Generated from the run-set workflow payload, so it states what actually happened.

## Template

```markdown
## <Brief key> — <title>

<one paragraph: what changed and why>

**Linear:** <url>
**Stack position:** n of N

### Acceptance criteria
- [x] criterion, as stated in the Brief

### Gates
| Gate | Result | Detail |
|------|--------|--------|
| Implementation | green | 6 files |
| Security | green | 0 High/Critical |
| Tester | green | coverage 0.93 → floor 0.93 |

### Review focus
The one or two places a human should actually look.
```

## Rules

- Criteria come from the Brief verbatim. Do not reword them to match what was built
- Gate results come from the payload. Never assert a gate that did not run
- **Review focus** is the highest-value line: name the risky part, not "please review"
- Stacked PRs state their base branch and position, or a reviewer merges them out of order
- Never claim green for a gate that returned red

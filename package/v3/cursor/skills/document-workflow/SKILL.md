---
name: document-workflow
description: >
  INTERNAL — specloom-document. How this team runs SpecLoom and its conventions.
disable-model-invocation: true
---


# Workflow docs

```
workflow/
├── README.md      index
├── specloom.md    how SpecLoom is set up for this product
├── git.md         branch model, PR conventions
└── queue.md       how Briefs are ordered and promoted
```

## Rules

- Product-specific only. Do not restate the SpecLoom contract — link to it
- Record the product's choices: `coverage_floor`, `parallel N` or single head, `team_key`,
  which stacks are mounted
- Where the product deviates from the default contract, say **so and why**. An undocumented
  deviation reads as a bug to the next person

# Docs repo structure (required)

```
<docs-repo>/
├── README.md
├── architecture/
│   ├── README.md
│   ├── system_overview.md
│   ├── app_structure.md
│   ├── repositories.md
│   └── dependencies.md
├── system/
│   ├── README.md
│   ├── overview.md
│   ├── runtime.md
│   └── integrations.md
├── workflow/
│   ├── README.md
│   ├── specloom.md
│   ├── git.md
│   └── queue.md
├── ux/                         # design refs only (v1 images hybrid)
│   ├── README.md
│   └── refs/
│       └── <flow>/…
└── specs/
    ├── README.md
    ├── active/
    └── archived/
```

**Not included:** ideas/, features/, automation/, knowledge/, decisions/, code/ standards dumps.  
**UX refs** = `ux/refs/**` only. Shippable runtime assets stay in **app** repo.

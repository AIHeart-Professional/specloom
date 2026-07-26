# Docs repo structure (required)

```
<docs-repo>/
├── README.md                 # Command center — always detailed, always current
├── architecture/
│   ├── README.md
│   ├── system_overview.md    # Boundaries, layers, major flows
│   ├── app_structure.md      # Folders / modules map (from scan)
│   ├── repositories.md       # App + docs + related remotes
│   └── dependencies.md       # Runtime / build deps that matter
├── system/
│   ├── README.md
│   ├── overview.md           # Product systems (auth, offline, sync, …)
│   ├── runtime.md            # How it runs (platforms, envs)
│   └── integrations.md       # External services (or explicit none)
├── workflow/
│   ├── README.md
│   ├── specloom.md           # Peers + stages for this product
│   ├── git.md                # ai-workflow (app) + main (docs)
│   └── queue.md              # Mirror of Linear Brief queue
└── specs/
    ├── README.md
    ├── active/               # Open Brief mirrors
    │   └── SPE-N_slug.md
    └── archived/             # Done Brief mirrors
        └── SPE-N_slug.md
```

**Not included (by design):** ideas/, features/, automation/, knowledge/, decisions/, code/, images/ — keep lightweight. Planning lives in Linear; standards in `specloom-standards`.

# 03. Workspace Architecture & Root Entry Points

Helix Autopilot organizes repository metadata, agents, roadmaps, and bugs into a standardized `.agents/` directory structure governed by **three mandatory root entry points**.

---

## 🏛️ Directory Layout

```
<project-root>/
├── AGENTS.md                 # Root entry point: Directory of project-specific agents
├── PLANS.md                  # Root entry point: Active roadmap and plan index
├── BUGS.md                   # Root entry point: Bug and issue tracking ledger
└── .agents/
    ├── agents/               # Project-specific agent prompt markdown files
    ├── skills/               # Project-specific domain skills & workflows
    ├── rules/                # Project safety & code style policies
    ├── plans/                # Structured task execution plan documents
    ├── bugs/                 # Individual defect tracking documents
    └── templates/            # YAML templates and central INDEX.md
```

---

## 📄 1. The Three Mandatory Root Entry Points

### A. `AGENTS.md` (Project Agent Directory)
- **Location**: `<project-root>/AGENTS.md`
- **Purpose**: Serves as the index for all specialist agents defined in `.agents/agents/`.
- **Contents**: A Markdown table listing all project agents, their roles, modes, and direct links to their `.md` definitions.

### B. `PLANS.md` (Project Roadmap & Task Index)
- **Location**: `<project-root>/PLANS.md`
- **Purpose**: Central tracking document for all active, completed, and draft plans in `.agents/plans/`.
- **Contents**: Tables for Active Plans, Completed Plans, and instructions on creating new plans.

### C. `BUGS.md` (Project Defect Tracker)
- **Location**: `<project-root>/BUGS.md`
- **Purpose**: Central ledger for all known bugs, defects, and regressions in `.agents/bugs/`.
- **Contents**: Tables for Open Bugs and Resolved Bugs with severity ratings, status, and direct file links.

---

## 📂 2. The `.agents/` Subdirectories

| Subdirectory | Purpose | Example Files |
|---|---|---|
| `.agents/agents/` | Houses project-specific custom agent prompts | `architect.md`, `reviewer.md`, `frontend.md` |
| `.agents/skills/` | Actionable domain workflows and multi-step procedures | `db-migrate.md`, `component-scaffold.md` |
| `.agents/rules/` | Repository-level safety, architecture, and coding rules | `safety.md`, `style.md`, `api-design.md` |
| `.agents/plans/` | Structured task plans with verification steps | `001-initial-setup.md`, `002-auth-flow.md` |
| `.agents/bugs/` | Individual bug reports with reproduction steps | `BUG-001-null-ref.md`, `BUG-002-cors.md` |
| `.agents/templates/` | Reusable YAML code & meta-templates + `INDEX.md` | `component.template.yml`, `INDEX.md` |

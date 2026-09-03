# 🤖 Helix Autopilot Plugin for OpenCode

> **The Safe, Autonomous, Three-Stage Autopilot Plugin & Project Workspace Framework for OpenCode.**
> Drives complex development tasks from setup to plan to build & verify without mid-work interruptions, backed by un-bypassable programmatic safety rules.

---

## 🌟 Key Highlights

- ⚡ **Three-Stage Autonomous Execution**:
  - **Stage 0: Workspace Setup & Intelligent Scaffolding**: Inspects project tech stack, creates `.agents/` structure, and collaboratively drafts detailed project agents, skills, and templates.
  - **Stage 1: Exploration & Task Planning**: Analyzes dependencies, formulates structured plans, and defines verifiable acceptance criteria.
  - **Stage 2: Continuous Build & Verification**: Executes step-by-step, batches operations, runs verification tests, and never stops mid-work.
- 🛡️ **Un-Bypassable Programmatic Safety**: Pre-execution interceptor automatically blocks dangerous commands (e.g. `rm -rf /`, `format`, `diskpart`, `git push --force`, `git clean -fxd`).
- 📂 **Standardized Project Workspace Structure**: Establishes mandatory root entry points (`AGENTS.md`, `PLANS.md`, `BUGS.md`) and `.agents/` subdirectories.
- 🧠 **Institutional Project Memory**: YAML templates and central `INDEX.md` catalog project-specific architecture patterns (components, API routes, services, tests).

---

## 📚 Multi-Page Documentation

| Guide | Description |
|---|---|
| [**01. Getting Started**](docs/01-GETTING-STARTED.md) | Installation, plugin configuration, and global vs project setup |
| [**02. Three-Stage Workflow**](docs/02-THREE-STAGE-WORKFLOW.md) | Deep dive into Stage 0 (Setup), Stage 1 (Plan), and Stage 2 (Build & Verify) |
| [**03. Workspace Architecture**](docs/03-WORKSPACE-ARCHITECTURE.md) | Structure of `.agents/` and mandatory root files (`AGENTS.md`, `PLANS.md`, `BUGS.md`) |
| [**04. Mandatory Safety Rules**](docs/04-MANDATORY-SAFETY-RULES.md) | The Two-Phase Safety Model and programmatic command interceptor |
| [**05. Institutional Memory & Templates**](docs/05-INSTITUTIONAL-MEMORY-AND-TEMPLATES.md) | Writing and using YAML templates for consistent code generation |
| [**06. Configuration & Customization**](docs/06-CONFIGURATION-AND-CUSTOMIZATION.md) | Customizing `opencode.jsonc`, agent prompts, and lifecycle hooks |
| [**07. Troubleshooting & FAQ**](docs/07-TROUBLESHOOTING-AND-FAQ.md) | Common questions, debugging plugin events, and error recovery |

---

## ⚡ Quick Start

### 1. Installation

#### Global Installation (Recommended)
Copy the plugin to your global OpenCode configuration directory:
```bash
# Clone the repository
git clone https://github.com/HELIX-Origin/Helix-Autopilot.git

# Copy plugin and agent prompt to OpenCode config
cp Helix-Autopilot/src/index.ts ~/.config/opencode/plugins/autopilot.ts
cp Helix-Autopilot/agents/autopilot.md ~/.config/opencode/agents/autopilot.md
cp -r Helix-Autopilot/templates ~/.config/opencode/templates
```

#### NPM Installation
```bash
npm install helix-autopilot
```

### 2. Configure `opencode.jsonc`

Add the autopilot agent to `~/.config/opencode/opencode.jsonc`:
```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "autopilot": {
      "description": "Autopilot mode — three-stage workflow (workspace setup → plan → build & verify) that never stops mid-work.",
      "mode": "primary"
    }
  }
}
```

### 3. Start Autopilot in Any Project

Select the `autopilot` mode in OpenCode or run:
```bash
opencode --agent autopilot
```

---

## 🏛️ Project Workspace Structure

When Autopilot runs in any repository, it scaffolds the following structure:

```
<project-root>/
├── AGENTS.md                 # Project-specific entry point for repository agents
├── PLANS.md                  # Project roadmap and active task index
├── BUGS.md                   # Project bug and issue tracking ledger
└── .agents/
    ├── agents/               # Project-specific specialized agents (e.g. architect.md, reviewer.md)
    ├── skills/               # Project-specific domain workflows & scripts
    ├── rules/                # Project safety & code style rules (rules/safety.md)
    ├── plans/                # Detailed plan files (e.g. 001-feature.md)
    ├── bugs/                 # Individual defect tracking files (e.g. BUG-001.md)
    └── templates/            # YAML templates and central INDEX.md
```

---

## 📜 License

MIT License. Free for personal, academic, and commercial use.

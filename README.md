# 🤖 Autopilot — Universal Safe Autopilot Plugin for AI Clients

> **The Universal Safe Autopilot Plugin & Autonomous Three-Stage Workflow Engine.**
> Enables safe, continuous autopilot mode in **OpenCode**, **Google Antigravity**, **GitHub Copilot**, **Claude Code**, **Cursor**, **Windsurf**, and **Cline / Roo Code**. Compatible with 100% free offline models (Ollama, LM Studio) and major cloud APIs (Claude, Gemini, OpenAI). Part of the **HELIX Origin** ecosystem.

---

## 🌟 Supported AI Clients & Plugin Modes

| AI Client | Plugin / Integration Mode | Enable Command |
|---|---|---|
| **OpenCode** | Native plugin (`plugins/autopilot.ts`), primary agent, skills & templates | `autopilot enable opencode` |
| **Google Antigravity** | Antigravity plugin manifest (`plugin.json`) and agent skill (`SKILL.md`) | `autopilot enable antigravity` |
| **GitHub Copilot** | VS Code global custom instructions & `.github/copilot-instructions.md` | `autopilot enable copilot` |
| **Claude Code** | `CLAUDE.md` autonomous workflow rules & verification contracts | `autopilot enable claude` |
| **Cursor & Windsurf** | `.cursorrules`, `.cursor/rules/autopilot.mdc`, and `.windsurfrules` | `autopilot enable cursor` |
| **Cline & Roo Code** | Custom Autopilot mode definition (`.roomodes` / `custom_modes.json`) | `autopilot enable cline` |
| **All Clients** | One-shot setup across all installed AI tools | `autopilot enable --all` |

---

## ⚡ Key Highlights

- 🛡️ **Un-Bypassable Programmatic Safety**: Pre-execution interceptor automatically blocks dangerous commands (e.g. `rm -rf /`, `format`, `diskpart`, `git push --force`, `git clean -fxd`).
- ⚡ **Three-Stage Autonomous Execution**:
  - **Stage 0: Workspace Setup**: Inspects project tech stack, creates `.agents/` structure, and collaboratively drafts project agents, skills, and templates.
  - **Stage 1: Exploration & Task Planning**: Analyzes dependencies, formulates structured plans, and defines verifiable acceptance criteria.
  - **Stage 2: Continuous Build & Verification**: Executes step-by-step, batches operations, runs verification tests, and never stops mid-work.
- 🌐 **Multi-AI Provider Hub**: Connects to Ollama (`localhost:11434`), LM Studio (`localhost:1234`), LocalAI, Claude, Gemini, and OpenAI.
- 📂 **Standardized Project Workspace Structure**: Establishes mandatory root entry points (`AGENTS.md`, `PLANS.md`, `BUGS.md`) and `.agents/` subdirectories.
- 🧠 **Institutional Project Memory**: YAML templates and central `INDEX.md` catalog project-specific architecture patterns.

---

## 📚 Multi-Page Documentation

| Guide | Description |
|---|---|
| [**01. Getting Started**](docs/01-GETTING-STARTED.md) | Installation (Client plugin vs Standalone CLI) and multi-AI configuration |
| [**02. Three-Stage Workflow**](docs/02-THREE-STAGE-WORKFLOW.md) | Deep dive into Stage 0 (Setup), Stage 1 (Plan), and Stage 2 (Build & Verify) |
| [**03. Workspace Architecture**](docs/03-WORKSPACE-ARCHITECTURE.md) | Structure of `.agents/` and mandatory root files (`AGENTS.md`, `PLANS.md`, `BUGS.md`) |
| [**04. Mandatory Safety Rules**](docs/04-MANDATORY-SAFETY-RULES.md) | The Two-Phase Safety Model and programmatic command interceptor |
| [**05. Institutional Memory & Templates**](docs/05-INSTITUTIONAL-MEMORY-AND-TEMPLATES.md) | Writing and using YAML templates for consistent code generation |
| [**06. Configuration & Customization**](docs/06-CONFIGURATION-AND-CUSTOMIZATION.md) | Customizing `opencode.jsonc`, AI providers, agent prompts, and lifecycle hooks |
| [**07. Troubleshooting & FAQ**](docs/07-TROUBLESHOOTING-AND-FAQ.md) | Common questions, debugging plugin events, and error recovery |
| [**08. Antigravity, Copilot & Multi-Client**](docs/08-ANTIGRAVITY-AND-COPILOT-INTEGRATION.md) | Multi-client integration guide for Antigravity, Copilot, Claude, Cursor, and Cline |

---

## ⚡ Quick Start

### 1. Installation & Standalone Launchers

```bash
# Clone the repository
git clone https://github.com/HELIX-Origin/Autopilot.git
cd Autopilot
npm install
npm run build

# Install portable, drive-agnostic standalone launchers (D:\helix\bin, C:\helix\bin, etc.):
node lib/cli.js install-global
```

### 2. Standalone CLI Usage (Works with Any Tool)

```bash
# Check project workspace status & AI providers
autopilot status

# Initialize .agents/ structure and root entry files in any repository
autopilot init

# Generate an autonomous execution plan using local Ollama ($0 credits)
autopilot plan "Implement JWT authentication with refresh tokens"

# Generate a plan using Claude or Gemini
autopilot plan "Design microservice event bus" --provider anthropic
autopilot plan "Create database migration workflow" --provider gemini

# Query AI provider directly
autopilot query "Explain clean architecture in TypeScript"
```

### 3. OpenCode Plugin Setup

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

Copy the plugin and prompt:
```bash
cp src/index.ts ~/.config/opencode/plugins/autopilot.ts
cp agents/autopilot.md ~/.config/opencode/agents/autopilot.md
cp -r templates ~/.config/opencode/templates
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

This project is licensed under the **BSD 3-Clause License** ("New" or "Revised" License). See [LICENSE.md](LICENSE.md) for full terms.

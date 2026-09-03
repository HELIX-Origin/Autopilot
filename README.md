# 🤖 Autopilot — Multi-AI Autonomous Workflow Engine & OpenCode Plugin

> **The Universal, Safe, Three-Stage Autonomous AI Engine & Project Workspace Framework.**
> Compatible with **OpenCode**, **Cursor**, **VS Code**, **Windsurf**, and **Terminal CLI**. Connects to **100% free offline models** (Ollama, LM Studio, llama.cpp) and major cloud APIs (Claude, Gemini, OpenAI). Part of the **HELIX Origin** ecosystem.

---

## 🌟 Key Highlights

- ⚡ **Three-Stage Autonomous Execution**:
  - **Stage 0: Workspace Setup & Intelligent Scaffolding**: Inspects project tech stack, creates `.agents/` structure, and collaboratively drafts detailed project agents, skills, and templates.
  - **Stage 1: Exploration & Task Planning**: Analyzes dependencies, formulates structured plans, and defines verifiable acceptance criteria.
  - **Stage 2: Continuous Build & Verification**: Executes step-by-step, batches operations, runs verification tests, and never stops mid-work.
- 🌐 **Multi-AI Provider Hub**:
  - **Local Offline ($0 Credits)**: Ollama (`localhost:11434`), LM Studio (`localhost:1234`), LocalAI (`localhost:8080`), llama.cpp, vLLM.
  - **Cloud APIs (Optional)**: Anthropic Claude (Sonnet 3.5), OpenAI (GPT-4o), Google Gemini (Gemini 2.0 Flash).
- 🖥️ **Dual Operational Modes**:
  - **Native OpenCode Plugin**: Seamless lifecycle hooks and pre-execution safety interceptor for OpenCode sessions.
  - **Standalone Terminal CLI**: Run `autopilot init`, `autopilot plan`, `autopilot query` in any terminal, editor, or CI/CD environment.
- 🛡️ **Un-Bypassable Programmatic Safety**: Pre-execution interceptor automatically blocks dangerous commands (e.g. `rm -rf /`, `format`, `diskpart`, `git push --force`, `git clean -fxd`).
- 📂 **Standardized Project Workspace Structure**: Establishes mandatory root entry points (`AGENTS.md`, `PLANS.md`, `BUGS.md`) and `.agents/` subdirectories.
- 🧠 **Institutional Project Memory**: YAML templates and central `INDEX.md` catalog project-specific architecture patterns (components, API routes, services, tests).

---

## 📚 Multi-Page Documentation

| Guide | Description |
|---|---|
| [**01. Getting Started**](docs/01-GETTING-STARTED.md) | Installation (OpenCode plugin vs Standalone CLI) and multi-AI configuration |
| [**02. Three-Stage Workflow**](docs/02-THREE-STAGE-WORKFLOW.md) | Deep dive into Stage 0 (Setup), Stage 1 (Plan), and Stage 2 (Build & Verify) |
| [**03. Workspace Architecture**](docs/03-WORKSPACE-ARCHITECTURE.md) | Structure of `.agents/` and mandatory root files (`AGENTS.md`, `PLANS.md`, `BUGS.md`) |
| [**04. Mandatory Safety Rules**](docs/04-MANDATORY-SAFETY-RULES.md) | The Two-Phase Safety Model and programmatic command interceptor |
| [**05. Institutional Memory & Templates**](docs/05-INSTITUTIONAL-MEMORY-AND-TEMPLATES.md) | Writing and using YAML templates for consistent code generation |
| [**06. Configuration & Customization**](docs/06-CONFIGURATION-AND-CUSTOMIZATION.md) | Customizing `opencode.jsonc`, AI providers, agent prompts, and lifecycle hooks |
| [**07. Troubleshooting & FAQ**](docs/07-TROUBLESHOOTING-AND-FAQ.md) | Common questions, debugging plugin events, and error recovery |

---

## ⚡ Quick Start

### 1. Global Installation

```bash
# Clone the repository
git clone https://github.com/HELIX-Origin/Autopilot.git
cd Autopilot
npm install
npm run build
npm link
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

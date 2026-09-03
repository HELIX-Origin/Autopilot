# 01. Getting Started with Autopilot

Welcome to **Autopilot**! Autopilot can be run as a **native OpenCode plugin** or as a **standalone Multi-AI CLI runner** compatible with any AI tool, editor (Cursor, VS Code, Windsurf, Neovim), or terminal.

---

## 1. System Requirements

- **Node.js**: v18.0.0 or higher.
- **AI Backend (Choose at least one)**:
  - **Local Offline (Free, $0 Credits)**: Ollama (`localhost:11434`), LM Studio (`localhost:1234`), LocalAI (`localhost:8080`), or llama.cpp.
  - **Cloud APIs (Optional)**: Anthropic Claude, OpenAI, Google Gemini.
- **OpenCode** *(Optional)*: If running inside OpenCode.

---

## 2. Installation & Build

### Step 1: Clone Repository
```bash
git clone https://github.com/HELIX-Origin/Autopilot.git
cd Autopilot
```

### Step 2: Install Dependencies & Build
```bash
npm install
npm run build
```

### Step 3: Install Standalone Launchers (`install-global`)
```bash
# Auto-detects current drive (e.g. D:\helix\bin on D:, C:\helix\bin on C:):
node lib/cli.js install-global

# Or specify custom folder on any drive:
node lib/cli.js install-global --dir "D:\helix"
# or
node lib/cli.js install-global --dir "E:\helix"
```

---

## 3. Usage Modes

### Mode A: Standalone CLI (Works with Any AI Tool / Editor)

Run Autopilot directly from any terminal, Cursor, or VS Code terminal:

```bash
# Check repository workspace status & AI provider health
autopilot status

# Initialize .agents/ and AGENTS.md, PLANS.md, BUGS.md in current project
autopilot init

# Plan a task with local Ollama ($0 credits)
autopilot plan "Create user authentication middleware"

# Plan with Claude, OpenAI, or Gemini
autopilot plan "Refactor database schema" --provider anthropic
autopilot plan "Build REST endpoint with validation" --provider gemini

# Query the AI hub
autopilot query "Explain the repository pattern in TypeScript"
```

---

### Mode B: Native OpenCode Plugin Setup

1. Add `autopilot` to your `~/.config/opencode/opencode.jsonc`:
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

2. Copy files to OpenCode configuration directory:
```bash
# On Linux / macOS:
mkdir -p ~/.config/opencode/plugins ~/.config/opencode/agents ~/.config/opencode/templates
cp src/index.ts ~/.config/opencode/plugins/autopilot.ts
cp agents/autopilot.md ~/.config/opencode/agents/autopilot.md
cp -r templates/* ~/.config/opencode/templates/

# On Windows (PowerShell / CMD):
# Copy src/index.ts to %USERPROFILE%\.config\opencode\plugins\autopilot.ts
# Copy agents/autopilot.md to %USERPROFILE%\.config\opencode\agents\autopilot.md
# Copy templates/ to %USERPROFILE%\.config\opencode\templates\
```

3. Launch OpenCode with Autopilot:
```bash
opencode --agent autopilot
```

---

## 4. Configuring AI Providers

Provider settings are stored in `~/.config/opencode/ai-providers.json` or read from standard environment variables:

```bash
# Local Ollama (Default, 0 Credits)
export OLLAMA_HOST="http://127.0.0.1:11434"

# Cloud Providers (Optional)
export ANTHROPIC_API_KEY="sk-ant-..."
export GEMINI_API_KEY="AIzaSy..."
export OPENAI_API_KEY="sk-..."
```

Inspect active providers:
```bash
autopilot providers
```

---

## 5. Next Steps

- Explore the 3-stage lifecycle in [**02. Three-Stage Workflow**](02-THREE-STAGE-WORKFLOW.md).
- Learn about the `.agents/` structure in [**03. Workspace Architecture**](03-WORKSPACE-ARCHITECTURE.md).
- Review safety rules in [**04. Mandatory Safety Rules**](04-MANDATORY-SAFETY-RULES.md).
- Learn how to write reusable code templates in [**05. Institutional Memory & Templates**](05-INSTITUTIONAL-MEMORY-AND-TEMPLATES.md).

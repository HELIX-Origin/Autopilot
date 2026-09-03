# 01. Getting Started with Helix Autopilot

Welcome to **Helix Autopilot**! This guide walks you through setting up and configuring the Autopilot plugin for OpenCode.

---

## 1. System Requirements

- **OpenCode**: Installed and accessible in your environment.
- **Node.js**: v18.0.0 or higher.
- **TypeScript**: v5.0.0 or higher (for building from source).

---

## 2. Global Installation (Recommended)

Installing globally makes Autopilot available across every repository on your machine.

### Step 1: Clone Repository
```bash
git clone https://github.com/HELIX-Origin/Helix-Autopilot.git
cd Helix-Autopilot
```

### Step 2: Install & Build
```bash
npm install
npm run build
```

### Step 3: Copy to OpenCode Configuration Directory
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

---

## 3. Configuring `opencode.jsonc`

Add the `autopilot` agent definition to your `~/.config/opencode/opencode.jsonc`:

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

---

## 4. Running Autopilot

Open any project repository in OpenCode and switch the active agent to **autopilot**:

```bash
# Via OpenCode UI:
Select "Autopilot" from the agent selector.

# Via Command Line:
opencode --agent autopilot
```

---

## 5. Next Steps

- Understand the execution lifecycle in [**02. Three-Stage Workflow**](02-THREE-STAGE-WORKFLOW.md).
- Learn about `.agents/` and entry files in [**03. Workspace Architecture**](03-WORKSPACE-ARCHITECTURE.md).
- Review safety policies in [**04. Mandatory Safety Rules**](04-MANDATORY-SAFETY-RULES.md).

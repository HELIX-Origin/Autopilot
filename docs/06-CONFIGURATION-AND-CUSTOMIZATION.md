# 06. Configuration & Customization Guide

Learn how to customize Helix Autopilot for your specific workflow, permissions, and editor setup.

---

## 1. Global vs. Local Configuration

### Global Configuration (`~/.config/opencode/opencode.jsonc`)
Controls global agent settings and plugins across all projects:
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

### Local Project Rules (`.agents/rules/`)
You can add project-specific rules in `.agents/rules/` (e.g. `styling.md`, `git-workflow.md`) that Autopilot will automatically read during Stage 1.

---

## 2. Customizing Agent System Prompts

To adjust the Autopilot agent prompt, edit `~/.config/opencode/agents/autopilot.md` or `.agents/agents/autopilot.md`.

You can configure:
- **Additional Verification Commands**: Require `npm run lint` or `cargo clippy` before concluding Stage 2.
- **Specific Output Formats**: Mandate conventional commit formats or changelog updates.

---

## 3. Extending the Safety Interceptor

To add custom blocked commands or paths, pass custom rules into the `AutopilotPlugin` in your OpenCode plugin configuration:

```typescript
import { AutopilotPlugin } from "helix-autopilot"

export default AutopilotPlugin
```

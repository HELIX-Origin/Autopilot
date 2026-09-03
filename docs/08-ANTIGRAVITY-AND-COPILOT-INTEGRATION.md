# 08. Google Antigravity & GitHub Copilot Integration

**Autopilot** provides first-class support for both **Google Antigravity (AGY)** and **GitHub Copilot**, allowing automated pair programmers to execute complex workflows safely without mid-work interruptions.

---

## 1. Google Antigravity Integration

Autopilot includes a ready-to-use **Antigravity Skill** (`skills/autopilot/SKILL.md`) that teaches Antigravity agents how to execute the 3-stage workflow and enforce the Two-Phase Safety Model.

### Installing the Skill in Antigravity
Copy the skill into your Antigravity skills directory:
```bash
cp -r skills/autopilot ~/.gemini/antigravity/skills/
```

### What Antigravity Agents Gain:
- Automatic Stage 0 scaffolding (`.agents/`, `AGENTS.md`, `PLANS.md`, `BUGS.md`).
- Structured execution planning with acceptance criteria in `.agents/plans/`.
- Uninterrupted Stage 2 execution with self-healing verification loops.
- Access to institutional project memory templates via `.agents/templates/INDEX.md`.

---

## 2. GitHub Copilot Integration

Autopilot provides repository-level **GitHub Copilot Custom Instructions** located in `.github/copilot-instructions.md`.

### Features for GitHub Copilot:
- **Chat Participant Alignment**: Copilot Chat automatically operates under the three-stage workflow.
- **Safety Enforcement**: Copilot is instructed to follow the Copy-Before-Delete and Verify-Before-Delete models.
- **Template Utilization**: Copilot references `.agents/templates/INDEX.md` when authoring new components, services, or API endpoints.

---

## 3. Visual Studio Code / Cursor Configuration

Add to `.vscode/settings.json` to enable full Copilot and Antigravity compliance:
```json
{
  "github.copilot.chat.customInstructions": {
    "always": "Follow instructions in .github/copilot-instructions.md and honor the Three-Stage Autopilot Workflow."
  }
}
```

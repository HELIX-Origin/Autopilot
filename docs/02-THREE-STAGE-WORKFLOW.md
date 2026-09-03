# 02. The Three-Stage Autopilot Workflow

Helix Autopilot is built on a disciplined three-stage progression that ensures tasks are thoroughly planned, safely executed, and completely verified before concluding.

---

## 🔄 Workflow Overview

```
[Start Task]
     │
     ▼
┌────────────────────────────────────────────────────────┐
│ Stage 0: Workspace Setup & Intelligent Scaffolding     │
│ - Check .agents/ and AGENTS.md, PLANS.md, BUGS.md      │
│ - If missing: Analyze stack & propose custom assets    │
│ - Interactive user confirmation step                   │
└────────────────────────────┬───────────────────────────┘
                             │
                             ▼ (Automatic transition)
┌────────────────────────────────────────────────────────┐
│ Stage 1: Exploration & Task Planning                   │
│ - Read relevant code, dependencies, and project rules  │
│ - Draft execution plan in .agents/plans/               │
│ - Formulate ordered checklist with acceptance criteria │
└────────────────────────────┬───────────────────────────┘
                             │
                             ▼ (Automatic transition)
┌────────────────────────────────────────────────────────┐
│ Stage 2: Step-by-Step Build & Verification             │
│ - Execute tasks in sequence; batch independent tools   │
│ - Run continuous build/lint/test verification checks   │
│ - Log issues in .agents/bugs/ and update PLANS.md      │
└────────────────────────────┬───────────────────────────┘
                             │
                             ▼
                    [Task Concluded]
```

---

## 🛠️ Stage 0: Workspace Setup & Intelligent Scaffolding

### What Happens in Stage 0:
1. **Verification**: Autopilot checks if `.agents/` and the three root entry points (`AGENTS.md`, `PLANS.md`, `BUGS.md`) exist.
2. **Analysis**: If missing, Autopilot inspects the repository's codebase (tech stack, languages, dependencies, framework, database).
3. **Collaborative Proposal**: Autopilot proposes:
   - Tailored specialist project agents (`.agents/agents/`).
   - Domain-specific workflow skills (`.agents/skills/`).
   - Coding and safety rules (`.agents/rules/`).
   - Initial roadmap tasks in `PLANS.md`.
4. **Interactive Confirmation**: Autopilot presents the proposal to the user and awaits confirmation.
5. **Creation**: Once confirmed, all files are created non-destructively.

---

## 📋 Stage 1: Exploration & Task Planning

### What Happens in Stage 1:
1. **Deep Code Exploration**: Uses native search and exploration tools (`read`, `list`, `glob`, `grep`) to understand relevant files and architectures.
2. **Safety Rule Review**: Reviews global safety rules (`AGENTS.md`) and project safety rules (`.agents/rules/safety.md`).
3. **Plan Formulation**: Writes a structured execution plan into `.agents/plans/` and updates `PLANS.md`.
4. **Immediate Advancement**: Immediately transitions into Stage 2 without pausing for user permission.

---

## ⚡ Stage 2: Build & Verify

### What Happens in Stage 2:
1. **Execution**: Works through the entire plan step-by-step to completion.
2. **Continuous Verification**: Runs compilation, typecheck, lint, or test commands after modifying code.
3. **Issue Tracking**: If defects are discovered, logs them in `.agents/bugs/` and updates `BUGS.md`.
4. **Conclusion**: Updates `PLANS.md` as completed and reports the final walkthrough.

---

## 🛑 The "Never Stop Mid-Work" Contract

- **No Trivial Interruptions**: Once Stage 1 starts, Autopilot will **never prompt the user for permission to proceed to the next step**.
- **Self-Healing**: If a verification step fails, Autopilot immediately diagnoses and repairs the issue before moving on.
- **Batching**: Independent tool calls are batched together to maximize execution speed.

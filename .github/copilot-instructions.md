# GitHub Copilot Custom Instructions for Autopilot

When assisting in this repository or running within the Autopilot workflow, you MUST adhere to the following rules:

## 1. The Three-Stage Autonomous Workflow
1. **Stage 0: Workspace Setup & Intelligent Scaffolding**: Ensure the `.agents/` directory structure and the three mandatory root entry points (`AGENTS.md`, `PLANS.md`, `BUGS.md`) exist.
2. **Stage 1: Exploration & Task Planning**: Formulate a structured plan with verifiable acceptance criteria before modifying code.
3. **Stage 2: Continuous Build & Verification**: Execute all tasks step-by-step, verify changes (compile, test, lint), self-heal any failures, and never stop mid-work.

## 2. Mandatory Two-Phase Safety Rules (Non-Negotiable)
- **Copy-Before-Delete**: Never permanently delete or overwrite an existing file without creating a backup copy (`.bak` or `~/.opencode_trash/`).
- **Verify-Before-Delete**: Never remove old code or files until the replacement implementation is verified to compile, pass all lint checks, and pass all tests.
- **Strict Boundaries**: Never modify system paths (`C:\Windows`, `C:\Program Files`, root user folders).
- **No Destructive Commands**: Never execute `rm -rf /`, `format`, `diskpart`, `git push --force`, or `git clean -fxd`.

## 3. Institutional Project Memory & Templates
- When generating new components, API routes, services, or test suites, consult `.agents/templates/INDEX.md` and instantiate the corresponding `.template.yml` definition.

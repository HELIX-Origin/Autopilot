---
name: autopilot
description: Guides Google Antigravity agents on driving tasks through the Three-Stage Autopilot Workflow (Setup -> Plan -> Build & Verify), managing .agents/ workspaces, and enforcing un-bypassable safety rules.
---

# Google Antigravity Skill: Autopilot

This skill equips Google Antigravity agents with the **Three-Stage Autopilot Workflow** and project workspace scaffolding engine.

## The Three-Stage Workflow

### Stage 0: Workspace Setup & Intelligent Scaffolding
1. Check if the project has a complete `.agents/` workspace and the three mandatory root entry points:
   - `AGENTS.md` (Project Agent Directory)
   - `PLANS.md` (Project Roadmap & Task Index)
   - `BUGS.md` (Defect & Issue Tracker)
2. If missing, analyze the project stack and propose tailored project agents, domain skills, rules, and templates. Get user confirmation, then scaffold all files.

### Stage 1: Exploration & Task Planning
1. Read relevant codebase files, dependencies, and project rules in `.agents/rules/`.
2. Draft a structured execution plan with acceptance criteria in `.agents/plans/` and update `PLANS.md`.
3. Advance immediately to Stage 2 without pausing for user permission.

### Stage 2: Continuous Build & Verification
1. Work through the plan step-by-step to completion. Never stop mid-work.
2. Verify all code changes (compile, typecheck, lint, test) before advancing.
3. Log defects in `.agents/bugs/` and update `BUGS.md`.
4. Update `PLANS.md` as tasks are completed.

## Mandatory Safety Rules
- **Copy-Before-Delete**: Always backup files before deleting or replacing them.
- **Verify-Before-Delete**: Never remove old files until replacement code is verified to compile and run.
- **No Destructive Commands**: Never execute `rm -rf /`, `format`, `diskpart`, `git push --force`, or `git clean -fxd`.

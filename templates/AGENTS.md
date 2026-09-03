# Project Agents Directory

This file is the root entry point for all **project-specific specialized agents** configured in `.agents/agents/` for this repository.

## Active Project Agents

| Agent Name | Role / Description | Mode | File Link |
|---|---|---|---|
| Project Architect | High-level system architecture and module planning | Secondary | `.agents/agents/architect.md` |
| Code Reviewer | Verification, linting, and quality review | Secondary | `.agents/agents/reviewer.md` |

## How to Add Project Agents
1. Copy template from `.agents/templates/agent.md` to `.agents/agents/<name>.md`.
2. Define the agent's role, system prompt, and capabilities tailored to this project's stack.
3. Register the new agent in the table above.

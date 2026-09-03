# 📋 Template Catalog & Project Memory Index (`INDEX.md`)

> **The repository's central institutional memory. Contains YAML templates for both workspace management (agents, skills, plans) and reusable code architecture patterns (components, services, API routes, tests).**

When agents operate in this repository, they consult this catalog to **memorize and reproduce** the exact coding conventions, architectural layers, and structures established for this project.

---

## 🗂️ 1. Reusable Project Code & Architecture Templates

These templates encode the project's code patterns so agents always generate consistent, production-grade implementations:

| Template File | Category | Target Output | Description |
|---|---|---|---|
| [`component.template.yml`](component.template.yml) | Frontend | `src/components/{Name}.tsx` | UI component pattern with props interfaces, accessible JSX, and co-located tests. |
| [`api-endpoint.template.yml`](api-endpoint.template.yml) | Backend | `src/api/{resource}.ts` | REST/HTTP route pattern with schema validation (Zod/Pydantic) and error envelopes. |
| [`service.template.yml`](service.template.yml) | Architecture | `src/services/{Domain}Service.ts` | Domain business logic service isolating rules from transport/API layers. |
| [`test.template.yml`](test.template.yml) | Testing | `src/**/{name}.test.ts` | Standardized unit/integration test pattern using the Arrange-Act-Assert (AAA) layout. |

---

## 🤖 2. Agent & Workspace Meta-Templates

These templates define how new project agents, domain skills, plans, rules, and defects are structured:

| Template File | Category | Target Output | Description |
|---|---|---|---|
| [`agent.template.yml`](agent.template.yml) | Agents | `.agents/agents/<name>.md` | Specialized project-level agent configuration, system prompts, and responsibilities. |
| [`skill.template.yml`](skill.template.yml) | Skills | `.agents/skills/<name>.md` | Actionable domain workflows, migration scripts, and multi-step procedures. |
| [`rule.template.yml`](rule.template.yml) | Rules | `.agents/rules/<name>.md` | Repository-specific architecture, code style, and safety policies. |
| [`plan.template.yml`](plan.template.yml) | Plans | `.agents/plans/<id>-<name>.md` | Structured task execution plans with milestones, steps, and acceptance criteria. |
| [`bug.template.yml`](bug.template.yml) | Defects | `.agents/bugs/BUG-<id>.md` | Structured bug tracking ledger with reproduction steps and root-cause analysis. |

---

## 🧠 How Agents Use Templates for Institutional Memory

1. **Pattern Lookup**: Before creating a new file (e.g. an API endpoint or UI component), the agent queries `.agents/templates/INDEX.md` to find the approved project pattern.
2. **Schema Conformance**: The agent instantiates the corresponding `.template.yml` file, ensuring all imports, interfaces, naming conventions, error handling envelopes, and testing styles match the repository's standard.
3. **Continuous Consistency**: As the project evolves, developers can add or refine templates in `.agents/templates/`, updating the agent's memory without modifying system prompts.

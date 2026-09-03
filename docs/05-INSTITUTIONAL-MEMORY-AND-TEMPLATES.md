# 05. Institutional Memory & Reusable Project Templates

Helix Autopilot uses `.agents/templates/` as the repository's **institutional memory**. Storing templates as structured YAML files cataloged in `INDEX.md` enables agents to consistently reproduce the repository's exact architecture and coding patterns.

---

## 🧠 Why Institutional Memory Matters

In large or long-running projects, different AI sessions or agents might use inconsistent styles (e.g. mix arrow functions with classes, use different error envelopes, or omit validation).

By consulting `.agents/templates/INDEX.md`, every agent:
1. Understands the repository's preferred conventions.
2. Generates code that exactly matches the project's imports, interfaces, and architecture.
3. Automatically co-locates unit tests and error handlers.

---

## 📋 Structure of the Template Catalog

```
.agents/templates/
├── INDEX.md                        # Master index cataloging all templates and schemas
├── component.template.yml          # Reusable UI component pattern
├── api-endpoint.template.yml       # Reusable REST / API route pattern
├── service.template.yml            # Domain service logic pattern
├── test.template.yml               # Reusable test suite pattern (Arrange-Act-Assert)
├── agent.template.yml              # Schema for creating project agents
├── skill.template.yml              # Schema for creating domain skills
├── rule.template.yml               # Schema for creating repository rules
├── plan.template.yml               # Schema for task execution plans
└── bug.template.yml                # Schema for defect reports
```

---

## 🛠️ How to Add Custom Project Templates

1. Create a new `.template.yml` file in `.agents/templates/`:
   ```yaml
   # .agents/templates/repository.template.yml
   version: "1.0"
   type: "code-template"
   name: "repository"
   description: "Data access repository layer with Prisma / TypeORM"
   
   structure:
     interface: |
       export interface I{Entity}Repository {
         find(id: string): Promise<{Entity} | null>;
       }
   ```
2. Register the template in `.agents/templates/INDEX.md`.
3. All agents working in the repository will immediately adopt and instantiate this pattern when building data repositories.

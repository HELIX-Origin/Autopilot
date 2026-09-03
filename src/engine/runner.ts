import * as fs from "fs"
import * as path from "path"
import { UniversalAIHub } from "../ai/providers"

export interface WorkspaceStatus {
  hasAgentsDir: boolean
  hasAgentsMd: boolean
  hasPlansMd: boolean
  hasBugsMd: boolean
  isComplete: boolean
  missing: string[]
}

export class AutopilotRunner {
  public static checkWorkspace(projectRoot = process.cwd()): WorkspaceStatus {
    const agentsDir = path.join(projectRoot, ".agents")
    const agentsMd = path.join(projectRoot, "AGENTS.md")
    const plansMd = path.join(projectRoot, "PLANS.md")
    const bugsMd = path.join(projectRoot, "BUGS.md")

    const missing: string[] = []
    if (!fs.existsSync(agentsDir)) missing.push(".agents/")
    if (!fs.existsSync(agentsMd)) missing.push("AGENTS.md")
    if (!fs.existsSync(plansMd)) missing.push("PLANS.md")
    if (!fs.existsSync(bugsMd)) missing.push("BUGS.md")

    const subdirs = ["agents", "skills", "rules", "plans", "bugs", "templates"]
    for (const sub of subdirs) {
      if (!fs.existsSync(path.join(agentsDir, sub))) {
        missing.push(`.agents/${sub}/`)
      }
    }

    return {
      hasAgentsDir: fs.existsSync(agentsDir),
      hasAgentsMd: fs.existsSync(agentsMd),
      hasPlansMd: fs.existsSync(plansMd),
      hasBugsMd: fs.existsSync(bugsMd),
      isComplete: missing.length === 0,
      missing,
    }
  }

  public static initWorkspace(projectRoot = process.cwd()): { success: boolean; created: string[] } {
    const created: string[] = []
    const agentsDir = path.join(projectRoot, ".agents")
    const subdirs = ["agents", "skills", "rules", "plans", "bugs", "templates"]

    for (const sub of subdirs) {
      const p = path.join(agentsDir, sub)
      if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true })
        created.push(`.agents/${sub}/`)
      }
    }

    // 1. Root AGENTS.md
    const agentsMd = path.join(projectRoot, "AGENTS.md")
    if (!fs.existsSync(agentsMd)) {
      const content = `# Project Agents Directory\n\nThis file is the root entry point for all project-specific specialized agents configured in \`.agents/agents/\`.\n\n## Active Project Agents\n\n| Agent Name | Role / Description | Mode | File Link |\n|---|---|---|---|\n| Autopilot | Primary Autonomous Workflow Driver | Primary | \`.agents/agents/autopilot.md\` |\n`
      fs.writeFileSync(agentsMd, content, "utf8")
      created.push("AGENTS.md")
    }

    // 2. Root PLANS.md
    const plansMd = path.join(projectRoot, "PLANS.md")
    if (!fs.existsSync(plansMd)) {
      const content = `# Project Plans & Roadmap\n\nThis file is the root entry point for tracking active, completed, and upcoming task plans in \`.agents/plans/\`.\n\n## Active Plans\n\n| Plan ID | Title | Status | Target File |\n|---|---|---|---|\n| PLAN-001 | Initial Workspace Setup | Completed | \`.agents/plans/001-workspace-setup.md\` |\n\n## Completed Plans\n\n| Plan ID | Title | Completion Date |\n|---|---|---|\n`
      fs.writeFileSync(plansMd, content, "utf8")
      created.push("PLANS.md")
    }

    // 3. Root BUGS.md
    const bugsMd = path.join(projectRoot, "BUGS.md")
    if (!fs.existsSync(bugsMd)) {
      const content = `# Project Bug Tracker\n\nThis file is the root entry point for logging, tracking, and resolving bugs and defects in \`.agents/bugs/\`.\n\n## Open Bugs\n\n| Bug ID | Title | Severity | Status | File Link |\n|---|---|---|---|---|\n\n## Resolved Bugs\n\n| Bug ID | Title | Resolution Summary | Resolved Date |\n|---|---|---|---|\n`
      fs.writeFileSync(bugsMd, content, "utf8")
      created.push("BUGS.md")
    }

    // 4. Default safety rule
    const safetyRule = path.join(agentsDir, "rules", "safety.md")
    if (!fs.existsSync(safetyRule)) {
      const safetyContent = `# Project Safety Rules\n\n## 1. Non-Negotiable Safety Model\n- **Copy-Before-Delete**: Always backup files before deleting or replacing.\n- **Verify-Before-Delete**: Verify code compiles and passes tests before removing old files.\n`
      fs.writeFileSync(safetyRule, safetyContent, "utf8")
      created.push(".agents/rules/safety.md")
    }

    return { success: true, created }
  }

  public static async createPlan(
    task: string,
    options: { projectRoot?: string; provider?: string; model?: string } = {}
  ): Promise<{ success: boolean; planFile: string; content: string }> {
    const root = options.projectRoot || process.cwd()
    this.initWorkspace(root)

    const planId = `PLAN-${String(Date.now()).slice(-4)}`
    const prompt = `Create a structured 3-stage execution plan for the following task in markdown format:
Task: ${task}

Format with:
- Objective
- Acceptance Criteria (checkboxes)
- Step-by-Step implementation phases
- Verification commands (compile, test, lint)`

    const aiRes = await UniversalAIHub.query(prompt, {
      providerName: options.provider,
      model: options.model,
      system: "You are the Autopilot planning engine. Produce concise, rigorous, verifiable implementation plans.",
    })

    const planContent = `# Plan ${planId}: ${task}\n\n**Status**: Active  \n**Generated via**: ${aiRes.provider} (${aiRes.model})\n\n${aiRes.content}\n`
    const planFileName = `${planId.toLowerCase()}-${task.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}.md`
    const planPath = path.join(root, ".agents", "plans", planFileName)

    fs.writeFileSync(planPath, planContent, "utf8")

    // Update root PLANS.md
    const plansMd = path.join(root, "PLANS.md")
    if (fs.existsSync(plansMd)) {
      const row = `| ${planId} | ${task} | Active | \`.agents/plans/${planFileName}\` |\n`
      let current = fs.readFileSync(plansMd, "utf8")
      if (current.includes("## Active Plans")) {
        current = current.replace("## Active Plans\n\n| Plan ID", `## Active Plans\n\n${row}| Plan ID`)
        fs.writeFileSync(plansMd, current, "utf8")
      }
    }

    return { success: true, planFile: `.agents/plans/${planFileName}`, content: planContent }
  }
}

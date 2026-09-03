import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import { ClientInstallResult } from "./opencode"

export class CopilotAdapter {
  public static readonly name = "copilot"
  public static readonly displayName = "GitHub Copilot"
  public static readonly description = "GitHub Copilot instructions & VS Code global Autopilot behavior enforcement."

  public static isInstalled(): boolean {
    const settingsPath = path.join(os.homedir(), "AppData", "Roaming", "Code", "User", "settings.json")
    if (!fs.existsSync(settingsPath)) return false
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"))
      return !!settings["github.copilot.chat.customInstructions"]
    } catch {
      return false
    }
  }

  public static install(workspaceRoot = process.cwd()): ClientInstallResult {
    try {
      const createdPaths: string[] = []

      // 1. Workspace .github/copilot-instructions.md
      const githubDir = path.join(workspaceRoot, ".github")
      fs.mkdirSync(githubDir, { recursive: true })

      const repoRoot = path.resolve(__dirname, "../../..")
      const srcInstructions = path.join(repoRoot, ".github", "copilot-instructions.md")
      const destInstructions = path.join(githubDir, "copilot-instructions.md")

      if (fs.existsSync(srcInstructions)) {
        fs.copyFileSync(srcInstructions, destInstructions)
      } else {
        const defaultInstructions = `# GitHub Copilot Autopilot Mode Instructions

You operate under the **Three-Stage Autopilot Workflow**:
- **Stage 0 (Setup)**: Ensure \`.agents/\` directory and \`AGENTS.md\`, \`PLANS.md\`, \`BUGS.md\` exist.
- **Stage 1 (Plan)**: Create a phased execution plan before modifying code.
- **Stage 2 (Build & Verify)**: Execute continuously, follow the Two-Phase Safety Model (Copy-Before-Delete, Verify-Before-Delete), and always run verification commands.
`
        fs.writeFileSync(destInstructions, defaultInstructions, "utf8")
      }
      createdPaths.push(destInstructions)

      // 2. Global VS Code settings
      const settingsPath = path.join(os.homedir(), "AppData", "Roaming", "Code", "User", "settings.json")
      if (fs.existsSync(settingsPath)) {
        try {
          const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"))
          settings["github.copilot.chat.customInstructions"] = {
            always: "Adhere to the Three-Stage Autopilot Workflow (Setup -> Plan -> Build & Verify) and Two-Phase Safety Model (Copy-Before-Delete, Verify-Before-Delete)."
          }
          fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4), "utf8")
          createdPaths.push(settingsPath)
        } catch {
          // Ignore settings parse errors
        }
      }

      return {
        client: this.displayName,
        success: true,
        paths: createdPaths,
        message: `Successfully configured Autopilot mode for GitHub Copilot in ${workspaceRoot}.`,
      }
    } catch (err: any) {
      return {
        client: this.displayName,
        success: false,
        paths: [],
        message: `Failed to configure Copilot adapter: ${err.message}`,
      }
    }
  }
}

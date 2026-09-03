import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import { ClientInstallResult } from "./opencode"

export class AntigravityAdapter {
  public static readonly name = "antigravity"
  public static readonly displayName = "Google Antigravity"
  public static readonly description = "Antigravity plugin with native skill and Three-Stage Autonomous Workflow rules."

  public static isInstalled(): boolean {
    const pluginDir = path.join(os.homedir(), ".gemini", "config", "plugins", "autopilot")
    const skillPath = path.join(pluginDir, "skills", "autopilot", "SKILL.md")
    return fs.existsSync(skillPath)
  }

  public static install(targetDir?: string): ClientInstallResult {
    try {
      const basePluginDir = targetDir || path.join(os.homedir(), ".gemini", "config", "plugins", "autopilot")
      const skillsDir = path.join(basePluginDir, "skills", "autopilot")
      fs.mkdirSync(skillsDir, { recursive: true })

      const repoRoot = path.resolve(__dirname, "../../..")
      const createdPaths: string[] = []

      // 1. plugin.json manifest
      const manifest = {
        name: "autopilot",
        version: "1.0.0",
        description: "Autonomous Three-Stage Workflow Engine & Project Scaffolding Framework",
        author: { name: "HELIX Origin" },
        license: "BSD-3-Clause",
        keywords: ["autopilot", "workflow", "safety", "scaffolding", "templates"]
      }
      const manifestPath = path.join(basePluginDir, "plugin.json")
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8")
      createdPaths.push(manifestPath)

      // 2. SKILL.md
      const srcSkill = path.join(repoRoot, "skills", "autopilot", "SKILL.md")
      const destSkill = path.join(skillsDir, "SKILL.md")
      if (fs.existsSync(srcSkill)) {
        fs.copyFileSync(srcSkill, destSkill)
        createdPaths.push(destSkill)
      }

      return {
        client: this.displayName,
        success: true,
        paths: createdPaths,
        message: `Successfully enabled Autopilot plugin for Google Antigravity (${basePluginDir}).`,
      }
    } catch (err: any) {
      return {
        client: this.displayName,
        success: false,
        paths: [],
        message: `Failed to install Antigravity adapter: ${err.message}`,
      }
    }
  }
}

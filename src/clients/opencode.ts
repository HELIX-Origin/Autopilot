import * as fs from "fs"
import * as path from "path"
import * as os from "os"

export interface ClientInstallResult {
  client: string
  success: boolean
  paths: string[]
  message: string
}

export class OpenCodeAdapter {
  public static readonly name = "opencode"
  public static readonly displayName = "OpenCode"
  public static readonly description = "Native OpenCode plugin, primary agent mode, skills, and templates."

  public static isInstalled(): boolean {
    const configDir = path.join(os.homedir(), ".config", "opencode")
    const pluginPath = path.join(configDir, "plugins", "autopilot.ts")
    return fs.existsSync(pluginPath)
  }

  public static install(targetDir?: string): ClientInstallResult {
    try {
      const baseDir = targetDir || path.join(os.homedir(), ".config", "opencode")
      const pluginsDir = path.join(baseDir, "plugins")
      const agentsDir = path.join(baseDir, "agents")
      const skillsDir = path.join(baseDir, "skills", "autopilot")
      const templatesDir = path.join(baseDir, "templates")

      fs.mkdirSync(pluginsDir, { recursive: true })
      fs.mkdirSync(agentsDir, { recursive: true })
      fs.mkdirSync(skillsDir, { recursive: true })
      fs.mkdirSync(templatesDir, { recursive: true })

      const repoRoot = path.resolve(__dirname, "../../..")
      const createdPaths: string[] = []

      // 1. Plugin
      const srcPlugin = path.join(repoRoot, "src", "index.ts")
      const destPlugin = path.join(pluginsDir, "autopilot.ts")
      if (fs.existsSync(srcPlugin)) {
        fs.copyFileSync(srcPlugin, destPlugin)
        createdPaths.push(destPlugin)
      }

      // 2. Agent
      const srcAgent = path.join(repoRoot, "agents", "autopilot.md")
      const destAgent = path.join(agentsDir, "autopilot.md")
      if (fs.existsSync(srcAgent)) {
        fs.copyFileSync(srcAgent, destAgent)
        createdPaths.push(destAgent)
      }

      // 3. Skill
      const srcSkill = path.join(repoRoot, "skills", "autopilot", "SKILL.md")
      const destSkill = path.join(skillsDir, "SKILL.md")
      if (fs.existsSync(srcSkill)) {
        fs.copyFileSync(srcSkill, destSkill)
        createdPaths.push(destSkill)
      }

      // 4. Templates
      const srcTplDir = path.join(repoRoot, "templates")
      if (fs.existsSync(srcTplDir)) {
        for (const file of fs.readdirSync(srcTplDir)) {
          const s = path.join(srcTplDir, file)
          const d = path.join(templatesDir, file)
          fs.copyFileSync(s, d)
          createdPaths.push(d)
        }
      }

      return {
        client: this.displayName,
        success: true,
        paths: createdPaths,
        message: `Successfully enabled Autopilot mode for OpenCode (${baseDir}).`,
      }
    } catch (err: any) {
      return {
        client: this.displayName,
        success: false,
        paths: [],
        message: `Failed to install OpenCode adapter: ${err.message}`,
      }
    }
  }
}

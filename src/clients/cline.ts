import * as fs from "fs"
import * as path from "path"
import { ClientInstallResult } from "./opencode"

export class ClineAdapter {
  public static readonly name = "cline"
  public static readonly displayName = "Cline & Roo Code"
  public static readonly description = "Custom Autopilot mode definition (.roomodes / custom_modes.json) with safety rules."

  public static isInstalled(workspaceRoot = process.cwd()): boolean {
    return (
      fs.existsSync(path.join(workspaceRoot, ".roomodes")) ||
      fs.existsSync(path.join(workspaceRoot, ".cline", "custom_modes.json"))
    )
  }

  public static install(workspaceRoot = process.cwd()): ClientInstallResult {
    try {
      const createdPaths: string[] = []

      // 1. .roomodes (for Roo Code / Roo Clinic)
      const roomodesContent = {
        customModes: [
          {
            slug: "autopilot",
            name: "Autopilot",
            roleDefinition: "You are an autonomous engineering lead operating in Autopilot mode. You drive multi-step tasks through Setup -> Plan -> Build & Verify, enforce the Two-Phase Safety Model, and never stop mid-work.",
            groups: ["read", "edit", "browser", "command", "mcp"]
          }
        ]
      }
      const roomodesPath = path.join(workspaceRoot, ".roomodes")
      fs.writeFileSync(roomodesPath, JSON.stringify(roomodesContent, null, 2), "utf8")
      createdPaths.push(roomodesPath)

      // 2. .cline/custom_modes.json
      const clineDir = path.join(workspaceRoot, ".cline")
      fs.mkdirSync(clineDir, { recursive: true })
      const clineModesPath = path.join(clineDir, "custom_modes.json")
      fs.writeFileSync(clineModesPath, JSON.stringify(roomodesContent, null, 2), "utf8")
      createdPaths.push(clineModesPath)

      return {
        client: this.displayName,
        success: true,
        paths: createdPaths,
        message: `Successfully enabled Autopilot mode for Cline & Roo Code in ${workspaceRoot}.`,
      }
    } catch (err: any) {
      return {
        client: this.displayName,
        success: false,
        paths: [],
        message: `Failed to install Cline adapter: ${err.message}`,
      }
    }
  }
}

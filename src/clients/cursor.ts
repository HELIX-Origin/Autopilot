import * as fs from "fs"
import * as path from "path"
import { ClientInstallResult } from "./opencode"

export class CursorAdapter {
  public static readonly name = "cursor"
  public static readonly displayName = "Cursor & Windsurf"
  public static readonly description = "Rules and behavior definitions for Cursor (.cursorrules) and Windsurf (.windsurfrules)."

  public static isInstalled(workspaceRoot = process.cwd()): boolean {
    return (
      fs.existsSync(path.join(workspaceRoot, ".cursorrules")) ||
      fs.existsSync(path.join(workspaceRoot, ".cursor", "rules", "autopilot.mdc"))
    )
  }

  public static install(workspaceRoot = process.cwd()): ClientInstallResult {
    try {
      const createdPaths: string[] = []
      const rulesContent = `# Autopilot Mode Rules (Cursor & Windsurf)

## 1. Three-Stage Autopilot Workflow
- **Stage 0 (Setup)**: Verify .agents/ structure and root files (AGENTS.md, PLANS.md, BUGS.md).
- **Stage 1 (Plan)**: Formulate phased implementation plan before modifying files.
- **Stage 2 (Build & Verify)**: Drive changes to completion. Always verify with build/typecheck commands.

## 2. Two-Phase Safety Model
- Copy-Before-Delete: Backup files to .bak or trash directory before deletion.
- Verify-Before-Delete: Ensure replacement code compiles and passes tests before removing old code.
`

      // 1. .cursorrules
      const cursorRulesPath = path.join(workspaceRoot, ".cursorrules")
      fs.writeFileSync(cursorRulesPath, rulesContent, "utf8")
      createdPaths.push(cursorRulesPath)

      // 2. .cursor/rules/autopilot.mdc
      const cursorRulesDir = path.join(workspaceRoot, ".cursor", "rules")
      fs.mkdirSync(cursorRulesDir, { recursive: true })
      const mdcPath = path.join(cursorRulesDir, "autopilot.mdc")
      fs.writeFileSync(mdcPath, rulesContent, "utf8")
      createdPaths.push(mdcPath)

      // 3. .windsurfrules
      const windsurfRulesPath = path.join(workspaceRoot, ".windsurfrules")
      fs.writeFileSync(windsurfRulesPath, rulesContent, "utf8")
      createdPaths.push(windsurfRulesPath)

      return {
        client: this.displayName,
        success: true,
        paths: createdPaths,
        message: `Successfully enabled Autopilot mode for Cursor & Windsurf in ${workspaceRoot}.`,
      }
    } catch (err: any) {
      return {
        client: this.displayName,
        success: false,
        paths: [],
        message: `Failed to install Cursor adapter: ${err.message}`,
      }
    }
  }
}

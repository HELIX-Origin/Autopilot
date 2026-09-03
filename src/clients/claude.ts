import * as fs from "fs"
import * as path from "path"
import { ClientInstallResult } from "./opencode"

export class ClaudeCodeAdapter {
  public static readonly name = "claude"
  public static readonly displayName = "Claude Code"
  public static readonly description = "Claude Code CLAUDE.md guidelines and Three-Stage Autonomous Workflow rules."

  public static isInstalled(workspaceRoot = process.cwd()): boolean {
    return fs.existsSync(path.join(workspaceRoot, "CLAUDE.md"))
  }

  public static install(workspaceRoot = process.cwd()): ClientInstallResult {
    try {
      const claudeMdPath = path.join(workspaceRoot, "CLAUDE.md")
      const claudeContent = `# Claude Code Autopilot Configuration

## Autopilot Mode Contract
When executing tasks in this repository, always follow the **Three-Stage Autopilot Workflow**:

1. **Stage 0: Setup & Context**
   - Check that \`.agents/\` workspace and root entry files (\`AGENTS.md\`, \`PLANS.md\`, \`BUGS.md\`) exist.
   - Run \`autopilot init\` or \`helix\` to inspect structure and available language parsers.

2. **Stage 1: Phased Execution Plan**
   - Outline all changes before writing code.
   - Identify affected modules, tests, and dependencies.

3. **Stage 2: Continuous Build & Verification**
   - **Never Stop Mid-Work**: Drive complex multi-step tasks to completion without halting prematurely.
   - **Two-Phase Safety Model**:
     - *Copy-Before-Delete*: Never overwrite or delete without backing up to \`.bak\` or \`.opencode_trash/\`.
     - *Verify-Before-Delete*: Never retire legacy code until replacements compile and pass tests.
   - **Verification**: Run build and test suites (\`npm test\`, \`cargo test\`, \`pytest\`) after every stage.
`
      fs.writeFileSync(claudeMdPath, claudeContent, "utf8")

      return {
        client: this.displayName,
        success: true,
        paths: [claudeMdPath],
        message: `Successfully enabled Autopilot mode for Claude Code (${claudeMdPath}).`,
      }
    } catch (err: any) {
      return {
        client: this.displayName,
        success: false,
        paths: [],
        message: `Failed to install Claude Code adapter: ${err.message}`,
      }
    }
  }
}

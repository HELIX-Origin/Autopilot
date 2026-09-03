import { OpenCodeAdapter, ClientInstallResult } from "./opencode"
import { AntigravityAdapter } from "./antigravity"
import { CopilotAdapter } from "./copilot"
import { ClaudeCodeAdapter } from "./claude"
import { CursorAdapter } from "./cursor"
import { ClineAdapter } from "./cline"

export interface ClientInfo {
  id: string
  name: string
  description: string
  isInstalled: boolean
  adapter: any
}

export class ClientManager {
  public static readonly adapters = [
    OpenCodeAdapter,
    AntigravityAdapter,
    CopilotAdapter,
    ClaudeCodeAdapter,
    CursorAdapter,
    ClineAdapter,
  ]

  public static listClients(workspaceRoot = process.cwd()): ClientInfo[] {
    return this.adapters.map((adapter) => ({
      id: adapter.name,
      name: adapter.displayName,
      description: adapter.description,
      isInstalled: adapter.isInstalled ? adapter.isInstalled(workspaceRoot) : false,
      adapter,
    }))
  }

  public static enableClient(clientId: string, workspaceRoot = process.cwd()): ClientInstallResult {
    const adapter = this.adapters.find(
      (a) => a.name.toLowerCase() === clientId.toLowerCase() || a.displayName.toLowerCase().includes(clientId.toLowerCase())
    )

    if (!adapter) {
      return {
        client: clientId,
        success: false,
        paths: [],
        message: `Unknown AI client '${clientId}'. Supported clients: ${this.adapters.map((a) => a.name).join(", ")}`,
      }
    }

    return adapter.install(workspaceRoot)
  }

  public static enableAll(workspaceRoot = process.cwd()): ClientInstallResult[] {
    return this.adapters.map((adapter) => adapter.install(workspaceRoot))
  }
}

export {
  OpenCodeAdapter,
  AntigravityAdapter,
  CopilotAdapter,
  ClaudeCodeAdapter,
  CursorAdapter,
  ClineAdapter,
}

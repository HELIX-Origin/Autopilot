import type { Plugin } from "@opencode-ai/plugin"
import { SafetyInterceptor, BLOCKED_SAFETY_RULES } from "./safety/interceptor"
import { AutopilotRunner } from "./engine/runner"
import { UniversalAIHub } from "./ai/providers"

// === Autopilot Plugin for OpenCode & Multi-AI Tools ========================
//
// Autonomous three-stage workflow engine and un-bypassable safety system.
// Supports:
//  - OpenCode native plugin mode
//  - Multi-AI Provider Hub (Ollama, LM Studio, Claude, Gemini, OpenAI)
//  - Standalone CLI execution (`autopilot init`, `autopilot plan`, `autopilot query`)
//  - Programmatic pre-execution safety interceptor
// ==========================================================================

export { AutopilotRunner, UniversalAIHub, SafetyInterceptor, BLOCKED_SAFETY_RULES }

export const AutopilotPlugin: Plugin = async () => {
  return {
    event: async ({ event }: any) => {
      try {
        if (!event || !event.type) return
        if (event.type === "session.created") {
          /* client */ console?.log?.({
            body: {
              service: "autopilot",
              level: "info",
              message:
                "Autopilot session active. Advancing autonomously through Stages (0: Setup -> 1: Plan -> 2: Build & Verify).",
            },
          })
        } else if (event.type === "session.idle") {
          /* client */ console?.log?.({
            body: {
              service: "autopilot",
              level: "info",
              message:
                "Autopilot task complete. All planned stages and verification checks concluded.",
            },
          })
        }
      } catch {
        // Logging is best-effort
      }
    },

    // Programmatic enforcement of mandatory safety rules
    "tool.execute.before": async (_input, output) => {
      const cmd: unknown = output.args?.command
      if (typeof cmd === "string") {
        const check = SafetyInterceptor.checkCommand(cmd)
        if (!check.safe) {
          output.args = {
            ...output.args,
            command: `echo '[BLOCKED BY AUTOPILOT SAFETY GUARD]: ${check.reason}'`,
          }
        }
      }
    },
  }
}

export default AutopilotPlugin

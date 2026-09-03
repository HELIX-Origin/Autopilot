import * as http from "http"
import * as child from "child_process"
import * as os from "os"
import * as path from "path"

export interface CuratedModel {
  alias: string
  fullName: string
  category: "coding" | "lightweight" | "reasoning" | "vision" | "heavy"
  sizeMB: number
  description: string
  minRamGB: number
  recommendedFor: string
}

export const MODEL_CATALOG: CuratedModel[] = [
  {
    alias: "coder",
    fullName: "qwen2.5-coder:1.5b-instruct-q4_K_M",
    category: "coding",
    sizeMB: 980,
    description: "Primary coding engine. Balanced accuracy, fast CPU token throughput, and AST understanding.",
    minRamGB: 4,
    recommendedFor: "Daily code generation, refactoring, and AST symbol completions on budget PCs."
  },
  {
    alias: "light",
    fullName: "qwen2.5-coder:0.5b-instruct-q4_K_M",
    category: "lightweight",
    sizeMB: 390,
    description: "Ultra-lightweight engine. 40-60 tokens/sec on CPU with minimal memory footprint.",
    minRamGB: 2,
    recommendedFor: "Real-time autocomplete, hover explanations, and instant code edits."
  },
  {
    alias: "reasoning",
    fullName: "llama3.2:1b-instruct-q4_K_M",
    category: "reasoning",
    sizeMB: 850,
    description: "High-density reasoning and planning model.",
    minRamGB: 4,
    recommendedFor: "Autonomous task planning, dependency decomposition, and bug root-cause analysis."
  },
  {
    alias: "vision",
    fullName: "moondream:1.8b",
    category: "vision",
    sizeMB: 1200,
    description: "Local offline multimodal vision engine.",
    minRamGB: 6,
    recommendedFor: "Visual UI inspection, diagram analysis, and screenshot understanding without cloud APIs."
  },
  {
    alias: "heavy",
    fullName: "qwen2.5-coder:7b-instruct-q4_K_M",
    category: "heavy",
    sizeMB: 4700,
    description: "Large full-scale coding engine for complex multi-file refactoring.",
    minRamGB: 16,
    recommendedFor: "High-end systems (16GB+ RAM) requiring deep contextual analysis."
  }
]

export class LocalModelManager {
  public static getCatalog(): CuratedModel[] {
    return MODEL_CATALOG
  }

  public static resolveModel(aliasOrName: string): string {
    const matched = MODEL_CATALOG.find(
      (m) => m.alias.toLowerCase() === aliasOrName.toLowerCase() || m.fullName.toLowerCase() === aliasOrName.toLowerCase()
    )
    return matched ? matched.fullName : aliasOrName
  }

  public static async listInstalledModels(): Promise<string[]> {
    try {
      const res = await this.httpGetJson("http://127.0.0.1:11434/api/tags", 2000)
      if (res && Array.isArray(res.models)) {
        return res.models.map((m: any) => m.name)
      }
    } catch {
      // Ollama not reachable
    }
    return []
  }

  public static async pullModel(
    aliasOrName: string,
    onProgress?: (status: string) => void
  ): Promise<{ success: boolean; model: string; message: string }> {
    const targetModel = this.resolveModel(aliasOrName)
    onProgress?.(`Initiating download for '${targetModel}' ($0 cloud credits, local offline)...`)

    try {
      const proc = child.spawn("ollama", ["pull", targetModel], { stdio: "inherit" })
      return new Promise((resolve) => {
        proc.on("close", (code) => {
          if (code === 0) {
            resolve({
              success: true,
              model: targetModel,
              message: `Successfully pulled '${targetModel}' into local storage. Ready for zero-credit offline use!`,
            })
          } else {
            resolve({
              success: false,
              model: targetModel,
              message: `Failed to pull model '${targetModel}'. Exit code: ${code}`,
            })
          }
        })
        proc.on("error", (err) => {
          resolve({
            success: false,
            model: targetModel,
            message: `Could not run 'ollama pull': ${err.message}. Make sure Ollama is installed.`,
          })
        })
      })
    } catch (err: any) {
      return {
        success: false,
        model: targetModel,
        message: `Error pulling model: ${err.message}`,
      }
    }
  }

  public static async removeModel(aliasOrName: string): Promise<{ success: boolean; message: string }> {
    const targetModel = this.resolveModel(aliasOrName)
    try {
      child.execSync(`ollama rm ${targetModel}`, { stdio: "ignore" })
      return { success: true, message: `Model '${targetModel}' deleted from local storage.` }
    } catch (err: any) {
      return { success: false, message: `Failed to delete model: ${err.message}` }
    }
  }

  private static httpGetJson(urlStr: string, timeoutMs: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = new URL(urlStr)
      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname + url.search,
          method: "GET",
          timeout: timeoutMs,
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}`))
            return
          }
          let data = ""
          res.on("data", (chunk) => {
            data += chunk
          })
          res.on("end", () => {
            try {
              resolve(JSON.parse(data))
            } catch (e) {
              reject(e)
            }
          })
        }
      )
      req.on("error", reject)
      req.on("timeout", () => {
        req.destroy()
        reject(new Error("Timeout"))
      })
      req.end()
    })
  }
}

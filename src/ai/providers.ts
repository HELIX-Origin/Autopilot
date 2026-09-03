import * as http from "http"
import * as https from "https"
import * as fs from "fs"
import * as path from "path"
import * as os from "os"

export interface AIProviderConfig {
  name: string
  type: "ollama" | "openai" | "anthropic" | "gemini" | "custom"
  baseUrl: string
  apiKey?: string
  defaultModel: string
  active?: boolean
}

export interface UniversalAIResponse {
  success: boolean
  content: string
  model: string
  provider: string
  error?: string
}

export class UniversalAIHub {
  private static configPath = path.join(os.homedir(), ".config", "opencode", "ai-providers.json")

  public static getProviders(): AIProviderConfig[] {
    const defaultProviders: AIProviderConfig[] = [
      {
        name: "ollama",
        type: "ollama",
        baseUrl: process.env.OLLAMA_HOST || "http://127.0.0.1:11434",
        defaultModel: "qwen2.5-coder:1.5b-instruct-q4_K_M",
        active: true,
      },
      {
        name: "lm-studio",
        type: "openai",
        baseUrl: "http://127.0.0.1:1234/v1",
        defaultModel: "local-model",
      },
      {
        name: "localai",
        type: "openai",
        baseUrl: "http://127.0.0.1:8080/v1",
        defaultModel: "gpt-3.5-turbo",
      },
      {
        name: "openai",
        type: "openai",
        baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
        apiKey: process.env.OPENAI_API_KEY || "",
        defaultModel: "gpt-4o-mini",
      },
      {
        name: "anthropic",
        type: "anthropic",
        baseUrl: process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com/v1",
        apiKey: process.env.ANTHROPIC_API_KEY || "",
        defaultModel: "claude-3-5-sonnet-20241022",
      },
      {
        name: "gemini",
        type: "gemini",
        baseUrl: "https://generativelanguage.googleapis.com/v1beta",
        apiKey: process.env.GEMINI_API_KEY || "",
        defaultModel: "gemini-2.0-flash",
      },
    ]

    try {
      if (fs.existsSync(this.configPath)) {
        const saved = JSON.parse(fs.readFileSync(this.configPath, "utf8"))
        if (Array.isArray(saved)) return saved
      }
    } catch {
      // Use defaults
    }

    return defaultProviders
  }

  public static async query(
    prompt: string,
    options: { providerName?: string; model?: string; system?: string } = {}
  ): Promise<UniversalAIResponse> {
    const providers = this.getProviders()
    const target = options.providerName
      ? providers.find((p) => p.name.toLowerCase() === options.providerName?.toLowerCase())
      : providers.find((p) => p.active) || providers[0]

    if (!target) {
      return {
        success: false,
        content: "Provider not found",
        model: "unknown",
        provider: "none",
        error: "Specified AI provider is not configured",
      }
    }

    const model = options.model || target.defaultModel
    const system =
      options.system ||
      "You are the Helix Autopilot engine. You drive software tasks through three stages: Setup, Plan, and Build & Verify."

    try {
      if (target.type === "ollama") {
        return await this.queryOllama(target.baseUrl, model, prompt, system)
      } else if (target.type === "anthropic") {
        return await this.queryAnthropic(target.baseUrl, target.apiKey || "", model, prompt, system)
      } else if (target.type === "gemini") {
        return await this.queryGemini(target.baseUrl, target.apiKey || "", model, prompt, system)
      } else {
        return await this.queryOpenAI(target.baseUrl, target.apiKey || "", model, prompt, system)
      }
    } catch (err: any) {
      return {
        success: false,
        content: `AI Provider (${target.name}) failed: ${err.message}`,
        model,
        provider: target.name,
        error: err.message,
      }
    }
  }

  private static async queryOllama(
    baseUrl: string,
    model: string,
    prompt: string,
    system: string
  ): Promise<UniversalAIResponse> {
    const url = `${baseUrl.replace(/\/$/, "")}/api/generate`
    const body = JSON.stringify({
      model,
      prompt,
      system,
      stream: false,
      options: { temperature: 0.2, num_ctx: 2048, num_thread: 3 },
    })
    const res = await this.httpRequest(url, "POST", { "Content-Type": "application/json" }, body, 120000)
    const json = JSON.parse(res)
    return {
      success: true,
      content: json.response || "",
      model,
      provider: "ollama",
    }
  }

  private static async queryOpenAI(
    baseUrl: string,
    apiKey: string,
    model: string,
    prompt: string,
    system: string
  ): Promise<UniversalAIResponse> {
    const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`

    const body = JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    })
    const res = await this.httpRequest(url, "POST", headers, body, 120000)
    const json = JSON.parse(res)
    return {
      success: true,
      content: json.choices?.[0]?.message?.content || "",
      model,
      provider: "openai",
    }
  }

  private static async queryAnthropic(
    baseUrl: string,
    apiKey: string,
    model: string,
    prompt: string,
    system: string
  ): Promise<UniversalAIResponse> {
    const url = `${baseUrl.replace(/\/$/, "")}/messages`
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    }
    const body = JSON.stringify({
      model,
      system,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
      temperature: 0.2,
    })
    const res = await this.httpRequest(url, "POST", headers, body, 120000)
    const json = JSON.parse(res)
    return {
      success: true,
      content: json.content?.[0]?.text || "",
      model,
      provider: "anthropic",
    }
  }

  private static async queryGemini(
    baseUrl: string,
    apiKey: string,
    model: string,
    prompt: string,
    system: string
  ): Promise<UniversalAIResponse> {
    const url = `${baseUrl.replace(/\/$/, "")}/models/${model}:generateContent?key=${apiKey}`
    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify({
      contents: [{ parts: [{ text: `${system}\n\n${prompt}` }] }],
      generationConfig: { temperature: 0.2 },
    })
    const res = await this.httpRequest(url, "POST", headers, body, 120000)
    const json = JSON.parse(res)
    return {
      success: true,
      content: json.candidates?.[0]?.content?.parts?.[0]?.text || "",
      model,
      provider: "gemini",
    }
  }

  private static httpRequest(
    urlStr: string,
    method: string,
    headers: Record<string, string>,
    body?: string,
    timeoutMs = 60000
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = new URL(urlStr)
      const isHttps = url.protocol === "https:"
      const client = isHttps ? https : http

      const req = client.request(
        {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port || (isHttps ? 443 : 80),
          path: url.pathname + url.search,
          method,
          headers: {
            ...headers,
            ...(body ? { "Content-Length": Buffer.byteLength(body) } : {}),
          },
          timeout: timeoutMs,
        },
        (res) => {
          let data = ""
          res.on("data", (chunk) => {
            data += chunk
          })
          res.on("end", () => {
            if (res.statusCode && res.statusCode >= 400) {
              reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`))
            } else {
              resolve(data)
            }
          })
        }
      )

      req.on("error", reject)
      req.on("timeout", () => {
        req.destroy()
        reject(new Error("Request timed out"))
      })
      if (body) req.write(body)
      req.end()
    })
  }
}

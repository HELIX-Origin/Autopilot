#!/usr/bin/env node
import { Command } from "commander"
import * as fs from "fs"
import * as path from "path"
import { AutopilotRunner } from "./engine/runner"
import { UniversalAIHub } from "./ai/providers"
import { ClientManager } from "./clients/index"

const program = new Command()

program
  .name("autopilot")
  .description("Universal Autopilot Plugin & Three-Stage Autonomous Mode for AI Clients (OpenCode, Antigravity, Copilot, Claude, Cursor, Cline)")
  .version("1.0.0")

// 1. init command
program
  .command("init")
  .description("Initialize .agents/ workspace structure and root entry files (AGENTS.md, PLANS.md, BUGS.md)")
  .option("--root <path>", "Target project directory", process.cwd())
  .action((options) => {
    const status = AutopilotRunner.checkWorkspace(options.root)
    if (status.isComplete) {
      console.log("✓ Project workspace is already fully initialized with .agents/ and root files.")
      return
    }

    console.log("Scaffolding .agents/ workspace and root entry points...")
    const res = AutopilotRunner.initWorkspace(options.root)
    if (res.success) {
      console.log("✓ Workspace initialized successfully:")
      res.created.forEach((f) => console.log(`  + Created: ${f}`))
    }
  })

// 2. status command
program
  .command("status")
  .description("Check status of project .agents/ workspace, active AI clients, and model providers")
  .option("--root <path>", "Target project directory", process.cwd())
  .action(async (options) => {
    const ws = AutopilotRunner.checkWorkspace(options.root)
    console.log("=== Project Workspace Status ===")
    console.log(`  .agents/ directory: ${ws.hasAgentsDir ? "✓ Present" : "✗ Missing"}`)
    console.log(`  AGENTS.md:          ${ws.hasAgentsMd ? "✓ Present" : "✗ Missing"}`)
    console.log(`  PLANS.md:           ${ws.hasPlansMd ? "✓ Present" : "✗ Missing"}`)
    console.log(`  BUGS.md:            ${ws.hasBugsMd ? "✓ Present" : "✗ Missing"}`)

    if (ws.missing.length > 0) {
      console.log(`  Missing items:      ${ws.missing.join(", ")}`)
      console.log("  Run `autopilot init` to scaffold missing components.")
    } else {
      console.log("  Workspace Status:   ✓ Complete & Valid")
    }

    console.log("\n=== Supported AI Clients ===")
    const clients = ClientManager.listClients(options.root)
    clients.forEach((c) => {
      console.log(`  - ${c.name.padEnd(20)} [${c.id.padEnd(12)}] -> ${c.isInstalled ? "✓ ENABLED" : "○ Not Enabled"}`)
    })

    console.log("\n=== Multi-AI Providers ===")
    const providers = UniversalAIHub.getProviders()
    providers.forEach((p) => {
      console.log(`  - ${p.name.padEnd(12)} [${p.type}] -> ${p.baseUrl} (Model: ${p.defaultModel}) ${p.active ? "★ ACTIVE" : ""}`)
    })
  })

// 3. clients command
program
  .command("clients")
  .description("List all supported AI clients and their Autopilot plugin integration status")
  .action(() => {
    console.log("Supported AI Clients & Autopilot Plugin Status:\n")
    const clients = ClientManager.listClients()
    clients.forEach((c) => {
      console.log(`  ${c.isInstalled ? "✓" : "○"} ${c.name.padEnd(20)} (id: ${c.id})`)
      console.log(`    ${c.description}\n`)
    })
  })

// 4. enable command (Install autopilot mode into target client)
program
  .command("enable [client]")
  .description("Enable/install safe Autopilot mode into a specific AI client (opencode, antigravity, copilot, claude, cursor, cline) or all")
  .option("--all", "Enable Autopilot mode across all supported AI clients")
  .option("--root <path>", "Target project directory", process.cwd())
  .action((client, options) => {
    if (options.all || !client) {
      console.log("Enabling safe Autopilot mode across all supported AI clients...\n")
      const results = ClientManager.enableAll(options.root)
      results.forEach((r) => {
        console.log(`  [${r.success ? "SUCCESS" : "FAILED"}] ${r.client}: ${r.message}`)
      })
      return
    }

    console.log(`Enabling safe Autopilot mode for '${client}'...`)
    const res = ClientManager.enableClient(client, options.root)
    if (res.success) {
      console.log(`\n[SUCCESS] ${res.message}`)
      if (res.paths.length > 0) {
        console.log("Configured files:")
        res.paths.forEach((p) => console.log(`  + ${p}`))
      }
    } else {
      console.error(`\n[ERROR] ${res.message}`)
    }
  })

// 4b. models command
const modelsCmd = program.command("models").alias("model").description("Manage zero-credit local offline AI models (Ollama / Local)")

modelsCmd
  .command("list")
  .description("List curated zero-credit models and locally installed models")
  .action(async () => {
    const { LocalModelManager } = require("./ai/model-manager")
    const catalog = LocalModelManager.getCatalog()
    const installed = await LocalModelManager.listInstalledModels()

    console.log("=== Curated Offline Models for Autopilot ($0 Cloud Credits) ===\n")
    catalog.forEach((m: any) => {
      const isInst = installed.some((i: string) => i.includes(m.alias) || i.includes(m.fullName))
      console.log(`  ${isInst ? "✓ INSTALLED" : "○ AVAILABLE"} [${m.alias.padEnd(10)}] -> ${m.fullName}`)
      console.log(`     Size: ~${m.sizeMB} MB | Min RAM: ${m.minRamGB} GB | Category: ${m.category}`)
      console.log(`     ${m.description}\n`)
    })

    if (installed.length > 0) {
      console.log("Locally Installed Ollama Models:")
      installed.forEach((i: string) => console.log(`  - ${i}`))
    }
  })

modelsCmd
  .command("pull <model>")
  .description("Download/pull a local zero-credit offline model (coder, light, reasoning, vision, heavy, or full name)")
  .action(async (model) => {
    const { LocalModelManager } = require("./ai/model-manager")
    console.log(`[Autopilot Models] Preparing download for '${model}'...`)
    const res = await LocalModelManager.pullModel(model, (s: string) => console.log(s))
    if (res.success) {
      console.log(`\n[SUCCESS] ${res.message}`)
    } else {
      console.error(`\n[ERROR] ${res.message}`)
    }
  })

// 5. plan command
program
  .command("plan")
  .description("Generate an autonomous execution plan for a task using AI")
  .argument("<task...>", "Task description")
  .option("--provider <name>", "AI provider (ollama, lm-studio, anthropic, openai, gemini)")
  .option("--model <name>", "Specific model name")
  .action(async (taskParts, options) => {
    const task = taskParts.join(" ")
    console.log(`[Autopilot Plan] Generating plan for: "${task}"...`)
    const res = await AutopilotRunner.createPlan(task, {
      provider: options.provider,
      model: options.model,
    })

    if (res.success) {
      console.log(`\n✓ Plan generated and saved to: ${res.planFile}`)
      console.log("\nPlan Preview:\n")
      console.log(res.content)
    } else {
      console.error("Failed to generate plan.")
    }
  })

// 6. query command
program
  .command("query")
  .description("Query AI provider directly through the Autopilot hub")
  .argument("<prompt...>", "Prompt for the model")
  .option("--provider <name>", "Provider name")
  .option("--model <name>", "Specific model name")
  .action(async (promptParts, options) => {
    const prompt = promptParts.join(" ")
    console.log("[Autopilot AI] Querying provider...")
    const res = await UniversalAIHub.query(prompt, {
      providerName: options.provider,
      model: options.model,
    })
    if (res.success) {
      console.log(`\n[Provider: ${res.provider} | Model: ${res.model}]\n${res.content}`)
    } else {
      console.error(`\n[Error from ${res.provider}]: ${res.content}`)
    }
  })

// 7. install-global command (External drive & portable support)
program
  .command("install-global")
  .description("Install drive-agnostic standalone autopilot launchers to any local or external drive")
  .option("--dir <path>", "Target installation directory (defaults to <current-drive>:\\helix\\bin or custom folder)")
  .action((options) => {
    const currentRoot = path.parse(process.cwd()).root || "C:\\"
    const targetDir = options.dir || path.join(currentRoot, "helix")
    const binDir = path.join(targetDir, "bin")

    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true })
    }

    const cliJs = path.resolve(__dirname, "./cli.js")
    const nodeExe = process.execPath

    const cmdContent = `@echo off
setlocal enabledelayedexpansion
set "SCRIPT_DIR=%~dp0"
if exist "%SCRIPT_DIR%..\\lib\\cli.js" (
  set "TARGET_JS=%SCRIPT_DIR%..\\lib\\cli.js"
) else if exist "%SCRIPT_DIR%lib\\cli.js" (
  set "TARGET_JS=%SCRIPT_DIR%lib\\cli.js"
) else (
  set "TARGET_JS=${cliJs.replace(/\\/g, "\\\\")}"
)

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
  node "%TARGET_JS%" %*
) else (
  "${nodeExe.replace(/\\/g, "\\\\")}" "%TARGET_JS%" %*
)
`

    const ps1Content = `$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetJs = Join-Path $ScriptDir "..\\lib\\cli.js"
if (-not (Test-Path $TargetJs)) {
    $TargetJs = "${cliJs.replace(/\\/g, "\\\\")}"
}
if (Get-Command node -ErrorAction SilentlyContinue) {
    & node $TargetJs $args
} else {
    & "${nodeExe.replace(/\\/g, "\\\\")}" $TargetJs $args
}
`

    fs.writeFileSync(path.join(binDir, "autopilot.cmd"), cmdContent, "utf8")
    fs.writeFileSync(path.join(binDir, "autopilot.bat"), cmdContent, "utf8")
    fs.writeFileSync(path.join(binDir, "autopilot.ps1"), ps1Content, "utf8")

    // Also install into local repo bin/
    const repoBin = path.resolve(__dirname, "../bin")
    try {
      if (!fs.existsSync(repoBin)) fs.mkdirSync(repoBin, { recursive: true })
      fs.writeFileSync(path.join(repoBin, "autopilot.cmd"), cmdContent, "utf8")
      fs.writeFileSync(path.join(repoBin, "autopilot.bat"), cmdContent, "utf8")
      fs.writeFileSync(path.join(repoBin, "autopilot.ps1"), ps1Content, "utf8")
    } catch {
      // Best effort
    }

    console.log(`[SUCCESS] Installed drive-agnostic autopilot launcher to ${binDir} (Drive: ${path.parse(binDir).root})`)
    console.log(`\nYou can now run 'autopilot' from Windows Terminal or add '${binDir}' to your User PATH:`)
    console.log(`  setx PATH "%PATH%;${binDir}"`)
  })

program.parse(process.argv)

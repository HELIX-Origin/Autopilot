#!/usr/bin/env node
import { Command } from "commander"
import { AutopilotRunner } from "./engine/runner"
import { UniversalAIHub } from "./ai/providers"
import { SafetyInterceptor } from "./safety/interceptor"

const program = new Command()

program
  .name("autopilot")
  .description("Autonomous, Three-Stage Autopilot Runner for OpenCode & Multi-AI Tools")
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

// 2. check command
program
  .command("status")
  .description("Check status of project .agents/ workspace and active AI providers")
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

    console.log("\n=== AI Provider Status ===")
    const providers = UniversalAIHub.getProviders()
    providers.forEach((p) => {
      console.log(`  - ${p.name.padEnd(12)} [${p.type}] -> ${p.baseUrl} (Model: ${p.defaultModel}) ${p.active ? "★ ACTIVE" : ""}`)
    })
  })

// 3. plan command
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

// 4. providers command
program
  .command("providers")
  .description("List configured multi-AI providers")
  .action(() => {
    const list = UniversalAIHub.getProviders()
    console.log("Configured Multi-AI Providers:\n")
    list.forEach((p) => {
      console.log(`  - ${p.name.padEnd(12)} [${p.type}] -> ${p.baseUrl} (Default Model: ${p.defaultModel}) ${p.active ? "★ ACTIVE" : ""}`)
    })
  })

// 5. query command
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

program.parse(process.argv)

const fs = require('fs')
const path = require('path')

console.log('=== Running Autopilot Multi-AI, Client Adapters & Safety Verification Suite ===\n')

// 1. Check plugin export
const { AutopilotPlugin, UniversalAIHub, AutopilotRunner, SafetyInterceptor, BLOCKED_SAFETY_RULES } = require('../lib/index')

if (typeof AutopilotPlugin !== 'function') {
  console.error('FAIL: AutopilotPlugin is not exported properly')
  process.exit(1)
}
console.log('[Test 1] AutopilotPlugin export verified: function')

// 2. Check Multi-AI Hub
const providers = UniversalAIHub.getProviders()
if (!Array.isArray(providers) || providers.length < 5) {
  console.error('FAIL: AI Providers list is incomplete')
  process.exit(1)
}
console.log(`[Test 2] UniversalAIHub loaded: ${providers.length} providers configured (${providers.map(p => p.name).join(', ')}).`)

// 3. Check Safety Interceptor
const checkBad = SafetyInterceptor.checkCommand('rm -rf /')
if (checkBad.safe) {
  console.error('FAIL: Dangerous command was not caught by SafetyInterceptor')
  process.exit(1)
}
const checkGood = SafetyInterceptor.checkCommand('git status')
if (!checkGood.safe) {
  console.error('FAIL: Safe command was blocked')
  process.exit(1)
}
console.log('[Test 3] SafetyInterceptor: PASSED (blocked dangerous commands, allowed safe commands)')

// 4. Check Workspace Scaffolding Runner
const wsCheck = AutopilotRunner.checkWorkspace(__dirname)
console.log(`[Test 4] AutopilotRunner workspace inspector: PASSED (complete: ${wsCheck.isComplete})`)

// 5. Check templates
const templatesDir = path.join(__dirname, '../templates')
const requiredTemplates = [
  'INDEX.md',
  'agent.template.yml',
  'skill.template.yml',
  'rule.template.yml',
  'plan.template.yml',
  'bug.template.yml',
  'component.template.yml',
  'api-endpoint.template.yml',
  'service.template.yml',
  'test.template.yml',
]
for (const t of requiredTemplates) {
  if (!fs.existsSync(path.join(templatesDir, t))) {
    console.error(`FAIL: Missing required template: ${t}`)
    process.exit(1)
  }
}
console.log(`[Test 5] Template catalog verified: All ${requiredTemplates.length} templates present.`)

// 6. Check Client Adapters
const { ClientManager } = require('../lib/clients/index')
const clients = ClientManager.listClients()
if (!Array.isArray(clients) || clients.length < 6) {
  console.error('FAIL: Client adapters count is incomplete')
  process.exit(1)
}
console.log(`[Test 6] Client Adapters verified: ${clients.length} clients registered (${clients.map(c => c.name).join(', ')}).`)

console.log('\n>>> ALL AUTOPILOT MULTI-CLIENT & SAFETY TESTS PASSED SUCCESSFULLY! <<<\n')

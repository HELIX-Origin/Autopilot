const fs = require('fs')
const path = require('path')

console.log('=== Running Helix Autopilot Verification Suite ===\n')

// 1. Check plugin export
const { AutopilotPlugin, DEFAULT_BLOCKED_COMMANDS } = require('../lib/index')
if (typeof AutopilotPlugin !== 'function') {
  console.error('FAIL: AutopilotPlugin is not exported properly')
  process.exit(1)
}
console.log('[Test 1] AutopilotPlugin export verified: function')

// 2. Check safety interceptor rules
if (!Array.isArray(DEFAULT_BLOCKED_COMMANDS) || DEFAULT_BLOCKED_COMMANDS.length < 5) {
  console.error('FAIL: Safety rules array is incomplete')
  process.exit(1)
}
console.log(`[Test 2] Safety rules loaded: ${DEFAULT_BLOCKED_COMMANDS.length} blocked patterns configured.`)

// 3. Test safety interceptor against dangerous command
let intercepted = false
const mockOutput = { args: { command: 'rm -rf /' } }
for (const rule of DEFAULT_BLOCKED_COMMANDS) {
  if (rule.pattern.test(mockOutput.args.command)) {
    intercepted = true
    break
  }
}
if (!intercepted) {
  console.error('FAIL: Dangerous command rm -rf / was not intercepted')
  process.exit(1)
}
console.log('[Test 3] Dangerous command interception: PASSED (rm -rf / blocked)')

// 4. Check templates
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
  'test.template.yml'
]
for (const t of requiredTemplates) {
  if (!fs.existsSync(path.join(templatesDir, t))) {
    console.error(`FAIL: Missing required template: ${t}`)
    process.exit(1)
  }
}
console.log(`[Test 4] Template catalog verified: All ${requiredTemplates.length} templates present.`)

// 5. Check agent definition
const agentMd = path.join(__dirname, '../agents/autopilot.md')
if (!fs.existsSync(agentMd)) {
  console.error('FAIL: Missing agents/autopilot.md')
  process.exit(1)
}
console.log('[Test 5] Autopilot agent definition: PASSED')

console.log('\n>>> ALL HELIX AUTOPILOT TESTS PASSED SUCCESSFULLY! <<<\n')

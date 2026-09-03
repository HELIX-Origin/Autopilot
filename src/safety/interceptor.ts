// === Safety Interceptor for Autopilot =====================================
//
// Programmatic enforcement of mandatory safety rules preventing destructive
// actions across any tool, editor, or CLI environment.
// ==========================================================================

export interface BlockedRule {
  pattern: RegExp
  reason: string
}

export const BLOCKED_SAFETY_RULES: BlockedRule[] = [
  // 1. Recursive unconstrained root / home deletion
  {
    pattern: /\brm\s+-(?:r|f|rf|fr)\s+[\/\\](?:\s|\*|$)/i,
    reason: "Unconstrained root filesystem deletion is forbidden by Autopilot safety rules.",
  },
  {
    pattern: /\brm\s+-(?:r|f|rf|fr)\s+(?:~|\$HOME|%USERPROFILE%)(?:[\/\\](?:\s|\*|$)|$)/i,
    reason: "Recursive user root directory deletion is forbidden by Autopilot safety rules.",
  },
  {
    pattern: /\brmdir\s+\/s\s+\/q\s+[c-zC-Z]:\\?$/i,
    reason: "Recursive root drive deletion is forbidden by Autopilot safety rules.",
  },
  {
    pattern: /\bdel\s+\/f\s+\/s\s+\/q\s+[c-zC-Z]:\\?$/i,
    reason: "Recursive root drive deletion is forbidden by Autopilot safety rules.",
  },

  // 2. Disk & Volume destruction
  {
    pattern: /\bformat\s+[c-zC-Z]:/i,
    reason: "Drive formatting is strictly forbidden by Autopilot safety rules.",
  },
  {
    pattern: /\b(?:diskpart|fdisk|mkfs)\b/i,
    reason: "Partition and disk modification utilities are forbidden by Autopilot safety rules.",
  },

  // 3. Destructive Git commands
  {
    pattern: /\bgit\s+push\s+[^;\|&]*\b(?:--force|-f)\b/i,
    reason: "Force-pushing to remote repositories is forbidden by Autopilot safety rules.",
  },
  {
    pattern: /\bgit\s+clean\s+-[a-zA-Z]*f[a-zA-Z]*x/i,
    reason: "Destructive git clean (-fxd) is forbidden without verified backups.",
  },

  // 4. Remote execution pipes
  {
    pattern: /\b(?:curl|wget|fetch)\b[^;\|&]*\|\s*(?:bash|sh|cmd|powershell|pwsh)\b/i,
    reason: "Piping unverified remote web scripts directly into a shell is forbidden.",
  },

  // 5. System recovery tampering
  {
    pattern: /\b(?:vssadmin|bcdedit)\b/i,
    reason: "Modifying system recovery or boot configuration is forbidden.",
  },
]

export class SafetyInterceptor {
  public static checkCommand(cmd: string): { safe: boolean; reason?: string } {
    for (const rule of BLOCKED_SAFETY_RULES) {
      if (rule.pattern.test(cmd)) {
        return { safe: false, reason: rule.reason }
      }
    }
    return { safe: true }
  }
}

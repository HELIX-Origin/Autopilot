# 07. Troubleshooting & FAQ

Frequently asked questions and troubleshooting steps for Helix Autopilot.

---

## ❓ Frequently Asked Questions

### Q: Why did Autopilot ask for confirmation at the beginning?
**A**: Autopilot only pauses in **Stage 0** if the project lacks a `.agents/` directory or root entry points (`AGENTS.md`, `PLANS.md`, `BUGS.md`). Once you confirm the scaffolding, it enters Stage 1 and Stage 2 and will **never pause again** until the task is complete.

### Q: What if a build or test step fails during Stage 2?
**A**: Autopilot will not skip the error. It enters a diagnostic loop: inspecting the error output, modifying the code, and re-running the test until the fix is verified.

### Q: Can I run custom commands in Stage 2?
**A**: Yes. Autopilot uses native OpenCode tools (`bash`, `read`, `write`, `edit`) to run any standard build, test, lint, or deployment command.

---

## 🛠️ Troubleshooting

### Issue: "Blocked by Helix Autopilot Safety Guard"
- **Cause**: A command matched one of the un-bypassable safety rules (e.g. `rm -rf /`, `git push --force`, `format`).
- **Fix**: Use non-destructive commands. For deleting files, use the two-phase safety model (move to `.bak` or a trash folder).

### Issue: OpenCode does not show Autopilot in the agent list
- **Cause**: `agents/autopilot.md` is missing from `~/.config/opencode/agents/` or not declared in `opencode.jsonc`.
- **Fix**: Verify that `~/.config/opencode/agents/autopilot.md` exists and `opencode.jsonc` contains `"autopilot"` under `"agent"`.

### Issue: TypeScript compilation errors in plugin
- **Cause**: Missing `@opencode-ai/plugin` dependency.
- **Fix**: Run `npm install` in the plugin directory.

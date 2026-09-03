# 04. Mandatory Safety Rules & Programmatic Interceptor

Helix Autopilot enforces non-negotiable safety rules through both system prompts and pre-execution programmatic interceptors.

---

## 🛡️ 1. The Two-Phase Safety Model

### A. Copy-Before-Delete
- Autopilot must **never** permanently delete or overwrite an existing file, asset, or configuration without first creating a backup or moving the file to `.bak` or a designated trash directory (`~/.opencode_trash/`).

### B. Verify-Before-Delete
- Autopilot must **never** retire or remove old files until the new replacement code is verified to compile, pass all lint checks, and pass all automated tests.

---

## 🚫 2. Programmatic Command Interceptor

The plugin intercepts commands in `tool.execute.before` to automatically block catastrophic or out-of-boundary actions before execution:

| Blocked Command Pattern | Reason for Block |
|---|---|
| `rm -rf /` or `rm -rf /*` | Unconstrained root filesystem deletion |
| `rm -rf ~` or `rm -rf $HOME` | User root directory deletion |
| `rmdir /s /q C:\` or `del /f /s /q C:\` | Root drive recursive wiping |
| `format C:` or `format D:` | Drive formatting utilities |
| `diskpart`, `fdisk`, `mkfs` | Partition and volume destruction |
| `git push --force` or `git push -f` | Remote repository history overwriting |
| `git clean -fxd` | Destructive git workspace wiping |
| `curl ... \| bash` / `wget ... \| sh` | Unverified remote script execution pipes |
| `vssadmin delete shadows` | Shadow copy and recovery deletion |

---

## 🔒 3. System Path Protection

Autopilot is strictly prohibited from touching:
- `C:\Windows\`
- `C:\Program Files\` and `C:\Program Files (x86)\`
- Root system partitions outside the workspace folder
- User root directories (`~/.ssh`, `~/.aws`, system registry)

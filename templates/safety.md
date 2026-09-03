# Project Safety Rules

These rules apply specifically to this repository and supplement the global OpenCode mandatory safety policies.

## 1. Non-Negotiable Two-Phase Safety Model
- **Copy-Before-Delete**: Always create a backup or safe copy before deleting or replacing files.
- **Verify-Before-Delete**: Never remove old files or implementations until the replacement code is verified to compile, pass all tests, and execute properly.

## 2. Project Boundary
- All actions, edits, and writes must remain strictly within this project's root folder.

## 3. Project Build & Verification Standards
- Run project-specific test and build commands before finishing tasks (e.g. `npm test`, `cargo check`, `pytest`).

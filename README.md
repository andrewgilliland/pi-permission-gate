# pi-permission-gate

A [pi](https://github.com/earendil-works/pi) extension that intercepts dangerous bash commands and protected file writes, prompting for confirmation before allowing them to execute.

## Features

- **Dangerous command gate** — prompts before running commands like `rm -rf`, `git push --force`, `git reset --hard`, and more
- **Protected path gate** — prompts before writing to files like `.env`, `.env.local`, and `node_modules/`
- **Auto-deny on timeout** — dialogs auto-dismiss and deny after 30 seconds with no response
- **Blocked actions are logged** — denied commands and paths are recorded in the session via `pi.appendEntry`
- **Configurable** — patterns and protected paths can be overridden per-project via `.pi/gate-config.json`

## Project Structure

```
.pi/
  extensions/
    permission-gate.ts   # Extension source (auto-discovered by pi)
  gate-config.json       # Per-project pattern/path overrides
package.json             # Dev dependencies for editor type checking
tsconfig.json            # TypeScript config for editor type checking
```

## Usage

Run `pi` from this directory (or any project that contains this extension):

```sh
pi
```

Pi auto-discovers `.pi/extensions/` and loads the extension. You will see a "Permission gate active" notification at session start. The first time, pi will ask you to trust the project directory.

To load it explicitly without auto-discovery:

```sh
pi -e ./.pi/extensions/permission-gate.ts
```

## Configuration

By default the extension uses built-in pattern and path lists. To override them per-project, edit `.pi/gate-config.json`:

```json
{
  "patterns": [
    "rm -rf",
    "rm -r ",
    "sudo rm",
    "git push --force",
    "git push -f",
    "git reset --hard",
    "> /dev/",
    "DROP TABLE",
    "DROP DATABASE",
    "chmod 777",
    "chmod -R 777",
    ":(){:|:&};:"
  ],
  "protectedPaths": [".env", ".env.local", ".env.production", "node_modules/"]
}
```

Both `patterns` and `protectedPaths` are optional — omitting either keeps the built-in defaults.

## Default Dangerous Patterns

| Pattern | Reason |
|---|---|
| `rm -rf` | Recursive force delete |
| `rm -r ` | Recursive delete |
| `sudo rm` | Root delete |
| `git push --force` / `git push -f` | Force push (rewrites history) |
| `git reset --hard` | Discards uncommitted changes |
| `> /dev/` | Writes to device files |
| `DROP TABLE` / `DROP DATABASE` | Destructive SQL |
| `chmod 777` / `chmod -R 777` | Insecure permissions |
| `:(){:\|:&};:` | Fork bomb |

## Default Protected Paths

| Path | Reason |
|---|---|
| `.env` | Environment secrets |
| `.env.local` | Local environment secrets |
| `.env.production` | Production secrets |
| `node_modules/` | Managed by package manager |

## Requirements

- [pi](https://github.com/earendil-works/pi) (`@earendil-works/pi-coding-agent`) — no separate install needed, pi provides its own runtime
- Node.js built-ins (`node:fs`) — no npm packages required at runtime

The `package.json` and `tsconfig.json` are only used for editor type checking (VS Code IntelliSense) and are not needed to run the extension.

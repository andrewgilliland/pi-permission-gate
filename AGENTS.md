# Agent Rules

This project is a pi permission gate extension. Follow these rules in every session.

## Safety

- Never run commands matching the patterns in `.pi/gate-config.json` without first explaining the risk and confirming with the user
- Never write to or modify protected paths: `.env`, `.env.local`, `.env.production`, `node_modules/`
- Prefer `git stash` over `git reset --hard` when discarding uncommitted changes
- Prefer `rm` with explicit paths over `rm -rf` — never use `rm -rf` on directories that may contain important files
- Never use `git push --force` — suggest `git push --force-with-lease` if a force push is truly necessary

## Git Workflow

- Use `/skill:commit-message` to generate commit messages instead of writing them ad hoc
- Use `/skill:code-review` before pushing to catch issues early
- Commit in small, focused units — one logical change per commit
- Always check `git status` and `git diff --cached` before committing

## Code Style

- Follow the existing patterns in `.pi/extensions/permission-gate.ts`
- Use `isToolCallEventType` for all tool call type narrowing
- Extract shared logic into named helper functions rather than duplicating across handlers
- Use `_event` for unused event parameters to signal intent

## When in Doubt

- Use `/skill:explain-command` to analyze any unfamiliar bash command before running it
- Use `/explain-block` to evaluate whether a blocked command should be allowed
- Use `/add-pattern` to add new dangerous patterns discovered during a session

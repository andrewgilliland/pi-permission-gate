Generate a conventional commit message for the staged changes.

Run `git diff --cached` to get the staged diff, then produce a commit message following the Conventional Commits spec:

```
<type>(<scope>): <short summary>

<optional body>

<optional footer>
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `style`, `ci`, `build`

**Rules:**
- Summary line must be 72 characters or fewer
- Use imperative mood ("add", "fix", "remove" — not "added" or "fixes")
- Scope is optional but use it when the change is clearly scoped to one area
- Include a body only if the why or context isn't obvious from the summary
- Add `BREAKING CHANGE:` in the footer if the change breaks existing behavior

Output only the commit message — no explanation, no markdown fencing.

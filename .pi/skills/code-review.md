Perform a thorough code review of the staged or recently changed files.

1. Run `git diff --cached` to get staged changes, or `git diff HEAD~1` if nothing is staged.
2. For each changed file, read the full file for context.
3. Review for the following and report findings by file and line number:

**Correctness**
- Logic errors or off-by-one mistakes
- Unhandled edge cases or missing null/undefined checks
- Incorrect assumptions about input or state

**Security**
- Hardcoded secrets, tokens, or credentials
- Injection vulnerabilities (command, path traversal, SQL)
- Overly permissive file permissions or access controls
- Sensitive data exposed in logs or error messages

**Code quality**
- Duplicated logic that should be extracted
- Overly complex conditionals that could be simplified
- Dead code or unused variables/imports
- Misleading variable or function names

**TypeScript**
- Missing or overly broad types (`any`, untyped parameters)
- Type assertions that could be narrowed
- Missing return types on exported functions

**Format your response as:**

### `filename.ts`

**Line N** — [category] Short description.
> Suggestion: what to do instead.

---

After listing all findings, provide a **Summary** with:
- Total issues found (broken down by severity: high / medium / low)
- One sentence on overall code health
- The single most important fix to make first

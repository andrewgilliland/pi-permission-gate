Create a new pi extension called {{name}}.

Purpose: {{description}}

Requirements:
1. Place it at `.pi/extensions/{{name}}.ts`
2. Follow the same structure and patterns used in `.pi/extensions/permission-gate.ts`
3. Use `ExtensionAPI` and `isToolCallEventType` from `@earendil-works/pi-coding-agent` where applicable
4. Notify the user on `session_start` that the extension is active
5. Add a comment at the top describing what the extension does

After creating the file, summarize what events or tool calls it hooks into and how to test it.

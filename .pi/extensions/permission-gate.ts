// permission-gate.ts
// Pi extension that intercepts dangerous bash commands and protected file writes,
// prompting for confirmation before allowing them to run.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { isToolCallEventType } from "@earendil-works/pi-coding-agent";
import { readFileSync } from "node:fs";

// Default commands that require confirmation before running
const DANGEROUS_PATTERNS = [
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
  ":(){:|:&};:", // fork bomb
];

// Default paths that should never be written to
const PROTECTED_PATHS = [
  ".env",
  ".env.local",
  ".env.production",
  "node_modules/",
];

export default function (pi: ExtensionAPI) {
  // Mutable pattern list — may be overridden by .pi/gate-config.json at session start
  let patterns = DANGEROUS_PATTERNS;
  let protectedPaths = PROTECTED_PATHS;

  // Load configurable patterns from .pi/gate-config.json if present
  pi.on("session_start", async (event, ctx) => {
    try {
      const config = JSON.parse(
        readFileSync(`${ctx.cwd}/.pi/gate-config.json`, "utf8"),
      );
      if (Array.isArray(config.patterns)) {
        patterns = config.patterns;
      }
      if (Array.isArray(config.protectedPaths)) {
        protectedPaths = config.protectedPaths;
      }
    } catch {
      // No config file — use defaults
    }

    ctx.ui.notify("Permission gate active", "info");
  });

  // Intercept bash tool calls for dangerous commands
  pi.on("tool_call", async (event, ctx) => {
    if (!isToolCallEventType("bash", event)) return;

    const command = event.input.command ?? "";

    const match = patterns.find((pattern) => command.includes(pattern));

    if (match) {
      const ok = await ctx.ui.confirm(
        "Dangerous command detected",
        `The agent wants to run:\n\n${command}\n\nPattern matched: ${match}\n\nAllow?`,
        { timeout: 30_000 }, // auto-deny after 30 seconds
      );

      if (!ok) {
        pi.appendEntry("permission-gate", { blocked: command, pattern: match });
        return { block: true, reason: `Blocked: matched pattern "${match}"` };
      }
    }
  });

  // Intercept edit tool calls for protected files
  pi.on("tool_call", async (event, ctx) => {
    if (!isToolCallEventType("edit", event)) return;

    const path = event.input.path ?? "";

    const isProtected = protectedPaths.some(
      (p) => path === p || path.endsWith(`/${p}`) || path.includes(`/${p}/`),
    );

    if (isProtected) {
      const ok = await ctx.ui.confirm(
        "Protected file",
        `The agent wants to edit:\n\n${path}\n\nAllow?`,
        { timeout: 30_000 }, // auto-deny after 30 seconds
      );

      if (!ok) {
        pi.appendEntry("permission-gate", {
          blocked: path,
          reason: "protected path",
        });
        return { block: true, reason: `Blocked: ${path} is a protected file` };
      }
    }
  });

  // Intercept write tool calls for protected files
  pi.on("tool_call", async (event, ctx) => {
    if (!isToolCallEventType("write", event)) return;

    const path = event.input.path ?? "";

    const isProtected = protectedPaths.some(
      (p) => path === p || path.endsWith(`/${p}`) || path.includes(`/${p}/`),
    );

    if (isProtected) {
      const ok = await ctx.ui.confirm(
        "Protected file",
        `The agent wants to write to:\n\n${path}\n\nAllow?`,
        { timeout: 30_000 }, // auto-deny after 30 seconds
      );

      if (!ok) {
        pi.appendEntry("permission-gate", {
          blocked: path,
          reason: "protected path",
        });
        return { block: true, reason: `Blocked: ${path} is a protected file` };
      }
    }
  });
}

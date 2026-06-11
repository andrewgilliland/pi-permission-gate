// dirty-repo-guard.ts
// Pi extension that warns when an agent turn starts with uncommitted changes,
// prompting the user to stash or commit before proceeding.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.setStatus("dirty-repo-guard", "repo guard active");
  });

  pi.on("before_agent_start", async (_event, ctx) => {
    const result = await pi.exec("git", ["status", "--porcelain"], {
      timeout: 5_000,
    });

    // Not a git repo or git not available — skip silently
    if (result.code !== 0) return;

    const dirty = result.stdout.trim();
    if (!dirty) return;

    const lines = dirty.split("\n");
    const fileList = lines
      .slice(0, 10)
      .map((l) => `  ${l}`)
      .join("\n");
    const overflow =
      lines.length > 10 ? `\n  ... and ${lines.length - 10} more` : "";

    const ok = await ctx.ui.confirm(
      "Uncommitted changes detected",
      `There are ${lines.length} uncommitted change${lines.length === 1 ? "" : "s"}:\n\n${fileList}${overflow}\n\nThe agent may modify these files. Consider stashing or committing first.\n\nProceed anyway?`,
      { timeout: 30_000 }, // auto-allow after 30 seconds
    );

    if (!ok) {
      return {
        // Inject a message telling the agent why it was stopped
        message: {
          customType: "dirty-repo-guard",
          content:
            "Blocked: uncommitted changes detected. Please stash or commit before proceeding.",
          display: true,
        },
      };
    }
  });

  pi.on("session_shutdown", async (_event, ctx) => {
    ctx.ui.setStatus("dirty-repo-guard", undefined);
  });
}

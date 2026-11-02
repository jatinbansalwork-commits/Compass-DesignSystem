# kdesign-mcp — Agent Context

MCP (Model Context Protocol) server for the Kdesign Design System. Exposes Kdesign docs to AI agents via MCP tools along with other tools such as figma-to-code, create-new-kdesign-project, etc.

Kdesign MCP is in maintenance mode. New capabilities go into `packages/kdesign-plugin` (Claude Code plugin + cross-agent skills). The MCP stays for Cursor users without skills support and for the HTTP transport consumed by kdesign-chat.

## Package Structure

```
knowledgebase/       # Build output (gitignored). Copied from packages/kdesign-plugin/skills/kdesign/references by scripts/copyKnowledgebase.mjs. Never edit here.
skillTemplate/       # The MCP's own `ui-code-guidelines` skill installed by create_kdesign_skill. Bump SKILL_VERSION in src/utils/tokens.ts when it changes.
cursorRules/         # Legacy, frozen. Published 1.15.0-1.26.x (HTTP transport) download it from master; do not move or delete.
src/
  tools/      # MCP tool definitions
  utils/      # Shared utilities
  server.ts   # MCP server entry point
scripts/
  copyKnowledgebase.mjs  # prebuild/pretest/predev copy step
```

Do not move or delete files under `skillTemplate/` or `cursorRules/`: published HTTP-transport versions curl them from `master`. `skillTemplate/references/*.md` must match the plugin copies (enforced by `yarn validate:kdesign-plugin`).

Knowledgebase docs (components, patterns, general) are authored in `packages/kdesign-plugin/skills/kdesign/references/`. Authoring prompts live in `packages/kdesign-plugin/authoring/`.

## Quick Commands

> **Note:** Run these commands from the `packages/kdesign-mcp` directory.

| Task             | Command                                    |
| ---------------- | ------------------------------------------ |
| Build            | `yarn build`                               |
| Dev (watch)      | `yarn dev`                                 |
| Inspect MCP      | `yarn inspect`                             |
| Start server     | `yarn start` (requires build to run first) |
| Type check       | `yarn typecheck`                           |
| Run tests        | `yarn test`                                |
| Update snapshots | `yarn test:updateSnapshots`                |

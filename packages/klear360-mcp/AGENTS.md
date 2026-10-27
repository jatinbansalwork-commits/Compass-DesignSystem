# klear360-mcp — Agent Context

MCP (Model Context Protocol) server for the Klear360 Design System. Exposes Klear360 docs to AI agents via MCP tools along with other tools such as figma-to-code, create-new-blade-project, etc.

Klear360 MCP is in maintenance mode. New capabilities go into `packages/klear360-plugin` (Claude Code plugin + cross-agent skills). The MCP stays for Cursor users without skills support and for the HTTP transport consumed by blade-chat.

## Package Structure

```
knowledgebase/       # Build output (gitignored). Copied from packages/klear360-plugin/skills/klear360/references by scripts/copyKnowledgebase.mjs. Never edit here.
skillTemplate/       # The MCP's own `ui-code-guidelines` skill installed by create_klear360_skill. Bump SKILL_VERSION in src/utils/tokens.ts when it changes.
cursorRules/         # Legacy, frozen. Published 1.15.0-1.26.x (HTTP transport) download it from master; do not move or delete.
src/
  tools/      # MCP tool definitions
  utils/      # Shared utilities
  server.ts   # MCP server entry point
scripts/
  copyKnowledgebase.mjs  # prebuild/pretest/predev copy step
```

Do not move or delete files under `skillTemplate/` or `cursorRules/`: published HTTP-transport versions curl them from `master`. `skillTemplate/references/*.md` must match the plugin copies (enforced by `yarn validate:klear360-plugin`).

Knowledgebase docs (components, patterns, general) are authored in `packages/klear360-plugin/skills/klear360/references/`. Authoring prompts live in `packages/klear360-plugin/authoring/`.

## Quick Commands

> **Note:** Run these commands from the `packages/klear360-mcp` directory.

| Task             | Command                                    |
| ---------------- | ------------------------------------------ |
| Build            | `yarn build`                               |
| Dev (watch)      | `yarn dev`                                 |
| Inspect MCP      | `yarn inspect`                             |
| Start server     | `yarn start` (requires build to run first) |
| Type check       | `yarn typecheck`                           |
| Run tests        | `yarn test`                                |
| Update snapshots | `yarn test:updateSnapshots`                |

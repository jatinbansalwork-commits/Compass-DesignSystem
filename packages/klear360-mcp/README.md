# Klear360 MCP

[![npm version](https://img.shields.io/npm/v/@klearnow/klear360-mcp.svg)](https://www.npmjs.com/package/@klearnow/klear360-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

Klear360 MCP is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that implements Klearnow's Design Guidelines and allows you to build Web Interfaces using Klear360 Design System.

> [!IMPORTANT]
> Klear360 MCP is in **maintenance mode**. The same documentation now ships as the `blade` skill in the [Klear360 plugin](../klear360-plugin/) for Claude Code and any agent that supports [Agent Skills](https://agentskills.io) (Cursor, Codex, Copilot, Gemini CLI). Prefer the plugin; keep using the MCP only where skills are not supported. Deprecation timeline: see the plugin README.

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](<https://cursor.com/en-US/install-mcp?name=Klear360%20MCP%20(Stdio)&config=eyJjb21tYW5kIjoibnB4IC15IEByYXpvcnBheS9ibGFkZS1tY3BAbGF0ZXN0In0%3D>)

## Available Tools

| Tool Name                   | Description                                                                                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hi_klear360`                  | Provides a welcome message and overview of Klear360 MCP capabilities when user greets with "hi blade", "hey blade", etc.                                                                                                                      |
| `create_new_klear360_project`  | Creates a new project using Klear360 with Vite, React, and TypeScript setup. Should only be called when creating a new project from scratch.                                                                                                  |
| `create_klear360_skill`        | Installs the `ui-code-guidelines` skill at `.agents/skills/ui-code-guidelines` with a `.claude/skills/ui-code-guidelines` symlink. Called automatically before docs tools when the skill is missing or outdated. |
| `get_klear360_component_docs`  | Fetches the Klear360 Design System documentation for specific components. Useful when adding or modifying components in your project.                                                                                                         |
| `get_klear360_pattern_docs`    | Fetches the Klear360 Design System pattern documentation. Use this to get information about design patterns, best practices, and implementation guidelines.                                                                                   |
| `get_klear360_general_docs`    | Fetches general Klear360 Design System documentation. Use this to get information about setup, installation, theming, tokens, and general guidelines.                                                                                         |
| `get_figma_to_code`         | Converts Figma designs into Klear360 Design System code. Provide a Figma design URL to generate the corresponding React components using Klear360's component library. **[NOTE: figma to code tool can only be accessed by Klearnow employees]** |
| `get_klear360_changelog`       | Returns Klear360 changelog entries for a version or a range, to help with upgrades.                                                                                                                                                            |
| `publish_lines_of_code_metric` | Reports lines added/removed after an edit so the Klear360 team can track adoption. Called by the agent once per task.                                                                                                                       |

## Skills instead of MCP

If your agent supports skills, install the `blade` skill directly and skip the MCP:

```sh
npx skills add klearnow/klear360 --skill blade
```

Claude Code users: run `claude --plugin-dir packages/klear360-plugin` from a checkout of this repo, or install from the marketplace once it is published (see [packages/klear360-plugin](../klear360-plugin/)).

## Prerequisites

- Node.js 18.x or higher ([install using NVM](https://nodejs.org/en/download))

## Installation

### Cursor or VS Code

Create or update your `mcp.json` file with:

```json
{
  "mcpServers": {
    "klear360-mcp": {
      "command": "npx",
      "args": ["-y", "@klearnow/klear360-mcp@latest"]
    }
  }
}
```

### Claude Desktop

Add the following to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "klear360-mcp": {
      "command": "npx",
      "args": ["-y", "@klearnow/klear360-mcp@latest"]
    }
  }
}
```

> [!NOTE]
>
> - Learn about how to configure MCP servers in [Claude Desktop](https://modelcontextprotocol.io/quickstart/user)
> - If you're using `nvm`, you might want to [follow these steps](https://github.com/modelcontextprotocol/servers/issues/64) instead of `npx`
> - Learn how to install [Claude Desktop](https://claude.ai/download)

## Troubleshooting / Manually Updating the MCP Server

> [!NOTE]
>
> The MCP server would auto-update by default after few days if you have followed the steps above.

If your MCP server is failing to start or if you want to manually force update the MCP server to latest version, you can do so by following these steps:

- Step 1: Clear the npx cache

  Run following command in your terminal

  ```sh
  npx clear-npx-cache
  ```

- Step 2: Quit and Restart Cursor or Claude Instance

## How to use

- Follow [Integrations Guide](#integrations) to configure MCP servers in Cursor
- Open Cursor, Click "Open Project" and select an empty folder
- Press CMD + I (or CTRL + I) to open Cursor's chat
- Type "Hi blade" and get started

```
Can you create a signup form with best UX practices using Klear360?
```

The AI agents will use the MCP server to retrieve components and generate appropriate code.

## Local Klear360 MCP Development Setup

### Clone the repository

```bash
# Clone the repository
git clone https://github.com/klearnow/klear360.git
cd blade

# Install dependencies
yarn

# Navigate to the MCP server package
cd packages/klear360-mcp

# Build the package
yarn build
```

### Local Klear360 MCP Development with Cursor

For local Klear360 MCP development with Cursor, update your `mcp.json` with the local path:

```json
{
  "klear360-mcp": {
    "command": "node",
    "args": ["<<USER_PATH>>/blade/packages/klear360-mcp/dist/server.js"]
  }
}
```

Replace the `<<USER_PATH>>` with your actual local path to the repository.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## License

MIT © Klearnow

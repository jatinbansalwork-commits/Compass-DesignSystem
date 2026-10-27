# Compass MCP

[![npm version](https://img.shields.io/npm/v/@klearnow/compass-mcp.svg)](https://www.npmjs.com/package/@klearnow/compass-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

Compass MCP is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that implements Klearnow's Design Guidelines and allows you to build Web Interfaces using Compass Design System.

> [!IMPORTANT]
> Compass MCP is in **maintenance mode**. The same documentation now ships as the `blade` skill in the [Compass plugin](../compass-plugin/) for Claude Code and any agent that supports [Agent Skills](https://agentskills.io) (Cursor, Codex, Copilot, Gemini CLI). Prefer the plugin; keep using the MCP only where skills are not supported. Deprecation timeline: see the plugin README.

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](<https://cursor.com/en-US/install-mcp?name=Compass%20MCP%20(Stdio)&config=eyJjb21tYW5kIjoibnB4IC15IEByYXpvcnBheS9ibGFkZS1tY3BAbGF0ZXN0In0%3D>)

## Available Tools

| Tool Name                   | Description                                                                                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hi_compass`                  | Provides a welcome message and overview of Compass MCP capabilities when user greets with "hi blade", "hey blade", etc.                                                                                                                      |
| `create_new_compass_project`  | Creates a new project using Compass with Vite, React, and TypeScript setup. Should only be called when creating a new project from scratch.                                                                                                  |
| `create_compass_skill`        | Installs the `ui-code-guidelines` skill at `.agents/skills/ui-code-guidelines` with a `.claude/skills/ui-code-guidelines` symlink. Called automatically before docs tools when the skill is missing or outdated. |
| `get_compass_component_docs`  | Fetches the Compass Design System documentation for specific components. Useful when adding or modifying components in your project.                                                                                                         |
| `get_compass_pattern_docs`    | Fetches the Compass Design System pattern documentation. Use this to get information about design patterns, best practices, and implementation guidelines.                                                                                   |
| `get_compass_general_docs`    | Fetches general Compass Design System documentation. Use this to get information about setup, installation, theming, tokens, and general guidelines.                                                                                         |
| `get_figma_to_code`         | Converts Figma designs into Compass Design System code. Provide a Figma design URL to generate the corresponding React components using Compass's component library. **[NOTE: figma to code tool can only be accessed by Klearnow employees]** |
| `get_compass_changelog`       | Returns Compass changelog entries for a version or a range, to help with upgrades.                                                                                                                                                            |
| `publish_lines_of_code_metric` | Reports lines added/removed after an edit so the Compass team can track adoption. Called by the agent once per task.                                                                                                                       |

## Skills instead of MCP

If your agent supports skills, install the `blade` skill directly and skip the MCP:

```sh
npx skills add klearnow/compass --skill blade
```

Claude Code users: run `claude --plugin-dir packages/compass-plugin` from a checkout of this repo, or install from the marketplace once it is published (see [packages/compass-plugin](../compass-plugin/)).

## Prerequisites

- Node.js 18.x or higher ([install using NVM](https://nodejs.org/en/download))

## Installation

### Cursor or VS Code

Create or update your `mcp.json` file with:

```json
{
  "mcpServers": {
    "compass-mcp": {
      "command": "npx",
      "args": ["-y", "@klearnow/compass-mcp@latest"]
    }
  }
}
```

### Claude Desktop

Add the following to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "compass-mcp": {
      "command": "npx",
      "args": ["-y", "@klearnow/compass-mcp@latest"]
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
Can you create a signup form with best UX practices using Compass?
```

The AI agents will use the MCP server to retrieve components and generate appropriate code.

## Local Compass MCP Development Setup

### Clone the repository

```bash
# Clone the repository
git clone https://github.com/klearnow/compass.git
cd blade

# Install dependencies
yarn

# Navigate to the MCP server package
cd packages/compass-mcp

# Build the package
yarn build
```

### Local Compass MCP Development with Cursor

For local Compass MCP development with Cursor, update your `mcp.json` with the local path:

```json
{
  "compass-mcp": {
    "command": "node",
    "args": ["<<USER_PATH>>/blade/packages/compass-mcp/dist/server.js"]
  }
}
```

Replace the `<<USER_PATH>>` with your actual local path to the repository.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## License

MIT © Klearnow

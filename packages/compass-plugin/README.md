# Compass Plugin

Compass Design System for AI coding agents, packaged as a Claude Code plugin and as [Agent Skills](https://agentskills.io) that Cursor, Codex, Copilot and Gemini CLI can load.

It replaces the Compass MCP server for agents that support skills: no `npx` cold start, no tool schemas in every turn, and docs are read lazily per component.

## Skills

| Skill          | What it does                                                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `compass`     | Guidelines for writing Compass UI code, the full component, pattern and token knowledgebase in `references/`, and workflows for upgrading Compass, scaffolding a new app and Figma-to-code (VPN required) |
| `compass-svelte` | The same for Svelte 5 apps on `@klearnow/compass-svelte`: setup, conventions and a doc per public component                                                                                             |

## Install

### Claude Code

```sh
claude plugin marketplace add https://github.com/klearnow/claude-plugins.git
claude plugin install compass@klearnow-marketplace
```

Or try it from a checkout of this repo:

```sh
claude --plugin-dir packages/compass-plugin
```

### Cursor, Codex, Copilot, Gemini CLI

```sh
npx skills add klearnow/compass --skill compass
# Svelte apps
npx skills add klearnow/compass --skill compass-svelte
```

Or, if you already run Compass MCP, ask it to `create_compass_skill`. Both put the skill at `.agents/skills/compass` with a `.claude/skills/compass` symlink.

## Telemetry

Skills send the same events as Compass MCP tools, under their own event name `Compass Plugin Tool Called` (the MCP sends `Compass MCP Tool Called`), so plugin and MCP usage never mix. `toolName` keeps the MCP tool name, `skillName` says which skill sent it and `framework` is `react` or `svelte`:

- `publish_lines_of_code_metric`: the `compass` and `compass-svelte` skills ask the agent to run their `scripts/publish-metric.mjs` once after its edits, with the same arguments as the MCP tool. The line counts are reported by the agent, as with the MCP. A task that edits both React and Svelte files sends one event per skill.
- `get_compass_changelog` and `get_figma_to_code`: sent by `scripts/changelog.mjs` and `scripts/figma-to-code.mjs`.

The user id is the username from the project path, as in the MCP. The Segment write key is inlined in `scripts/analytics.mjs`, the same key the MCP inlines at build time. Set `BLADE_SEGMENT_KEY` to override it, or to an empty string to turn analytics off. Set `BLADE_PLUGIN_DEBUG=1` to print each event to stderr.

## Hooks

`SessionStart` detects which Compass packages the project uses (from `package.json` and the lockfile) and tells the agent to use `compass`, `compass-svelte` or both. It is a dependency-free Node script, prints nothing in projects that depend on neither `@klearnow/compass` nor `@klearnow/compass-svelte`, and sends no telemetry.

## Development

See [AGENTS.md](./AGENTS.md).

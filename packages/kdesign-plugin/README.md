# Kdesign Plugin

Kdesign Design System for AI coding agents, packaged as a Claude Code plugin and as [Agent Skills](https://agentskills.io) that Cursor, Codex, Copilot and Gemini CLI can load.

It replaces the Kdesign MCP server for agents that support skills: no `npx` cold start, no tool schemas in every turn, and docs are read lazily per component.

## Skills

| Skill          | What it does                                                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kdesign`     | Guidelines for writing Kdesign UI code, the full component, pattern and token knowledgebase in `references/`, and workflows for upgrading Kdesign, scaffolding a new app and Figma-to-code (VPN required) |
| `kdesign-svelte` | The same for Svelte 5 apps on `@klearnow/kdesign-svelte`: setup, conventions and a doc per public component                                                                                             |

## Install

### Claude Code

```sh
claude plugin marketplace add https://github.com/klearnow/claude-plugins.git
claude plugin install kdesign@klearnow-marketplace
```

Or try it from a checkout of this repo:

```sh
claude --plugin-dir packages/kdesign-plugin
```

### Cursor, Codex, Copilot, Gemini CLI

```sh
npx skills add klearnow/compass --skill kdesign
# Svelte apps
npx skills add klearnow/compass --skill kdesign-svelte
```

Or, if you already run Kdesign MCP, ask it to `create_kdesign_skill`. Both put the skill at `.agents/skills/kdesign` with a `.claude/skills/kdesign` symlink.

## Telemetry

Skills send the same events as Kdesign MCP tools, under their own event name `Kdesign Plugin Tool Called` (the MCP sends `Kdesign MCP Tool Called`), so plugin and MCP usage never mix. `toolName` keeps the MCP tool name, `skillName` says which skill sent it and `framework` is `react` or `svelte`:

- `publish_lines_of_code_metric`: the `kdesign` and `kdesign-svelte` skills ask the agent to run their `scripts/publish-metric.mjs` once after its edits, with the same arguments as the MCP tool. The line counts are reported by the agent, as with the MCP. A task that edits both React and Svelte files sends one event per skill.
- `get_kdesign_changelog` and `get_figma_to_code`: sent by `scripts/changelog.mjs` and `scripts/figma-to-code.mjs`.

The user id is the username from the project path, as in the MCP. The Segment write key is inlined in `scripts/analytics.mjs`, the same key the MCP inlines at build time. Set `KDESIGN_SEGMENT_KEY` to override it, or to an empty string to turn analytics off. Set `KDESIGN_PLUGIN_DEBUG=1` to print each event to stderr.

## Hooks

`SessionStart` detects which Kdesign packages the project uses (from `package.json` and the lockfile) and tells the agent to use `kdesign`, `kdesign-svelte` or both. It is a dependency-free Node script, prints nothing in projects that depend on neither `@klearnow/kdesign` nor `@klearnow/kdesign-svelte`, and sends no telemetry.

## Development

See [AGENTS.md](./AGENTS.md).

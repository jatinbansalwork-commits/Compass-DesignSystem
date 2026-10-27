# Compass Monorepo — Agent Context

This is the monorepo for the Compass Design System. It contains different packages related to the Compass Design System of Klearnow.

## Packages

Load the Agents Context File in your context whenever change is being made to that particular package. Use CLAUDE.md when you are using Claude Code and AGENTS.md when you are using Cursor or other coding tool.

| Package                                  | Agents Context File                            | Description                                                                                                                       |
| ---------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [compass](./packages/compass/)               | ./packages/compass/CLAUDE.md or AGENTS.md        | The core Compass Design System package with cross-platform UI components for React Web and React Native                             |
| [compass-plugin](./packages/compass-plugin/) | ./packages/compass-plugin/CLAUDE.md or AGENTS.md | Claude Code plugin + cross-agent skills. Owns the Compass React knowledgebase (component/pattern/general docs for AI agents)        |
| [compass-mcp](./packages/compass-mcp/)       | ./packages/compass-mcp/CLAUDE.md or AGENTS.md    | Model Context Protocol (MCP) server for AI-assisted development using Compass components (maintenance mode)                         |
| [compass-core](./packages/compass-core/)     | ./packages/compass-core/CLAUDE.md or AGENTS.md   | Core utilities for Compass Design System (Only used in compass-svelte as of now and not in the core compass package)                             |
| [compass-svelte](./packages/compass-svelte/) | ./packages/compass-svelte/CLAUDE.md or AGENTS.md | Svelte components for Compass Design System (changes here should only be made when explicitly asked by the user for svelte changes) |

.. And few other smaller packages related to Compass

## Finding Task Intent

We want to know if the intent of the user is to build complete feature/fix end-to-end (in that case we would want to write tests, fix lints, fix snapshots, etc) or its a small casual prompt to iterate over task faster where scope of task is limited to what user has asked for.

```sh
# existence of GITHUB__KLEARNOW_SWE_AGENT_APP__APP_ID environment variable in the session, implies that this request was triggered on cloud agent where the intent is to build things end-to-end.
if [ -z "$GITHUB__KLEARNOW_SWE_AGENT_APP__APP_ID" ]; then
  echo "Intent: 'normal-task'"
else
  echo "Intent: 'perform-task-end-to-end'"
fi
```

When intent is `perform-task-end-to-end`, load `perform-task-end-to-end` skill in your context and do the task end-to-end as guided by the skill.

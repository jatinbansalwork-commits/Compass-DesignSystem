# Compass MCP health report

**Date:** 2026-10-27  
**Repo:** `Compass-Master`  
**Scope:** AI consumability via MCP (Cursor / Claude)

---

## Executive summary

| Check | Status | Notes |
| --- | --- | --- |
| Project MCP config exists | 🟡 **Fixed in repo** | Was pointing at deleted `packages/blade-mcp`; updated to `packages/compass-mcp/dist/server.js` |
| Global MCP config (`~/.cursor/mcp.json`) | 🔴 **Broken** | Still references non-existent `blade-mcp` path on this machine |
| Official MCP package (`@klearnow/compass-mcp`) | ✅ | Built, **56/56** unit tests pass |
| Cursor session MCP tools (`user-compass-mcp`) | ✅ | `hi_compass` responds; doc tools require correct args |
| Component manifest | ✅ | `packages/compass/component-manifest.json` (79 components, 54 with JSDoc) |
| Custom `mcp-server.js` in `packages/compass` | ⏭ **Not added** | Use `@klearnow/compass-mcp` (stdio MCP protocol + knowledgebase) |
| Type definitions in build | 🟡 | **6** `.d.ts` files under `build/types/` (aggregate entrypoints); full surface via `components.d.ts` at package root |
| Package `exports` + `types` | ✅ | `./components`, `./tokens`, `./utils` include `types` conditions |
| Machine-readable API dump (TypeDoc / api.json) | 🔴 | Not configured in `packages/compass` |
| CI MCP validation | ✅ | `.github/workflows/compass-mcp-validate.yml` |

---

## Step 1 — MCP configuration

| Location | Path | Status |
| --- | --- | --- |
| Monorepo (project) | `.cursor/mcp.json` | Updated to `node packages/compass-mcp/dist/server.js` (relative args) |
| Monorepo | `.mcp.json`, `cursor.json` | Not present |
| Package | `packages/compass/.cursor/mcp.json` | Not present |
| Global | `~/.cursor/mcp.json` | **Stale:** `.../packages/blade-mcp/dist/server.js` (directory does not exist) |

**Action for developers:** Align global and project config with [packages/compass-mcp/README.md](../compass-mcp/README.md) — recommended:

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

Or from monorepo checkout after `yarn build:compass-mcp`:

```json
{
  "mcpServers": {
    "compass-mcp": {
      "command": "node",
      "args": ["packages/compass-mcp/dist/server.js"]
    }
  }
}
```

Restart Cursor after editing MCP settings.

---

## Step 2 — Design system artifacts for AI

### 2a — Component manifest

- **Before:** None in repo.
- **Now:** `packages/compass/component-manifest.json` — 79 indexed components, JSDoc counts per folder.
- **Primary source of truth for agents:** `packages/compass-plugin/skills/compass/references/` (copied into MCP `knowledgebase/` on build).

### 2b — Type definitions

- Root stubs: `components.d.ts`, `tokens.d.ts`, `utils.d.ts`.
- `package.json` `exports` map includes `types` for `./components`, `./tokens`, `./utils`.
- Local `build/` may be partial if full `yarn build` was not run; CI/release builds populate lib output.

### 2c — Machine-readable docs

- **MCP / plugin:** Markdown knowledgebase (components, patterns, general) — maintained in `compass-plugin`, not TypeDoc JSON.
- **JSDoc in source:** ~35 components with public prop docs (~215+ props); manifest tracks per-component JSDoc density.
- **TypeDoc:** Not configured.

---

## Step 3 — Cursor integration

| Item | Finding |
| --- | --- |
| `.cursor/` at repo root | Contains `mcp.json` only |
| `.cursor/rules`, `.cursorrules` | Not at repo root; agent context via `AGENTS.md`, `packages/compass/AGENTS.md`, plugin skills |
| `.cursorignore` | Present (excludes `build/`, `dist/`, etc.) |
| Monorepo scripts | `build:compass-mcp`, `lint:compass-mcp`, `validate:compass-plugin` |

---

## Step 4 — Developer experience today

**Install (from README / MCP `get_compass_general_docs`):**

```tsx
import { CompassProvider, Button } from '@klearnow/compass/components';
import '@klearnow/compass/fonts.css';
```

**Best path for AI-assisted UI:**

1. Enable **compass-mcp** in Cursor (fix config path or use `npx @klearnow/compass-mcp@latest`).
2. Or install **compass plugin / skill** (`packages/compass-plugin`) — preferred long-term per MCP README (maintenance mode).
3. Ask for components by name; MCP tools `get_compass_component_docs`, `get_compass_pattern_docs`, `get_compass_general_docs` supply APIs and examples.

**Gaps:**

- Stale **blade-mcp** paths in local/global MCP config break stdio server until updated.
- JSDoc coverage incomplete (~75 components without full public prop docs).
- No single JSON schema export of all props (manifest is index + JSDoc counts only).
- `packages/compass/README.md` still uses legacy hero/badges (root README was simplified).

---

## Step 5–7 — Server tests

| Test | Result |
| --- | --- |
| `@klearnow/compass-mcp` unit tests | ✅ 56 passed |
| `hi_compass` (live MCP in Cursor) | ✅ Welcome v1.33.0 |
| Ad-hoc `echo '{"method":"health"}' \| node mcp-server.js` | ⏭ Not applicable — use official MCP server (JSON-RPC), not a custom line protocol |
| `get_compass_component_docs` | ✅ Works with `componentsList` + absolute `currentProjectRootDirectory` |

---

## Recommended fixes (priority)

1. **DevOps / each developer:** Update `~/.cursor/mcp.json` to remove `blade-mcp` path (match project `.cursor/mcp.json` or use `npx @klearnow/compass-mcp@latest`).
2. **Optional:** Commit `component-manifest.json` and regenerate in CI from JSDoc counts for drift detection.
3. **Product:** Continue JSDoc sprint; MCP knowledgebase already documents usage — keep plugin and MCP knowledgebase in sync via `yarn validate:compass-plugin`.
4. **Do not** add a second lightweight `packages/compass/mcp-server.js` — duplicates `@klearnow/compass-mcp` and won't speak full MCP protocol.

---

## Health checklist (final)

| Check | Status |
| --- | --- |
| MCP config exists (project) | ✅ (after fix) |
| MCP config valid (points to real server) | ✅ project / 🔴 global |
| Component manifest generated | ✅ |
| MCP server running (package tests) | ✅ |
| Type definitions exported | ✅ (package exports; build may need full `yarn build`) |
| Cursor MCP connection (this session) | ✅ tools namespace active |
| Health / greeting endpoint | ✅ `hi_compass` |
| Component list / docs endpoint | ✅ `get_compass_component_docs` |
| Install instructions | ✅ via general docs + README |

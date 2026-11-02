# Kdesign MCP health report

**Date:** 2026-10-27  
**Repo:** `Kdesign-Master`  
**Scope:** AI consumability via MCP (Cursor / Claude)

---

## Executive summary

| Check | Status | Notes |
| --- | --- | --- |
| Project MCP config exists | 🟡 **Fixed in repo** | Was pointing at deleted `packages/kdesign-mcp`; updated to `packages/kdesign-mcp/dist/server.js` |
| Global MCP config (`~/.cursor/mcp.json`) | 🔴 **Broken** | Still references non-existent `kdesign-mcp` path on this machine |
| Official MCP package (`@klearnow/kdesign-mcp`) | ✅ | Built, **56/56** unit tests pass |
| Cursor session MCP tools (`user-kdesign-mcp`) | ✅ | `hi_kdesign` responds; doc tools require correct args |
| Component manifest | ✅ | `packages/kdesign/component-manifest.json` (79 components, 54 with JSDoc) |
| Custom `mcp-server.js` in `packages/kdesign` | ⏭ **Not added** | Use `@klearnow/kdesign-mcp` (stdio MCP protocol + knowledgebase) |
| Type definitions in build | 🟡 | **6** `.d.ts` files under `build/types/` (aggregate entrypoints); full surface via `components.d.ts` at package root |
| Package `exports` + `types` | ✅ | `./components`, `./tokens`, `./utils` include `types` conditions |
| Machine-readable API dump (TypeDoc / api.json) | 🔴 | Not configured in `packages/kdesign` |
| CI MCP validation | ✅ | `.github/workflows/kdesign-mcp-validate.yml` |

---

## Step 1 — MCP configuration

| Location | Path | Status |
| --- | --- | --- |
| Monorepo (project) | `.cursor/mcp.json` | Updated to `node packages/kdesign-mcp/dist/server.js` (relative args) |
| Monorepo | `.mcp.json`, `cursor.json` | Not present |
| Package | `packages/kdesign/.cursor/mcp.json` | Not present |
| Global | `~/.cursor/mcp.json` | **Stale:** `.../packages/kdesign-mcp/dist/server.js` (directory does not exist) |

**Action for developers:** Align global and project config with [packages/kdesign-mcp/README.md](../kdesign-mcp/README.md) — recommended:

```json
{
  "mcpServers": {
    "kdesign-mcp": {
      "command": "npx",
      "args": ["-y", "@klearnow/kdesign-mcp@latest"]
    }
  }
}
```

Or from monorepo checkout after `yarn build:kdesign-mcp`:

```json
{
  "mcpServers": {
    "kdesign-mcp": {
      "command": "node",
      "args": ["packages/kdesign-mcp/dist/server.js"]
    }
  }
}
```

Restart Cursor after editing MCP settings.

---

## Step 2 — Design system artifacts for AI

### 2a — Component manifest

- **Before:** None in repo.
- **Now:** `packages/kdesign/component-manifest.json` — 79 indexed components, JSDoc counts per folder.
- **Primary source of truth for agents:** `packages/kdesign-plugin/skills/kdesign/references/` (copied into MCP `knowledgebase/` on build).

### 2b — Type definitions

- Root stubs: `components.d.ts`, `tokens.d.ts`, `utils.d.ts`.
- `package.json` `exports` map includes `types` for `./components`, `./tokens`, `./utils`.
- Local `build/` may be partial if full `yarn build` was not run; CI/release builds populate lib output.

### 2c — Machine-readable docs

- **MCP / plugin:** Markdown knowledgebase (components, patterns, general) — maintained in `kdesign-plugin`, not TypeDoc JSON.
- **JSDoc in source:** ~35 components with public prop docs (~215+ props); manifest tracks per-component JSDoc density.
- **TypeDoc:** Not configured.

---

## Step 3 — Cursor integration

| Item | Finding |
| --- | --- |
| `.cursor/` at repo root | Contains `mcp.json` only |
| `.cursor/rules`, `.cursorrules` | Not at repo root; agent context via `AGENTS.md`, `packages/kdesign/AGENTS.md`, plugin skills |
| `.cursorignore` | Present (excludes `build/`, `dist/`, etc.) |
| Monorepo scripts | `build:kdesign-mcp`, `lint:kdesign-mcp`, `validate:kdesign-plugin` |

---

## Step 4 — Developer experience today

**Install (from README / MCP `get_kdesign_general_docs`):**

```tsx
import { KdesignProvider, Button } from '@klearnow/kdesign/components';
import '@klearnow/kdesign/fonts.css';
```

**Best path for AI-assisted UI:**

1. Enable **kdesign-mcp** in Cursor (fix config path or use `npx @klearnow/kdesign-mcp@latest`).
2. Or install **kdesign plugin / skill** (`packages/kdesign-plugin`) — preferred long-term per MCP README (maintenance mode).
3. Ask for components by name; MCP tools `get_kdesign_component_docs`, `get_kdesign_pattern_docs`, `get_kdesign_general_docs` supply APIs and examples.

**Gaps:**

- Stale **kdesign-mcp** paths in local/global MCP config break stdio server until updated.
- JSDoc coverage incomplete (~75 components without full public prop docs).
- No single JSON schema export of all props (manifest is index + JSDoc counts only).
- `packages/kdesign/README.md` still uses legacy hero/badges (root README was simplified).

---

## Step 5–7 — Server tests

| Test | Result |
| --- | --- |
| `@klearnow/kdesign-mcp` unit tests | ✅ 56 passed |
| `hi_kdesign` (live MCP in Cursor) | ✅ Welcome v1.33.0 |
| Ad-hoc `echo '{"method":"health"}' \| node mcp-server.js` | ⏭ Not applicable — use official MCP server (JSON-RPC), not a custom line protocol |
| `get_kdesign_component_docs` | ✅ Works with `componentsList` + absolute `currentProjectRootDirectory` |

---

## Recommended fixes (priority)

1. **DevOps / each developer:** Update `~/.cursor/mcp.json` to remove `kdesign-mcp` path (match project `.cursor/mcp.json` or use `npx @klearnow/kdesign-mcp@latest`).
2. **Optional:** Commit `component-manifest.json` and regenerate in CI from JSDoc counts for drift detection.
3. **Product:** Continue JSDoc sprint; MCP knowledgebase already documents usage — keep plugin and MCP knowledgebase in sync via `yarn validate:kdesign-plugin`.
4. **Do not** add a second lightweight `packages/kdesign/mcp-server.js` — duplicates `@klearnow/kdesign-mcp` and won't speak full MCP protocol.

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
| Health / greeting endpoint | ✅ `hi_kdesign` |
| Component list / docs endpoint | ✅ `get_kdesign_component_docs` |
| Install instructions | ✅ via general docs + README |

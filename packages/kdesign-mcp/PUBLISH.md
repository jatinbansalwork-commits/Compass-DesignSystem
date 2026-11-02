# Publish `@jatin_ux/kdesign-mcp` to npm

## Why publish failed (your logs)

| Error | Meaning |
|--------|---------|
| `npm whoami` → **401** | You are **not logged in** (or token expired). |
| `PUT @jatin_ux/kdesign-mcp` → **404** | Same root cause for scoped packages: npm hides “no permission” as 404 when unauthenticated. |
| `@klearnow/kdesign-mcp` → **404** | You are **not** in the `@klearnow` org on npm — use **`@jatin_ux/kdesign-mcp`** only. |
| `npm login` → **Exit handler never called** | Interactive login was interrupted. Use a **token** instead (below). |

The npm **scope must match your npm username** exactly. Your settings URL uses **`jatin_ux`**, so the package name `@jatin_ux/kdesign-mcp` is correct **only if** `npm whoami` prints `jatin_ux`. If it prints something else, change `"name"` in `package.json` to `@<whoami>/kdesign-mcp`.

---

## Step 1 — Create a token (recommended)

1. Open [npm Access Tokens](https://www.npmjs.com/settings/jatin_ux/tokens) (Granular Access Token).
2. Permissions: **Read and write** packages.
3. Copy the token (`npm_...`).

In your terminal (one line, no `#` comments on the same line as commands):

```bash
npm config set //registry.npmjs.org/:_authToken npm_PASTE_YOUR_TOKEN_HERE
npm whoami
```

You must see: `jatin_ux` (or your actual username).

---

## Step 2 — Publish

```bash
cd /Users/jatinbansal/Downloads/Kdesign-Master/packages/kdesign-mcp
rm -rf dist
yarn build
npm publish --access public
```

Verify:

```bash
npm view @jatin_ux/kdesign-mcp version
```

---

## Step 3 — Cursor MCP (after publish)

`~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "kdesign": {
      "command": "npx",
      "args": ["-y", "@jatin_ux/kdesign-mcp@latest"]
    }
  }
}
```

Reload MCP in Cursor. Tools should be `hi_kdesign`, `get_kdesign_component_docs`, etc.

**Until publish succeeds**, keep using the local server:

```json
"command": "node",
"args": ["/Users/jatinbansal/Downloads/Kdesign-Master/packages/kdesign-mcp/dist/server.js"]
```

---

## Notes

- Do **not** run `npm login` and `npm publish` on one line with `#` comments — zsh will treat that badly.
- `bin` in `package.json` is `{ "kdesign-mcp": "dist/server.js" }` so `npx @jatin_ux/kdesign-mcp` runs the MCP server.
- Test files are excluded from `dist/` (not shipped in the tarball).

---
"@klearnow/kdesign": major
"@klearnow/kdesign-core": major
"@klearnow/kdesign-svelte": major
"@jatin_ux/kdesign-mcp": major
---

Rebrand Compass / Blade / Klear360 to Kdesign.

- Packages are renamed: `@klearnow/compass` → `@klearnow/kdesign`, `@klearnow/compass-core` → `@klearnow/kdesign-core`, `@klearnow/compass-svelte` → `@klearnow/kdesign-svelte`, `@jatin_ux/compass-mcp` → `@jatin_ux/kdesign-mcp`. Update imports to the new package names.
- Exports and types carry the new name, e.g. `CompassProvider` → `KdesignProvider`, `CompassElementRef` → `KdesignElementRef`, `compassTheme` → `kdesignTheme`.
- DOM attributes and CSS hooks are renamed: `data-compass-component` / `data-blade-component` → `data-kdesign-component`, `--blade-*` → `--kdesign-*`, `__blade-*` classes → `__kdesign-*`. Update any test selectors or style overrides that target them.
- MCP tools are renamed, e.g. `get_compass_component_docs` → `get_kdesign_component_docs`.
- `CompassIcon` (the compass glyph) keeps its name.

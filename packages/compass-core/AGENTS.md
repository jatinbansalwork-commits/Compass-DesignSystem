# compass-core — Agent Context

Core utilities and shared functionality for the Compass Design System. Contains shared logic consumed by `@klearnow/compass` and other Compass packages.

Important: This package is only used in `@klearnow/compass-svelte` package right now and not in `@klearnow/compass` package.

## Package Structure

```
src/   # Core utilities and shared code
  tokens/   # Core theme tokens of blade
  styles/   # Shared styles
  utils/    # Shared utilities
  types/    # Shared types
  index.ts  # Entry point
```

## Quick Commands

> **Note:** Run these commands from the `packages/compass-core` directory.

| Task          | Command            |
| ------------- | ------------------ |
| Build         | `yarn build`       |
| Build (watch) | `yarn build:watch` |
| Type check    | `yarn typecheck`   |
| Run tests     | `yarn test`        |

# kdesign-core — Agent Context

Core utilities and shared functionality for the Kdesign Design System. Contains shared logic consumed by `@klearnow/kdesign` and other Kdesign packages.

Important: This package is only used in `@klearnow/kdesign-svelte` package right now and not in `@klearnow/kdesign` package.

## Package Structure

```
src/   # Core utilities and shared code
  tokens/   # Core theme tokens of kdesign
  styles/   # Shared styles
  utils/    # Shared utilities
  types/    # Shared types
  index.ts  # Entry point
```

## Quick Commands

> **Note:** Run these commands from the `packages/kdesign-core` directory.

| Task          | Command            |
| ------------- | ------------------ |
| Build         | `yarn build`       |
| Build (watch) | `yarn build:watch` |
| Type check    | `yarn typecheck`   |
| Run tests     | `yarn test`        |

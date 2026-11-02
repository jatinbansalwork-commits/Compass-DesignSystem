# Kdesign Table — icons & spacing

When editing `packages/kdesign/src/components/Table/**`, read **`packages/kdesign/src/components/Table/docs/TABLE_LAYOUT.md`** and use tokens from `tokens.ts`:

- `tableIcons` — control / row hover sizes (prefer over literal `size="small"`)
- `tableHeaderBand` — header label + filter band padding and gaps
- `tableToolbar` — toolbar padding and gaps
- `tableHoverActions` — trailing hover rail spacing

Do not introduce new hardcoded `spacing.*` values for table chrome without updating `tokens.ts` first.

# New Kdesign project

Creates a new Kdesign app from the `base-kdesign-template` in the klearnow/compass repository.

## Steps

1. The current directory must be empty. Check with:

```bash
[ "$(ls -A)" ] && echo "not empty" || echo "empty"
```

   If it is not empty, stop and ask the user for an empty directory.

2. Copy the template:

```bash
npx degit klearnow/compass/packages/kdesign-mcp/base-kdesign-template
```

3. Install dependencies and the latest Kdesign:

```bash
npm install --legacy-peer-deps && npm install @klearnow/kdesign@latest --legacy-peer-deps
```

4. Start the dev server once, before writing code, and leave it running:

```bash
npm run dev
```

5. Build the UI in `src/App.tsx`. Use the `kdesign` skill to read component docs before using any component.

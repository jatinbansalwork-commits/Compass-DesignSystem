# New Compass project

Creates a new Compass app from the `base-compass-template` in the klearnow/compass repository.

## Steps

1. The current directory must be empty. Check with:

```bash
[ "$(ls -A)" ] && echo "not empty" || echo "empty"
```

   If it is not empty, stop and ask the user for an empty directory.

2. Copy the template:

```bash
npx degit klearnow/compass/packages/compass-mcp/base-compass-template
```

3. Install dependencies and the latest Compass:

```bash
npm install --legacy-peer-deps && npm install @klearnow/compass@latest --legacy-peer-deps
```

4. Start the dev server once, before writing code, and leave it running:

```bash
npm run dev
```

5. Build the UI in `src/App.tsx`. Use the `compass` skill to read component docs before using any component.

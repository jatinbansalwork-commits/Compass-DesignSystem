# New Klear360 project

Creates a new Klear360 app from the `base-klear360-template` in the klearnow/klear360 repository.

## Steps

1. The current directory must be empty. Check with:

```bash
[ "$(ls -A)" ] && echo "not empty" || echo "empty"
```

   If it is not empty, stop and ask the user for an empty directory.

2. Copy the template:

```bash
npx degit klearnow/klear360/packages/klear360-mcp/base-klear360-template
```

3. Install dependencies and the latest Klear360:

```bash
npm install --legacy-peer-deps && npm install @klearnow/klear360@latest --legacy-peer-deps
```

4. Start the dev server once, before writing code, and leave it running:

```bash
npm run dev
```

5. Build the UI in `src/App.tsx`. Use the `klear360` skill to read component docs before using any component.

# @klearnow/kdesign-core

Core utilities and shared functionality for Kdesign Design System.

## Installation

```bash
npm install @klearnow/kdesign-core
# or
yarn add @klearnow/kdesign-core
```

## Usage

### Import everything

```ts
import { colors, spacing, makeBezier, cloneDeep } from '@klearnow/kdesign-core';
```

### Import specific modules

```ts
// Import tokens
import { colors, spacing, typography } from '@klearnow/kdesign-core/tokens';

// Import utilities
import { makeBezier, cloneDeep, isEmpty } from '@klearnow/kdesign-core/utils';
```

## What's included

### Tokens

- **Colors** - Design system color tokens
- **Spacing** - Spacing scale tokens
- **Typography** - Font family, size, and weight tokens
- **Motion** - Animation duration, delay, and easing tokens
- **Border** - Border radius and width tokens
- **Breakpoints** - Responsive breakpoint tokens
- **Elevation** - Shadow and elevation tokens
- **Size** - Size scale tokens
- **Opacity** - Opacity value tokens

### Utilities

- **lodashButBetter** - Lightweight utility functions
  - `capitalize` - Capitalize strings
  - `clamp` - Clamp numbers between min/max
  - `cloneDeep` - Deep clone objects
  - `debounce` - Debounce functions
  - `get` - Get nested object properties
  - `isEmpty` - Check if values are empty
  - `isNumber` - Check if value is a number
  - `isObject` - Check if value is an object
  - `isUndefined` - Check if value is undefined
  - `kebabCase` - Convert to kebab-case
  - `keys` - Get object keys
  - `merge` - Deep merge objects
  - `throttle` - Throttle functions
- **Platform** - Platform detection utilities
- **Logger** - Logging and error utilities
- **makeBezier** - CSS cubic-bezier generation
- **Types** - TypeScript type definitions

## Development

### Build

```bash
yarn build
```

### Type checking

```bash
# Check all platforms
yarn typecheck

# Check specific platform
yarn typecheck:web
yarn typecheck:native
```

## License

MIT


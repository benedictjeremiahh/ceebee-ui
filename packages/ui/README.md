# @ceebee/ui

Ceebee's React 19 design system: CSS-first themes, server-safe primitives, interactive controls,
data display, navigation, motion, and onboarding components.

## Install

```bash
pnpm add @ceebee/ui
```

Import the base stylesheet once near the application root. An optional Skin may be loaded after it.

```tsx
import '@ceebee/ui/styles.css';
import '@ceebee/ui/skins/astra.css';

import { Surface, StatCard } from '@ceebee/ui';
import { Button, Field, TextInput } from '@ceebee/ui/client';
```

The package root is server-safe. Components that require browser state or interaction are exported
from `@ceebee/ui/client`.

## Requirements

- React and React DOM 19 or newer
- `@base-ui/react`, `motion`, `lucide-react`, and `embla-carousel-react` as runtime peers

Licensed under MIT.

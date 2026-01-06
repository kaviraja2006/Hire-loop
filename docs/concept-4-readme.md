# Concept-4: Layout & Component Architecture

This iteration focuses on establishing a robust, scalable frontend architecture using a clear component hierarchy and a global layout system.

## Component Organization

We've restructured the `components/` directory to strictly separate reusable UI primitives from feature-specific layouts:

```
components/
├── features/          # Feature-specific business logic
│   └── layout/        # Layout-specific components
│       ├── Navbar.tsx # Top navigation bar
│       └── Footer.tsx # Page footer
├── layout/            # Global layout structure
│   ├── Header.tsx     # Application header
│   ├── Sidebar.tsx    # Collapsible sidebar navigation
│   └── LayoutWrapper.tsx # Orchestrates the global layout
└── ui/                # Dumb, reusable primitives (Button, Input, etc.)
    ├── AppButton.tsx  # Customized button component
    ├── button.tsx     # Base button primitive
    └── ...
```

## Global Layout Strategy

To ensure a consistent user experience while maintaining flexibility, we implemented a `LayoutWrapper` pattern in `app/layout.tsx`.

### The `LayoutWrapper` Component

This component acts as the central orchestrator for the application's shell. It intelligently decides when to render global elements like the `Sidebar` based on the current route.

**Key Features:**

- **Conditional Rendering**: Automatically hides the `Sidebar` on authentication pages (`/login`, `/sign-in`) and the landing page (`/`), providing a focused experience where needed.
- **Active State Management**: Uses `usePathname()` to highlight the current active navigation link in the `Header` and `Sidebar`.
- **Responsive Design**: The layout adapts to different screen sizes, with the sidebar meant for larger displays and a responsive header for mobile.

### Reusable UI Primitive: `AppButton`

To demonstrate reusable component design, we created `AppButton.tsx`.

- **Purpose**: Wraps the base `Button` component to enforce a simplified and consistent props contract (`label`, `variant`, `size`).
- **Storybook Integration**: We've set up Storybook to document and visually test `AppButton` in isolation, ensuring all variants (Primary, Secondary, Outline, Ghost) render correctly before integration.

## Reflections on "Do Not Import React"

During development, we encountered and resolved persistent ESLint errors related to the rule "Do not import React".

- **The Issue**: Next.js (and modern React) uses a new JSX transform that does not require `import React from 'react'`. However, explicit usage of types like `React.ReactNode` or `React.ComponentProps` triggers lint warnings if `React` is imported as a namespace (`import * as React`).
- **The Solution**: We consistently refactored our components to use **named imports** for types.
  - _Before_: `children: React.ReactNode` with `import * as React from 'react'`
  - _After_: `children: ReactNode` with `import { type ReactNode } from 'react'`

This strict adherence to named imports not only satisfied the linter but also improved code clarity by making dependencies explicit.

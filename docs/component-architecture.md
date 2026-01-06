# 🧩 Component Architecture & Layout System

This document outlines the reusable component architecture and layout system implemented for the Hire-Loop application.

## 🏗️ Folder Structure

```
components/
 ├── layout/              # Structural components
 │    ├── Header.tsx      # Top navigation bar
 │    ├── Sidebar.tsx     # Side navigation menu
 │    └── LayoutWrapper.tsx # Wraps content with Header & Sidebar
 ├── ui/                  # Reusable UI elements
 │    ├── AppButton.tsx   # Custom button component
 │    └── ... (other shadcn/ui components)
 └── index.ts             # Barrel file for easy imports
```

## 📐 Component Hierarchy

```mermaid
graph TD
    RootLayout[RootLayout (app/layout.tsx)] --> LayoutWrapper
    LayoutWrapper --> Header
    LayoutWrapper --> Sidebar
    LayoutWrapper --> MainContent[Main Content Area]
    Header --> Link
    Header --> AuthButtons[Login/Signup Buttons]
    Sidebar --> NavLinks
```

## 🛠️ Reusable Layout Components

### 1. Header (`Header.tsx`)
- **Purpose:** Displays branding, top-level navigation, and authentication actions.
- **Features:** Responsive design, active link highlighting.
- **Usage:** Placed at the top of `LayoutWrapper`.

### 2. Sidebar (`Sidebar.tsx`)
- **Purpose:** Provides vertical navigation for dashboard areas.
- **Features:**
  - Hidden on mobile (by default), visible on desktop.
  - Highlights the current active route.
- **Usage:** Placed adjacent to the main content in `LayoutWrapper`.

### 3. LayoutWrapper (`LayoutWrapper.tsx`)
- **Purpose:** Orchestrates the layout structure.
- **Logic:**
  - Conditionally renders `Sidebar` (hidden on Authentication and Home pages).
  - Ensures correct flexbox structure for sticky headers/sidebars.

## 🧩 Reusable UI Components

### AppButton (`AppButton.tsx`)

A wrapper around the standard UI button that enforces a specific contract while maintaining flexibility.

**Props Contract:**
```typescript
interface AppButtonProps extends ButtonHTMLAttributes {
  label?: string; // Optional text label
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean; // Slot support
}
```

**Example Usage:**
```tsx
import { AppButton } from "@/components";

// Using label prop
<AppButton label="Click Me" onClick={handleClick} />

// Using children
<AppButton variant="outline">Secondary Action</AppButton>
```

## ♿ Accessibility Considerations

1. **Semantic HTML:** Used `<header>`, `<aside>`, `<main>`, and `<nav>` tags for proper document structure.
2. **Navigation:** Links use Next.js `Link` for client-side transitions.
3. **Interactive Elements:** Buttons use accessible focus states (`focus-visible`).
4. **ARIA:** (Future) Add `aria-current="page"` to active links.

## 🎨 Visual Consistency

- **Theming:** Uses Tailwind CSS for consistent spacing, colors (`bg-blue-600`, `text-gray-600`), and typography.
- **Dark Mode:** Components are dark-mode ready (`dark:bg-gray-950`).
- **Responsive:** Sidebar toggles visibility based on screen size (`hidden md:block`).

## 📚 Storybook

Storybook is set up to develop and test components in isolation.

**Run Storybook:**
```bash
npm run storybook
```

**Stories:**
- `components/ui/AppButton.stories.tsx`: visual tests for various button states.

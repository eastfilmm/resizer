# AGENTS.md

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

A Next.js web application for resizing images. Users can upload images, preview them on a canvas, and download the resized PNG with various effects applied.

### Features

- **Background Color**: Toggle between white/black background
- **Canvas Padding**: Adjust padding around the image (0-200px)
- **Glass Blur**: Blur effect using the image's center as background with tint overlay
- **Shadow**: Drop shadow effect on the right and bottom of the image
- **Copyright**: Add copyright text overlay on the image (color auto-adjusts based on background)

### Tech Stack

- **Framework**: Next.js 16.x (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **UI**: React 19.x with styled-components 6.x
- **State Management**: Jotai
- **Package Manager**: pnpm
- **Canvas Optimization**: Browser-specific rendering (Safari vs Chrome/Firefox)

---

## Build, Lint, and Test Commands

### Package Manager

Always use `pnpm` for package management:

```bash
pnpm install          # Install dependencies
pnpm add <package>    # Add a dependency
pnpm add -D <package> # Add a dev dependency
```

### Development

```bash
pnpm dev              # Start dev server with Turbopack (http://localhost:3000)
pnpm build            # Production build with Turbopack
pnpm start            # Start production server
```

### Linting

```bash
pnpm lint             # Run ESLint on the codebase
```

### Testing

No test framework is currently configured. If adding tests, consider Vitest or Jest.

---

## Project Structure

```
src/
├── app/              # Next.js App Router (pages, layouts)
│   └── page.tsx      # Main page with browser-specific canvas rendering
├── atoms/            # Jotai atoms for global state
│   └── imageAtoms.ts # All application state (image, effects, settings)
├── components/       # React components
│   ├── styled/       # Shared styled components (Button, Layout)
│   ├── panels/       # Effect control panels
│   │   ├── BackgroundPanel.tsx   # Background color toggle
│   │   ├── PaddingPanel.tsx      # Padding slider
│   │   ├── GlassBlurPanel.tsx    # Glass blur toggle + sliders
│   │   ├── ShadowPanel.tsx       # Shadow toggle + sliders
│   │   ├── CopyrightPanel.tsx    # Copyright toggle + text input
│   │   └── shared.tsx            # Shared panel styled components
│   ├── ImageCanvas.tsx          # Chrome/Firefox canvas (2000x2000 full res)
│   ├── SafariImageCanvas.tsx    # Safari-optimized canvas (1000x1000 preview)
│   ├── ImageUploader.tsx        # File upload handling
│   ├── DownloadButton.tsx       # Export and reset after download
│   ├── ResetButton.tsx          # Reset all settings
│   ├── ActionButtons.tsx        # Upload/Download/Reset button group
│   └── NavigationBar.tsx        # Bottom navigation with effect panels
├── hooks/            # Custom React hooks
│   ├── useIsSafari.ts           # Safari browser detection
│   └── useResetState.ts         # Reset state logic with default values
├── constants/        # App constants
│   └── canvas.ts     # Canvas sizes and constants
├── lib/              # Library utilities (SSR registry, etc.)
├── types/            # TypeScript type definitions
└── utils/            # Helper/utility functions
    └── canvas.ts     # Canvas rendering utilities
public/               # Static assets (SVG icons, images)
docs/                 # Feature documentation
```

---

## Important Notes

### 1. SSR with styled-components
The project uses `StyledComponentsRegistry` for SSR support. New styled-components will work automatically.

### 2. Canvas Rendering Architecture

**Browser Detection**: `useIsSafari()` hook detects Safari and conditionally renders:

**Chrome/Firefox** → `ImageCanvas.tsx`
- Full 2000x2000 resolution preview
- Immediate rendering (no throttle)
- CSS filter for blur (faster)
- Display size: 320px via CSS

**Safari** → `SafariImageCanvas.tsx`
- Reduced 1000x1000 resolution preview (SCALE_FACTOR = 0.5)
- RAF throttle for smooth slider performance
- JavaScript stackblur (Safari has CSS filter caching issues)
- All effects scaled by 0.5: blur, shadow, padding, copyright text
- Download generates full 2000x2000 resolution canvas

### 3. Copyright Text Color
- Copyright text color **auto-adjusts** based on background color
- White background → Black text
- Black background → White text
- Logic in `src/utils/canvas.ts` `drawCopyrightText()` function

### 4. No Prettier
The project does not use Prettier. Follow ESLint rules only.

### 5. No tests yet
Be careful with refactoring. Consider adding tests for critical utilities.

### 6. Adding new effects
When adding new image effects, update these files:
- `src/atoms/imageAtoms.ts` - Add state atoms and include in `canResetAtom`
- `src/components/panels/` - Create new panel component (e.g., `ShadowPanel.tsx`)
- `src/utils/canvas.ts` - Add rendering logic to `drawImageWithEffects()`
- `src/components/ImageCanvas.tsx` - Pass new effect parameters
- `src/components/SafariImageCanvas.tsx` - Pass scaled parameters with SCALE_FACTOR
- `src/components/DownloadButton.tsx` - Include in download logic
- `src/components/NavigationBar.tsx` - Add panel to navigation
- `src/hooks/useResetState.ts` - Add to DEFAULT_VALUES and reset logic
- `docs/` - Create documentation file for the new feature

### 7. Safari-specific considerations
- Always test performance-heavy features on Safari
- Use SCALE_FACTOR when adding new numeric effects in SafariImageCanvas
- Blur operations are expensive on Safari - consider optimization strategies
- Download functionality must generate full-resolution output even on Safari

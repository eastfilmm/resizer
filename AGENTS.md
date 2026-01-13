# AGENTS.md

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

A Next.js web application for resizing images. Users can upload images, preview them on a 2000x2000px canvas (displayed at 320px), and download the resized PNG with various effects applied.

### Features

- **Background Color**: Toggle between white/black background
- **Canvas Padding**: Adjust padding around the image (0-200px)
- **Glass Blur**: Blur effect using the image's center as background with tint overlay
- **Shadow**: Drop shadow effect on the right and bottom of the image
- **Copyright**: Add copyright text overlay on the image

### Tech Stack

- **Framework**: Next.js 16.x (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **UI**: React 19.x with styled-components 6.x
- **State Management**: Jotai
- **Package Manager**: pnpm

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
├── atoms/            # Jotai atoms for global state
│   └── imageAtoms.ts # All application state (image, effects, settings)
├── components/       # React components
│   ├── styled/       # Shared styled components (Button, Layout)
│   ├── ImageCanvas.tsx         # Main canvas rendering with all effects
│   ├── ImageUploader.tsx       # File upload handling
│   ├── DownloadButton.tsx      # Export and reset after download
│   ├── ResetButton.tsx         # Reset all settings
│   ├── CanvasBackgroundSelector.tsx  # Background color toggle
│   ├── CanvasPaddingSelector.tsx     # Padding slider
│   ├── GlassBlurSelector.tsx         # Glass blur toggle + sliders
│   ├── ShadowSelector.tsx            # Shadow toggle + sliders
│   └── CopyrightSelector.tsx         # Copyright toggle + text input
├── lib/              # Library utilities (SSR registry, etc.)
├── types/            # TypeScript type definitions
└── utils/            # Helper/utility functions
public/               # Static assets (SVG icons, images)
docs/                 # Feature documentation
```

---

## Important Notes

1. **SSR with styled-components**: The project uses `StyledComponentsRegistry` for SSR support. New styled-components will work automatically.

2. **Canvas dimensions**: The canvas is 2000x2000px internally but displayed at 320px. Always maintain this ratio.

3. **No Prettier**: The project does not use Prettier. Follow ESLint rules only.

4. **No tests yet**: Be careful with refactoring. Consider adding tests for critical utilities.

5. **Adding new effects**: When adding new image effects, update these files:
   - `src/atoms/imageAtoms.ts` - Add state atoms and include in `canResetAtom`
   - `src/components/` - Create new selector component (e.g., `ShadowSelector.tsx`)
   - `src/components/ImageCanvas.tsx` - Implement rendering logic
   - `src/components/BottomSection.tsx` - Add selector to UI
   - `src/components/ResetButton.tsx` - Add reset logic
   - `src/components/DownloadButton.tsx` - Add reset logic for post-download
   - `docs/` - Create documentation file for the new feature

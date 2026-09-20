# AGENTS.md

This document provides technical guidelines for AI coding agents working in this repository.

## Project Overview

A Next.js web application for resizing images. Users can upload images, preview them on a canvas, and download the resized PNG with various effects applied.

### Features
- **Aspect Ratio**: Select canvas aspect ratio (1:1, 4:5, 9:16)
- **Frames**: Polaroid, Thin, and Medium Film frames (Mutual Exclusive)
- **Effects**: Padding, Background Color, Glass Blur, and Drop Shadow

---

## Tech Stack & Architecture

- **Framework**: Next.js 16.x (App Router, Turbopack)
- **Language**: TypeScript 5.x (Strict)
- **UI**: React 19.x + styled-components 6.x
- **State**: Jotai (using `imageSettingsAtom` + `focusAtom` from `jotai-optics`)
- **Canvas Engine**: Modular architecture in `packages/canvas/src/`
- **Testing**: Vitest + Husky pre-commit hooks

---

## State Management

Setting state is centralized in `imageSettingsAtom` in `src/atoms/imageAtoms.ts`.
- **Do NOT** create individual atoms for simple UI settings. Include them in the `ImageSettings` interface.
- Use `focusAtom` to derive individual atoms for UI panels to maintain performance (prevent full object re-renders).
- AspectRatio, BackgroundColor, and FrameType are defined as explicit type aliases.

---

## Canvas Engine (`packages/canvas/src/`)

Published as the workspace package `@resizer/canvas` and shared by **both** `apps/web` and
`apps/ait`. It is plain TypeScript: no React, no styled-components, no app state. Environment
decisions (browser sniffing, WebView detection) belong to the app and arrive as arguments —
never add a branch like `isSafari` inside the package.

There is no build step; `exports` points at `src/index.ts`. Next consumes it via
`transpilePackages`, Vite via the workspace link.

The rendering logic is split into focused modules:
- `dimensions.ts`: Aspect ratio and size calculations.
- `frames.ts`: Frame-specific drawing functions (roundRects, film text, etc.).
- `effects.ts`: Glass blur and shadow implementations.
- `drawImage.ts`: Orchestrator (Main Entry Point).
- `types.ts`: Shared canvas-related interfaces.

### Preview Resolution / Safari Optimization
- The preview renders at a reduced resolution in **every** browser: 800px height on mobile,
  1200px on desktop. `getPreviewScaleFactor(isDesktop)` (0.4 / 0.6) converts the 2000px-based
  settings (padding, blur, shadow) into preview space.
- `isSafari` now only selects the blur implementation — not the resolution, not the throttle.
  The app passes it to the renderer as the `useStackBlur` draw option.
- Stackblur is used instead of CSS filters for Safari.
- Setting changes are RAF-throttled in every browser via `useRafThrottle` (one redraw per frame).
- Glass blur reuses module-scoped scratch canvases instead of allocating per frame.
- **Download** always triggers a full-resolution (2000px height) render.

---

## UI Components & Hooks

- **Components**: Follow the arrow function pattern: `const Component = () => { ... }`.
- **Hooks**: Logic that mixes timers, event listeners, or complex transitions is extracted:
  - `usePanelTransition`: Manages panel animation timing.
  - `useClickOutside`: Generic outside-click detection.
  - `useAspectRatio`: Persistent aspect ratio state.

---

## Development Workflow

### Commands
```bash
pnpm install   # Dependencies
pnpm dev       # Dev server
pnpm test      # Run Vitest suite
pnpm build     # Build with Turbopack
```

### Documentation & Resources
- **Claude Code Guide**: `@CLAUDE.md` (루트)
- **Project Structure**: `@docs/project-structure.md`
- **Sub-Agent Workflows**: `@docs/workflow.md`
- **Native Bridge**: `@docs/native-bridge.md`
- **Feature Specs**: `@docs/canvas-padding.md`, `@docs/glass-blur.md`, `@docs/shadow.md`, `@docs/frame.md`
- **Commit Automation**: `@docs/commit-automation.md`

### Quality Assurance
- **Husky**: A pre-commit hook runs tests. **Never** bypass this; if tests fail, fix the code.
- **Adding an Effect**:
  1. Update `ImageSettings` in `imageAtoms.ts`.
  2. Create a `focusAtom`.
  3. Implement drawing logic in `packages/canvas/src/`.
  4. Create a panel in `components/panels/`.
  5. Add to `NavigationBar.tsx` and `types.ts`.
  6. **Crucially**: Add tests in `src/__tests__/utils/`.

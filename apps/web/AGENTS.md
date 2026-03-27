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
- **Canvas Engine**: Modular architecture in `src/utils/canvas/`
- **Testing**: Vitest + Husky pre-commit hooks

---

## State Management

Setting state is centralized in `imageSettingsAtom` in `src/atoms/imageAtoms.ts`.
- **Do NOT** create individual atoms for simple UI settings. Include them in the `ImageSettings` interface.
- Use `focusAtom` to derive individual atoms for UI panels to maintain performance (prevent full object re-renders).
- AspectRatio, BackgroundColor, and FrameType are defined as explicit type aliases.

---

## Canvas Engine (`src/utils/canvas/`)

The rendering logic is split into focused modules:
- `dimensions.ts`: Aspect ratio and size calculations.
- `frames.ts`: Frame-specific drawing functions (roundRects, film text, etc.).
- `effects.ts`: Glass blur and shadow implementations.
- `drawImage.ts`: Orchestrator (Main Entry Point).
- `types.ts`: Shared canvas-related interfaces.

### Safari Optimization
- Safari uses a `SCALE_FACTOR` (0.4) for preview to stay within memory limits.
- Stackblur is used instead of CSS filters for Safari.
- Transitions are throttled using RAF in `ImageCanvas.tsx`.
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
- **Project Structure**: `@docs/project-structure.md`
- **Sub-Agent Workflows**: `@docs/workflow.md`
- **Feature Specs**: `@docs/canvas-padding.md`, `@docs/glass-blur.md`, `@docs/shadow.md`, `@docs/frame.md`
- **Commit Automation**: `@docs/commit-automation.md`

### Quality Assurance
- **Husky**: A pre-commit hook runs tests. **Never** bypass this; if tests fail, fix the code.
- **Adding an Effect**:
  1. Update `ImageSettings` in `imageAtoms.ts`.
  2. Create a `focusAtom`.
  3. Implement drawing logic in `utils/canvas/`.
  4. Create a panel in `components/panels/`.
  5. Add to `NavigationBar.tsx` and `types.ts`.
  6. **Crucially**: Add tests in `src/__tests__/utils/`.

# AGENTS.md

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

A Next.js web application for resizing images. Users can upload images, preview them on a 2000x2000px canvas (displayed at 320px), toggle background color (white/black), and download the resized PNG.

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
├── components/       # React components
│   └── styled/       # Shared styled components
├── lib/              # Library utilities (SSR registry, etc.)
├── types/            # TypeScript type definitions
└── utils/            # Helper/utility functions
public/               # Static assets (SVG icons, images)
```

---

## Code Style Guidelines

### File Naming

- **Components**: PascalCase (`ImageCanvas.tsx`, `ActionButtons.tsx`)
- **Utilities/Helpers**: camelCase (`canvas.ts`)
- **Atoms**: camelCase (`imageAtoms.ts`)
- **Types**: camelCase or PascalCase (`styled-components.d.ts`)

### Import Order

Organize imports in this order, separated by blank lines:

1. `'use client'` directive (if needed)
2. External libraries (`styled-components`, `jotai`)
3. React imports (`react`)
4. Internal imports using `@/` path alias
5. Relative imports (`./ComponentName`)

```typescript
'use client';

import styled from 'styled-components';
import { RefObject, useEffect, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { imageUrlAtom } from '@/atoms/imageAtoms';
import { resetCanvas } from '@/utils/canvas';
import ImageUploader from './ImageUploader';
```

### Naming Conventions

- **Components**: PascalCase (`ImageCanvas`, `ActionButtons`)
- **Functions**: camelCase (`handleDownload`, `drawImageOnCanvas`)
- **Variables**: camelCase (`imageUrl`, `canvasRef`)
- **Atoms**: camelCase + `Atom` suffix (`imageUrlAtom`, `backgroundColorAtom`)
- **Styled Components**: PascalCase (`ButtonGroup`, `CanvasContainer`)
- **Interfaces/Types**: PascalCase + descriptive suffix (`ImageCanvasProps`)
- **Transient Props**: `$` prefix (`$isActive`, `$variant`)

### TypeScript

- Use strict mode (enforced via tsconfig.json)
- Define interfaces for component props
- Use explicit return types for utility functions
- Prefer `type` for simple types, `interface` for component props

### React Patterns

- Use functional components with default exports
- Add `'use client'` directive for client-side components
- Use Jotai hooks for state: `useAtomValue`, `useSetAtom`
- Pass refs via props (not forwardRef pattern)
- Use `useCallback` for functions passed as dependencies

### Styled Components

- Define styled components at the bottom of the file
- Co-locate with their component
- Use transient props (`$` prefix) to prevent DOM forwarding
- Use TypeScript interfaces for prop types

```typescript
interface ButtonProps {
  $variant?: 'secondary';
}

const Button = styled.button<ButtonProps>`
  background-color: ${props => props.$variant === 'secondary' ? '#6c757d' : '#28a745'};
`;
```

### Error Handling

- Use early returns for guard clauses
- Use optional chaining for nullable values
- Check refs before accessing `.current`

```typescript
if (!canvasRef.current) return;
const file = event.target.files?.[0];
```

---

## Path Aliases

Use `@/` for imports from `src/`:

```typescript
import { imageUrlAtom } from '@/atoms/imageAtoms';
```

---

## Git Commit Style

Use conventional commits format:

```
type: description
```

Types: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`

---

## Important Notes

1. **SSR with styled-components**: The project uses `StyledComponentsRegistry` for SSR support. New styled-components will work automatically.

2. **Canvas dimensions**: The canvas is 2000x2000px internally but displayed at 320px. Always maintain this ratio.

3. **No Prettier**: The project does not use Prettier. Follow ESLint rules only.

4. **No tests yet**: Be careful with refactoring. Consider adding tests for critical utilities.

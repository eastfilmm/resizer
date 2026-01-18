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

프로젝트의 최신 디렉토리 구조는 `@docs/PROJECT_STRUCTURE.md` 파일을 참조하세요.

이 파일은 프로젝트 구조가 변경될 때마다 업데이트되며, 항상 최신 상태를 유지합니다.

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
필수 수정 파일: `imageAtoms.ts`, `panels/*.tsx`, `canvas.ts`, `ImageCanvas.tsx`, `SafariImageCanvas.tsx`, `DownloadButton.tsx`, `NavigationBar.tsx`, `useResetState.ts`, `docs/`

### 7. Safari 최적화
Safari 전용: `SafariImageCanvas.tsx`에서 SCALE_FACTOR 사용, stackblur 적용, RAF throttle. 다운로드는 항상 2000x2000 해상도.

---

## 서브 에이전트 (Sub Agents)

각 기능별 상세 문서를 `@`로 참조: `@docs/CanvasPadding.md`, `@docs/GlassBlur.md`, `@docs/Shadow.md`, `@docs/Copyright.md`

새 기능 추가 시 `docs/FeatureName.md` 생성 후 이 섹션에 링크 추가.

---

## 서브 에이전트 워크플로우

4단계 워크플로우는 `@docs/WORKFLOW.md` 참조. 빠른 시작: `"FeatureName" 기능 추가해줘. @docs/WORKFLOW.md 4단계 실행해줘.`

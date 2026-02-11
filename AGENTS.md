# AGENTS.md

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

A Next.js web application for resizing images. Users can upload images, preview them on a canvas, and download the resized PNG with various effects applied.

### Features

- **Aspect Ratio**: Select canvas aspect ratio (1:1, 4:5, 9:16)
- **Polaroid Frame**: Classic polaroid-style frame effect
- **Padding**: Adjust padding around the image (0-200px)
- **Background Color**: Toggle between white/black background
- **Glass Blur**: Blur effect using the image's center as background with tint overlay
- **Shadow**: Drop shadow effect on the right and bottom of the image

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

**Unified Component**: `ImageCanvas.tsx` handles both Safari and non-Safari browsers via `isSafari` prop.

**Browser Detection**: `useIsSafari()` hook detects Safari and passes result as `isSafari` prop to `ImageCanvas`.

**Aspect Ratios**: Supports three aspect ratios (1:1, 4:5, 9:16) controlled by `canvasAspectRatioAtom` and `useAspectRatio()` hook.
- **1:1**: Square canvas (2000x2000 actual, 320x320 display)
- **4:5**: Portrait (1600x2000 actual, 256x320 display)
- **9:16**: Vertical portrait (1125x2000 actual, 180x320 display)
- Aspect ratio state persisted in localStorage (`ASPECT_RATIO_STORAGE_KEY`)
- Canvas dimensions dynamically adjusted based on selected ratio

**Chrome/Firefox** (`isSafari: false`)
- Full resolution preview (2000px height, ratio-dependent width)
- Immediate rendering (no throttle)
- CSS filter for blur (faster)
- Display size varies by aspect ratio (320px height, ratio-dependent width)

**Safari** (`isSafari: true`)
- Reduced resolution preview (800px height, ratio-dependent width, SCALE_FACTOR = 0.4)
- RAF throttle for smooth slider performance
- JavaScript stackblur (Safari has CSS filter caching issues)
- All effects scaled by 0.4: blur, shadow, padding
- Download generates full resolution canvas (2000px height)

**Utils & Constants**: 
- Canvas dimension helpers (`getCanvasDimensions`, `getCanvasDisplaySize`) are in `src/utils/CanvasUtils.ts`
- Canvas constants (sizes, font sizes, storage keys) are in `src/constants/CanvasContents.ts`

### 3. Prettier
The project uses Prettier for code formatting (`.prettierrc` config exists). Follow both ESLint and Prettier rules.

### 4. No tests yet
Be careful with refactoring. Consider adding tests for critical utilities.

### 5. Adding new effects
필수 수정 파일: `imageAtoms.ts`, `panels/*.tsx`, `CanvasUtils.ts`, `ImageCanvas.tsx`, `DownloadButton.tsx`, `NavigationBar.tsx`, `useResetState.ts`, `docs/`

### 6. Safari 최적화
`ImageCanvas.tsx`에서 `isSafari` prop에 따라 조건부 처리:
- Safari: SCALE_FACTOR(0.4) 사용, stackblur 적용, RAF throttle
- 일반 브라우저: 즉시 렌더링, CSS filter blur
- 다운로드는 항상 2000x2000 해상도 (Safari/일반 공통)

---

## 서브 에이전트 (Sub Agents)

각 기능별 상세 문서를 `@`로 참조: `@docs/CanvasPadding.md`, `@docs/GlassBlur.md`, `@docs/Shadow.md`

새 기능 추가 시 `docs/FeatureName.md` 생성 후 이 섹션에 링크 추가.

### 커밋 자동화 (Commit Automation)

코드 변경 작업 완료 후 자동으로 커밋을 생성하는 서브 에이전트입니다. 상세 내용은 `@docs/CommitAutomation.md` 참조.

---

## 서브 에이전트 워크플로우

4단계 워크플로우는 `@docs/WORKFLOW.md` 참조. 빠른 시작: `"FeatureName" 기능 추가해줘. @docs/WORKFLOW.md 4단계 실행해줘.`

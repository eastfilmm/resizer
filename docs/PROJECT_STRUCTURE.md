# 프로젝트 구조 (Project Structure)

이 문서는 프로젝트의 현재 디렉토리 구조를 최신 상태로 유지합니다.

## 전체 구조

```
resizer/
├── .gitignore
├── .vscode/
│   └── settings.json
├── AGENTS.md                  # AI 에이전트 가이드라인
├── docs/                      # 기능별 문서
│   ├── CanvasPadding.md
│   ├── Copyright.md
│   ├── GlassBlur.md
│   ├── PROJECT_STRUCTURE.md   # 프로젝트 구조 문서 (이 파일)
│   ├── Shadow.md
│   └── WORKFLOW.md            # 서브 에이전트 워크플로우
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── public/                    # Static assets (SVG icons, images)
│   ├── background.svg
│   ├── copyright.svg
│   ├── download.svg
│   ├── glassBlur.svg
│   ├── layout.svg
│   ├── padding.svg
│   ├── refresh_icon.svg
│   ├── shadow.svg
│   └── upload.svg
├── README.md
└── src/
    ├── app/                   # Next.js App Router (pages, layouts)
    │   ├── globals.css
    │   ├── layout.tsx         # Root layout with StyledComponentsRegistry
    │   └── page.tsx           # Main page with browser-specific canvas rendering
    ├── atoms/                 # Jotai atoms for global state
    │   └── imageAtoms.ts      # All application state (image, effects, settings)
    ├── components/            # React components
    │   ├── styled/            # Shared styled components
    │   │   ├── Button.tsx     # Reusable button component
    │   │   └── Layout.tsx     # Layout components
    │   ├── panels/            # Effect control panels
    │   │   ├── BackgroundPanel.tsx   # Background color toggle
    │   │   ├── CopyrightPanel.tsx    # Copyright toggle + text input
    │   │   ├── GlassBlurPanel.tsx    # Glass blur toggle + sliders
    │   │   ├── LayoutPanel.tsx       # Canvas padding slider
    │   │   ├── ShadowPanel.tsx       # Shadow toggle + sliders
    │   │   └── shared.tsx            # Shared panel styled components
    │   ├── ActionButtons.tsx         # Upload/Download/Reset button group
    │   ├── DownloadButton.tsx        # Export and reset after download
    │   ├── ImageCanvas.tsx           # Unified canvas (Safari + Chrome/Firefox)
    │   ├── ImageUploader.tsx         # File upload handling
    │   ├── NavigationBar.tsx         # Bottom navigation with effect panels
    │   ├── NavigationBar.styles.tsx  # NavigationBar styled components
    │   └── ResetButton.tsx           # Reset all settings
    ├── constants/             # App constants
    │   └── CanvasContents.ts  # Canvas sizes, aspect ratios, and constants
    ├── hooks/                 # Custom React hooks
    │   ├── useAspectRatio.ts  # Aspect ratio state management hook
    │   ├── useIsSafari.ts     # Safari browser detection
    │   └── useResetState.ts   # Reset state logic with default values
    ├── lib/                   # Library utilities
    │   └── styled-components-registry.tsx  # SSR registry for styled-components
    ├── types/                 # TypeScript type definitions
    │   └── styled-components.d.ts
    └── utils/                 # Helper/utility functions
        └── CanvasUtils.ts     # Canvas rendering utilities and helpers
```

## 주요 디렉토리 설명

### `src/app/`
Next.js 16 App Router 구조. `page.tsx`는 메인 페이지로 Safari 감지 후 적절한 캔버스 컴포넌트를 렌더링합니다.

### `src/atoms/`
Jotai 상태 관리 atom 정의. `imageAtoms.ts`에 모든 애플리케이션 상태가 정의되어 있습니다.

### `src/components/`
React 컴포넌트들:
- **`panels/`**: 각 효과 제어 패널 컴포넌트 (Background, Copyright, GlassBlur, Layout, Shadow)
- **`styled/`**: 재사용 가능한 스타일 컴포넌트 (Button, Layout)
- `ImageCanvas.tsx`: 통합 캔버스 컴포넌트 (Safari와 Chrome/Firefox 모두 처리)
- 업로드, 다운로드, 리셋 등 주요 기능 컴포넌트

### `src/hooks/`
커스텀 React 훅:
- `useIsSafari`: Safari 브라우저 감지
- `useResetState`: 상태 리셋 로직
- `useAspectRatio`: 캔버스 비율 상태 관리 (1:1, 4:5, 9:16)

### `src/utils/`
유틸리티 함수. `CanvasUtils.ts`에 캔버스 렌더링 관련 모든 로직이 포함되어 있습니다.

### `src/constants/`
애플리케이션 상수. `CanvasContents.ts`에 캔버스 크기, 비율별 크기, 폰트 크기, localStorage 키 등이 정의되어 있습니다.

### `src/lib/`
라이브러리 설정. `styled-components-registry.tsx`는 SSR 지원을 위한 레지스트리입니다.

### `src/types/`
TypeScript 타입 정의. styled-components 타입 확장 등이 포함되어 있습니다.

### `public/`
정적 자산 (SVG 아이콘). 각 기능별 아이콘이 저장되어 있습니다.

### `docs/`
기능별 상세 문서. 각 효과의 명세서가 포함되어 있습니다.

## 파일 변경 시 업데이트

프로젝트 구조가 변경될 때는 이 파일을 업데이트해야 합니다:
- 새 디렉토리 추가
- 파일 이름 변경
- 파일 이동
- 주요 컴포넌트 추가/제거

이 파일은 `@AGENTS.md`에서 `@docs/PROJECT_STRUCTURE.md`로 참조되므로, 구조 변경 시 함께 업데이트되어야 합니다.

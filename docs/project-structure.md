# 프로젝트 구조

이 문서는 저장소의 현재 디렉토리 구조를 담습니다. 구조가 바뀌면 함께 고쳐 주세요.

## 한 문장 요약

**앱은 셸이고 로직은 패키지에 있습니다.** `apps/web/src`는 9개, `apps/ait/src`는
3개 파일뿐이며, 화면은 `@resizer/editor`가 조립합니다.

```
apps/*  →  editor  →  ui
                   →  canvas
```

`ui`와 `canvas`는 서로 의존하지 않는 잎 노드입니다.

---

## 모노레포 루트

```
resizer/
├── apps/
│   ├── web/                # Next.js 셸 (picturedrucker.com)
│   ├── ait/                # Vite SPA 셸 (App in Toss 미니앱)
│   └── mobile/             # Expo WebView 래퍼
├── packages/
│   ├── canvas/             # @resizer/canvas — 렌더링 엔진
│   ├── editor/             # @resizer/editor — 에디터 화면
│   └── ui/                 # @resizer/ui — 디자인 시스템
├── docs/                   # 기술 문서 (이 파일 포함)
├── AGENTS.md               # AI 에이전트 기술 가이드
├── CLAUDE.md               # Claude Code 지침
├── README.md
├── eslint.config.mjs       # 워크스페이스 전체를 덮는 단일 flat config
├── package.json            # dev/build/test/typecheck/lint 스크립트
├── pnpm-workspace.yaml     # apps/*, packages/*
├── vercel.json             # Vercel 배포 (web만)
├── .prettierrc             # 80자, 2스페이스, 세미콜론
├── .npmrc                  # node-linker=hoisted
└── .husky/pre-commit       # pnpm lint && pnpm -r test
```

---

## packages/canvas — `@resizer/canvas`

캔버스 렌더링 엔진. **React도 앱 상태도 없는 순수 TypeScript**이며 web과 ait가
함께 씁니다. 빌드 스텝이 없고 `exports`가 `src/index.ts`를 직접 가리킵니다.

```
packages/canvas/
├── package.json            # exports: ".", "./test-setup"
├── vitest.config.ts
├── README.md
└── src/
    ├── index.ts            # 공개 API
    ├── types.ts            # AspectRatio/BackgroundColor/FrameType, DrawImageOptions
    ├── constants.ts        # 2000px 기준 해상도·표시 크기 상수
    ├── dimensions.ts       # 비율/크기/프리뷰 배율 계산
    ├── frames.ts           # 프레임 그리기 (Polaroid, Thin, Medium Film)
    ├── effects.ts          # Glass Blur + ctx.filter 지원 감지
    ├── drawImage.ts        # 오케스트레이터 (진입점)
    ├── test-setup.ts       # jsdom Canvas 2D 목 (editor도 함께 씀)
    └── __tests__/          # 렌더러 테스트 110개
```

도메인 타입(`AspectRatio` 등)의 **원본이 여기 있습니다.** 렌더러의 어휘이기
때문이며, `editor`의 `imageAtoms`가 이를 재노출합니다.

---

## packages/editor — `@resizer/editor`

에디터 화면 전체. 앱은 이 패키지에서 조각을 가져다 배치만 합니다.

```
packages/editor/
├── package.json
├── vitest.config.ts
└── src/
    ├── index.ts            # 공개 API (컴포넌트·훅·atoms·platform)
    ├── platform.tsx        # PlatformProvider — 저장·공유 주입 지점
    ├── atoms/
    │   └── imageAtoms.ts   # imageSettingsAtom + 업로드/선택 상태
    ├── components/
    │   ├── ImageCanvas.tsx         # 캔버스 프리뷰
    │   ├── ImageUploader.tsx       # 파일 선택
    │   ├── DownloadButton.tsx      # 다운로드 (네이티브 주입 + ZIP 폴백)
    │   ├── ShareButton.tsx         # 공유 (네이티브 주입 + Web Share 폴백)
    │   ├── ResetButton.tsx
    │   ├── NavigationBar.tsx       # 하단 네비게이션 (5개 패널)
    │   ├── NavigationBar.styles.tsx
    │   ├── ThumbnailStrip.tsx
    │   ├── panels/                 # LayoutPanel, FramePanel, BackgroundPanel,
    │   │                           # GlassBlurPanel, ShadowPanel
    │   └── thumbnail-strip/        # ThumbnailItem, styles, useThumbnailRender, constants
    ├── hooks/
    │   ├── useAspectRatio.ts       # 비율 상태
    │   ├── useImageUpload.ts       # 업로드 처리
    │   ├── usePanelTransition.ts   # 패널 전환 상태기계
    │   └── useResetState.ts        # 초기화
    ├── utils/
    │   ├── imageSource.ts          # loadEditableImage — 1회 디코드·축소 캐시
    │   ├── imageUtils.ts
    │   └── renderCanvasImage.ts    # 다운로드용 2000px 풀 해상도 렌더
    ├── types/styled-components.d.ts
    └── __tests__/                  # ImageCanvas, imageAtoms, imageSource
```

---

## packages/ui — `@resizer/ui`

앱과 에디터가 함께 쓰는 디자인 시스템. 도메인 지식이 없습니다.

```
packages/ui/
├── package.json
├── vitest.config.ts
├── README.md
└── src/
    ├── index.ts
    ├── theme.ts            # 색상 토큰
    ├── motion.ts           # 전환 시간 토큰 (PANEL_FADE_MS 등)
    ├── globals.css         # 글로벌 스타일 (양쪽 앱이 임포트)
    ├── Button.tsx          # 아이콘 버튼
    ├── Layout.tsx          # Container / Main
    ├── RangeSlider.tsx     # Base UI Slider 기반 공용 슬라이더
    ├── FocusReveal.tsx     # 조작 중 주변 UI를 걷어내는 컴파운드 컴포넌트
    ├── primitives.tsx      # 패널 공통 스타일 조각
    ├── hooks/
    │   ├── useClickOutside.ts
    │   ├── useClickClearedHover.ts
    │   ├── useIsDesktop.ts
    │   └── useRafThrottle.ts
    └── __tests__/          # FocusReveal 14개, RangeSlider 15개
```

---

## apps/web — Next.js 셸

```
apps/web/
├── next.config.ts          # transpilePackages: @resizer/*
├── public/                 # SVG 아이콘, 앱 아이콘
├── scripts/test-seo.js     # SEO 검증 스크립트
└── src/
    ├── app/
    │   ├── layout.tsx      # 루트 레이아웃 (styled-components SSR)
    │   ├── page.tsx        # 서버 컴포넌트 (메타데이터, SEO)
    │   ├── client-page.tsx # 에디터 조립
    │   ├── robots.ts
    │   └── sitemap.ts
    ├── platform.ts         # Platform 구현 (ReactNativeWebView postMessage)
    ├── lib/styled-components-registry.tsx
    ├── types/react-native-webview.d.ts
    └── utils/siteConfig.ts
```

## apps/ait — App in Toss 셸

```
apps/ait/
├── apps-in-toss.config.ts  # appName, webBundleDir
├── vite.config.ts
├── index.html
├── public/                 # SVG 아이콘
└── src/
    ├── main.tsx            # 엔트리
    ├── App.tsx             # 에디터 조립
    ├── platform.ts         # Platform 구현 (saveBase64Data)
    └── globals.css
```

빌드는 `tsc -b && vite build && ait build`로 `.ait` 번들을 만듭니다.

## apps/mobile — Expo WebView 래퍼

```
apps/mobile/
├── App.tsx                 # WebView + 네이티브 브릿지 (MediaLibrary, Sharing)
├── index.ts
├── app.json / eas.json     # Expo / EAS Build 설정
└── assets/                 # 앱 아이콘, 스플래시
```

`picturedrucker.com`을 WebView로 띄우고 `postMessage`를 받아 저장·공유를
처리합니다. 명세는 `@docs/native-bridge.md`.

> 현재 린트 범위 밖입니다 (Expo 프리셋이 필요해 `eslint.config.mjs`에서 제외).

---

## 테스트가 있는 곳

| 위치 | 개수 | 대상 |
|---|---|---|
| `packages/canvas/src/__tests__/` | 110 | 치수·프레임·효과·드로우·리셋 |
| `packages/editor/src/__tests__/` | 31 | ImageCanvas, imageAtoms, imageSource |
| `packages/ui/src/__tests__/` | 29 | FocusReveal, RangeSlider |

앱에는 테스트가 없습니다. jsdom Canvas 2D 목은 `@resizer/canvas/test-setup`이
소유하고 editor가 가져다 씁니다. `pnpm test`가 전체를 실행합니다.

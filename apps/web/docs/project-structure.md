# 프로젝트 구조 (Project Structure)

이 문서는 프로젝트의 현재 디렉토리 구조를 최신 상태로 유지합니다.

## 모노레포 루트

```
resizer/
├── apps/
│   ├── web/                       # Next.js 웹 앱 (주 개발 대상)
│   └── mobile/                    # Expo React Native 앱 (WebView 래퍼)
├── CLAUDE.md                      # Claude Code 지침
├── README.md                      # 프로젝트 메인 안내
├── package.json                   # 모노레포 루트 (dev:web, build:web, test:web)
├── pnpm-workspace.yaml            # 워크스페이스 설정 (apps/*)
├── vercel.json                    # Vercel 배포 설정
├── .prettierrc                    # Prettier (80자, 2스페이스, 세미콜론)
├── .npmrc                         # npm 설정
└── .husky/pre-commit              # 커밋 전 pnpm --filter web test 실행
```

## apps/web (Next.js 웹 앱)

```
apps/web/
├── AGENTS.md                      # AI 에이전트 개발 가이드
├── docs/                          # 기능별 기술 문서
│   ├── project-structure.md       # 프로젝트 구조 (이 파일)
│   ├── workflow.md                # 서브 에이전트 워크플로우
│   ├── native-bridge.md           # 네이티브 브릿지 명세
│   ├── frame.md                   # 프레임 기능 명세
│   ├── canvas-padding.md          # 패딩 기능 명세
│   ├── glass-blur.md              # Glass Blur 기능 명세
│   ├── shadow.md                  # Shadow 기능 명세
│   └── commit-automation.md       # 커밋 자동화 가이드
├── public/                        # 정적 자산 (SVG 아이콘, 앱 아이콘)
├── scripts/
│   └── test-seo.js                # SEO 검증 스크립트
└── src/
    ├── app/                       # Next.js App Router
    │   ├── layout.tsx             # 루트 레이아웃 (styled-components SSR)
    │   ├── page.tsx               # 서버 컴포넌트 (메타데이터, SEO)
    │   ├── client-page.tsx        # 메인 클라이언트 컴포넌트
    │   ├── globals.css            # 글로벌 스타일
    │   ├── robots.ts              # robots.txt 생성
    │   └── sitemap.ts             # sitemap.xml 생성
    ├── atoms/                     # Jotai 상태 관리
    │   └── imageAtoms.ts          # 공통 설정 + 멀티 업로드/선택 상태
    ├── components/                # React 컴포넌트
    │   ├── ImageCanvas.tsx        # 캔버스 프리뷰 (Safari RAF 스로틀링)
    │   ├── ImageUploader.tsx      # 이미지 파일 선택
    │   ├── DownloadButton.tsx     # 다운로드 (WebView 브릿지 + ZIP)
    │   ├── ShareButton.tsx        # 공유 (WebView 브릿지 + Web Share API)
    │   ├── ResetButton.tsx        # 상태 초기화
    │   ├── NavigationBar.tsx      # 하단 네비게이션 (5개 패널)
    │   ├── NavigationBar.styles.tsx
    │   ├── ThumbnailStrip.tsx     # 멀티 이미지 썸네일 프리뷰
    │   ├── panels/                # 개별 설정 패널
    │   │   ├── LayoutPanel.tsx    # 비율 선택 (1:1, 4:5, 9:16)
    │   │   ├── FramePanel.tsx     # 프레임 (None, Polaroid, Thin, Film)
    │   │   ├── BackgroundPanel.tsx # 배경색 (White/Black)
    │   │   ├── GlassBlurPanel.tsx # Glass Blur + 오버레이 불투명도
    │   │   ├── ShadowPanel.tsx    # Drop Shadow (강도, 오프셋)
    │   │   └── shared.tsx         # 공통 패널 스타일
    │   ├── styled/                # 디자인 시스템 컴포넌트
    │   │   ├── Button.tsx         # 아이콘 버튼
    │   │   └── Layout.tsx         # Container/Main 레이아웃
    │   └── thumbnail-strip/       # 썸네일 전용 모듈
    │       ├── ThumbnailItem.tsx
    │       ├── ThumbnailStrip.styles.tsx
    │       ├── useThumbnailRender.ts
    │       └── constants.ts
    ├── hooks/                     # 커스텀 React 훅
    │   ├── useAspectRatio.ts      # 비율 상태 관리
    │   ├── useClickOutside.ts     # 외부 클릭 감지
    │   ├── usePanelTransition.ts  # 패널 애니메이션
    │   ├── useImageUpload.ts      # 이미지 파일 처리
    │   ├── useIsSafari.ts         # 브라우저 감지
    │   └── useResetState.ts       # 상태 초기화
    ├── utils/
    │   ├── canvas/                # 모듈화된 캔버스 렌더링 엔진
    │   │   ├── index.ts           # Public API
    │   │   ├── types.ts           # DrawImageOptions, ImagePosition
    │   │   ├── dimensions.ts      # 비율/크기 계산
    │   │   ├── frames.ts          # 프레임 그리기 (Polaroid, Thin, Film)
    │   │   ├── effects.ts         # Glass Blur + Shadow
    │   │   └── drawImage.ts       # 메인 오케스트레이터
    │   └── siteConfig.ts          # 베이스 URL 생성
    ├── constants/
    │   └── CanvasContents.ts      # 해상도, 고정 크기, 스토리지 키
    ├── types/
    │   └── styled-components.d.ts
    ├── lib/
    │   └── styled-components-registry.tsx  # SSR 설정
    └── __tests__/                 # Vitest 테스트 스위트 (88+ 케이스)
        ├── setup.ts
        └── utils/
            ├── canvas-dimensions.test.ts
            ├── canvas-draw-image.test.ts
            ├── canvas-effects.test.ts
            ├── canvas-frames.test.ts
            ├── canvas-reset.test.ts
            └── image-atoms.test.ts
```

## apps/mobile (Expo React Native 앱)

```
apps/mobile/
├── App.tsx                        # 메인 컴포넌트 (WebView + 네이티브 브릿지)
├── index.ts                       # 엔트리포인트
├── app.json                       # Expo 설정 (권한, 아이콘, 번들 ID)
├── eas.json                       # EAS Build 프로필 (preview/production)
├── package.json                   # 의존성 (expo, react-native-webview 등)
├── tsconfig.json
└── assets/                        # 앱 아이콘 및 스플래시
    ├── icon.png                   # 메인 앱 아이콘 (1024x1024)
    ├── splash-icon.png            # 스플래시 화면
    ├── android-icon-foreground.png
    ├── android-icon-background.png
    ├── android-icon-monochrome.png
    └── favicon.png
```

### 모바일 앱 역할

- picturedrucker.com을 WebView로 로드
- `postMessage` 브릿지로 다운로드(앨범 저장)/공유 기능 제공
- Android 뒤로가기 버튼으로 WebView 내 뒤로가기 지원
- 커스텀 모달 UI로 결과 피드백 (성공/에러)

상세: [네이티브 브릿지 명세](./native-bridge.md)

## 주요 디렉토리 상세 설명

### `src/utils/canvas/` (캔버스 엔진)
과거 단일 파일로 관리되던 캔버스 로직이 5개의 전문 모듈로 분리되었습니다.
- **`drawImage.ts`**: 전체 렌더링 흐름을 제어하는 메인 함수
- **`frames.ts`**: Polaroid, Thin, Film 프레임의 그리기 로직
- **`dimensions.ts`**: 브라우저별 권장 해상도와 비율별 캔버스 크기 계산
- **`effects.ts`**: Glass Blur (StackBlur) + Drop Shadow

### `src/atoms/` (상태 관리)
공통 편집 설정은 `imageSettingsAtom` 중심으로 관리하고, 멀티 업로드를 위한 이미지 목록/선택 상태 atom이 함께 존재합니다. 성능을 위해 `focusAtom`을 사용하여 필요한 부분(패널)만 개별적으로 구독합니다.

### `src/hooks/` (커스텀 훅)
UI 컴포넌트 내부에 복잡하게 얽혀 있던 로직이 분리되어 가독성과 재사용성을 높였습니다.

### `src/__tests__/` (테스트)
캔버스 렌더링 파이프라인의 모든 주요 조건과 분기를 테스트하는 88개 이상의 테스트 케이스가 포함되어 있습니다.

## 문서 관리 규정

프로젝트 구조가 변경(파일 추가/삭제/이동)될 때는 반드시 이 파일을 최신화해야 합니다.

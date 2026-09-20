# CLAUDE.md

이 파일은 Claude Code가 프로젝트 작업 시 참조하는 지침입니다.

## 프로젝트 개요

**Picture Drucker** — 이미지를 업로드하고 다양한 효과(프레임, 블러, 그림자 등)를 적용하여 리사이즈/다운로드할 수 있는 서비스입니다.

## 모노레포 구조

pnpm 워크스페이스 기반 모노레포입니다.

**앱은 셸이고 로직은 패키지에 있습니다.** `apps/web/src`는 9개, `apps/ait/src`는
3개 파일뿐이며 화면은 `@resizer/editor`가 조립합니다.

```
resizer/
├── apps/
│   ├── web/       # Next.js 셸 (App Router, SEO, SSR 레지스트리)
│   ├── ait/       # Vite SPA 셸 — App in Toss 미니앱
│   └── mobile/    # Expo React Native 앱 (WebView 래퍼)
├── packages/
│   ├── canvas/    # @resizer/canvas — 캔버스 렌더링 엔진 (순수 TS, React 없음)
│   ├── editor/    # @resizer/editor — 에디터 화면 전체 (atoms·패널·캔버스·버튼)
│   └── ui/        # @resizer/ui — 디자인 시스템 (Button/RangeSlider/theme/motion/훅)
├── eslint.config.mjs   # 워크스페이스 전체를 덮는 단일 flat config
├── package.json        # 모노레포 루트
├── pnpm-workspace.yaml
└── vercel.json         # Vercel 배포 설정
```

의존 방향은 한 방향입니다.

```
apps/*  →  editor  →  ui
                   →  canvas
```

`ui`와 `canvas`는 서로 의존하지 않는 잎 노드입니다. 역방향 참조(패키지가 앱을,
또는 `ui`/`canvas`가 `editor`를 참조)를 만들지 마세요.

## 명령어

```bash
pnpm dev:web      # 웹 개발 서버
pnpm build:web    # 웹 빌드
pnpm dev:ait      # App in Toss 개발 서버
pnpm build:ait    # App in Toss 빌드 (.ait 번들)
pnpm test         # 전체 워크스페이스 테스트 (pre-commit에서 실행)
pnpm typecheck    # 전체 워크스페이스 타입체크
pnpm lint         # 전체 워크스페이스 ESLint (pre-commit에서 실행)
```

테스트는 패키지에 있습니다 — `packages/canvas`(렌더러), `packages/editor`(컴포넌트·atom).
앱에는 테스트가 없으므로 앱 단위로 테스트를 돌리는 명령은 없습니다.

모바일:
```bash
cd apps/mobile
pnpm start        # Expo 개발 서버
```

## 핵심 아키텍처

- **프레임워크**: web은 Next.js 16 (App Router, Turbopack), ait는 Vite SPA
- **상태관리**: Jotai — `imageSettingsAtom` 중심, `focusAtom`으로 개별 구독 (`@resizer/editor`)
- **스타일링**: styled-components + `@resizer/ui`의 theme/motion 토큰
- **캔버스 엔진**: `@resizer/canvas` — dimensions/frames/effects/drawImage
- **플랫폼 주입**: 저장·공유처럼 환경마다 다른 동작은 `PlatformProvider`로 앱이 주입
  (web은 `ReactNativeWebView.postMessage`, ait는 App in Toss SDK)
- **테스트**: Vitest + Husky pre-commit hook (lint + test)

## 코드 규칙

- 컴포넌트는 화살표 함수: `const Component = () => { ... }`
- 새 설정은 `ImageSettings` 인터페이스에 추가하고 `focusAtom`으로 파생
- 개별 atom을 따로 만들지 말 것
- 패키지 수정 시 해당 `src/index.ts` export 업데이트 필수
- 패키지에 환경 분기(브라우저 이름 판정, 웹뷰 감지)를 넣지 말 것 — 능력을 직접 감지하거나
  앱이 판단해 주입한다
- 패키지를 고치면 web과 ait **양쪽**에 반영된다는 점을 전제로 변경할 것
- 앱에 UI 로직을 새로 쌓지 말 것 — 공용이면 `@resizer/ui`, 에디터 기능이면 `@resizer/editor`
- 복잡한 로직은 `hooks/`로 분리

## 렌더링 성능

- 프리뷰는 **모든 브라우저**에서 축소 해상도로 렌더 (모바일 800px / 데스크톱 1200px)
  - `getPreviewScaleFactor(isDesktop)` → 모바일 0.4, 데스크톱 0.6
- 블러는 네이티브 `ctx.filter`를 쓰고, `supportsCanvasFilter()`로 능력을 감지한다
  (결과 1회 캐시). 미지원 환경에서만 StackBlur(순수 JS)로 폴백한다.
  브라우저 이름으로 분기하지 말 것 — 그 방식이 ait에서 느린 경로를 강제한 적이 있다
- 업로드 이미지는 한 번만 디코드·축소해 공유 (`loadEditableImage`)
- 설정 변경은 `useRafThrottle`로 프레임당 1회만 다시 그림 (전 브라우저 공통)
- Glass Blur의 임시 캔버스는 모듈 스코프에서 재사용 (프레임당 재할당 없음)
- 다운로드는 항상 2000px 풀 해상도 렌더링

## 네이티브 브릿지 (Web ↔ Mobile)

웹에서 `window.ReactNativeWebView` 존재 여부로 WebView 환경을 감지합니다.
- **다운로드**: `postMessage({ type: 'download', data: base64[] })` → 네이티브에서 MediaLibrary 저장
- **공유**: `postMessage({ type: 'share', data: base64 })` → 네이티브에서 OS 공유 시트 호출

## 배포

- **Web**: Vercel (picturedrucker.com) — main 브랜치 푸시 시 자동 배포
- **Mobile**: EAS Build (Expo) — `com.picturedrucker.app`

## 상세 문서

- `apps/web/AGENTS.md` — AI 에이전트 개발 가이드
- `apps/web/docs/project-structure.md` — 디렉토리 구조 상세
- `apps/web/docs/workflow.md` — 4단계 서브에이전트 워크플로우
- `apps/web/docs/native-bridge.md` — 네이티브 브릿지 명세
- `apps/web/docs/frame.md`, `canvas-padding.md`, `glass-blur.md`, `shadow.md` — 기능별 명세

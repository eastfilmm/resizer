# CLAUDE.md

이 파일은 Claude Code가 프로젝트 작업 시 참조하는 지침입니다.

## 프로젝트 개요

**Picture Drucker** — 이미지를 업로드하고 다양한 효과(프레임, 블러, 그림자 등)를 적용하여 리사이즈/다운로드할 수 있는 서비스입니다.

## 모노레포 구조

pnpm 워크스페이스 기반 모노레포입니다.

```
resizer/
├── apps/
│   ├── web/       # Next.js 웹 앱 (주 개발 대상)
│   ├── ait/       # Vite SPA — App in Toss 미니앱
│   └── mobile/    # Expo React Native 앱 (WebView 래퍼)
├── packages/
│   └── canvas/    # @resizer/canvas — web·ait 공용 캔버스 렌더링 엔진
├── package.json   # 모노레포 루트
├── pnpm-workspace.yaml
└── vercel.json    # Vercel 배포 설정
```

## 명령어

```bash
pnpm dev:web      # 웹 개발 서버
pnpm build:web    # 웹 빌드
pnpm dev:ait      # App in Toss 개발 서버
pnpm build:ait    # App in Toss 빌드 (.ait 번들)
pnpm test         # 전체 워크스페이스 테스트 (pre-commit에서 실행)
pnpm test:web     # 웹 앱 테스트만
```

모바일:
```bash
cd apps/mobile
pnpm start        # Expo 개발 서버
```

## 핵심 아키텍처 (apps/web)

- **프레임워크**: Next.js 16 (App Router, Turbopack)
- **상태관리**: Jotai — `imageSettingsAtom` 중심, `focusAtom`으로 개별 구독
- **스타일링**: styled-components
- **캔버스 엔진**: `@resizer/canvas` (`packages/canvas/`) — web·ait 공용, dimensions/frames/effects/drawImage
- **테스트**: Vitest + Husky pre-commit hook

## 코드 규칙

- 컴포넌트는 화살표 함수: `const Component = () => { ... }`
- 새 설정은 `ImageSettings` 인터페이스에 추가하고 `focusAtom`으로 파생
- 개별 atom을 따로 만들지 말 것
- 캔버스 로직 수정 시 `packages/canvas/src/index.ts` export 업데이트 필수
- `@resizer/canvas`에 환경 분기(브라우저 판정, 웹뷰 감지)를 넣지 말 것 — 앱이 판단해 인자로 넘긴다
- 캔버스를 고치면 web과 ait **양쪽**에 반영된다는 점을 전제로 변경할 것
- 복잡한 로직은 `src/hooks/`로 분리

## Safari 최적화

- 프리뷰는 **모든 브라우저**에서 축소 해상도로 렌더 (모바일 800px / 데스크톱 1200px)
  - `getPreviewScaleFactor(isDesktop)` → 모바일 0.4, 데스크톱 0.6
  - `isSafari`는 이제 블러 구현 선택에만 사용 — 렌더러에는 `useStackBlur` 옵션으로 전달
- StackBlur 사용 (CSS 필터 대신)
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

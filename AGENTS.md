# AGENTS.md

이 저장소에서 작업하는 AI 코딩 에이전트를 위한 기술 가이드입니다.

## 프로젝트 개요

**Picture Drucker** — 이미지를 올려 캔버스에서 미리 보고, 프레임·블러·그림자 등을
적용해 PNG로 내려받는 서비스입니다.

- **비율**: 1:1, 4:5, 9:16
- **프레임**: Polaroid, Thin, Medium Film (상호 배타)
- **효과**: 패딩, 배경색, Glass Blur, Drop Shadow

---

## 가장 먼저 알아야 할 것: 앱은 셸이다

로직은 앱이 아니라 패키지에 있습니다. `apps/web/src`는 9개, `apps/ait/src`는 3개
파일뿐이고 화면은 `@resizer/editor`가 조립합니다. **앱에서 기능을 찾지 마세요.**

```
apps/*  →  editor  →  ui
                   →  canvas
```

| 위치 | 패키지 | 무엇이 있나 |
|---|---|---|
| `packages/canvas` | `@resizer/canvas` | 캔버스 렌더링 엔진. React 없는 순수 TS |
| `packages/editor` | `@resizer/editor` | 에디터 화면 전체 — atoms, 패널, ImageCanvas, 버튼 |
| `packages/ui` | `@resizer/ui` | 디자인 시스템 — Button, RangeSlider, FocusReveal, theme, motion, 훅 |
| `apps/web` | — | Next.js 셸 (App Router, SEO, SSR 레지스트리, 플랫폼 구현) |
| `apps/ait` | — | Vite SPA 셸 (App in Toss 미니앱, 플랫폼 구현) |
| `apps/mobile` | — | Expo WebView 래퍼 |

`ui`와 `canvas`는 서로 의존하지 않는 잎 노드입니다. 역방향 참조(패키지가 앱을,
또는 `ui`/`canvas`가 `editor`를 참조)를 만들지 마세요.

패키지에는 빌드 스텝이 없습니다. `exports`가 `src/index.ts`를 직접 가리키고,
Next는 `transpilePackages`로 Vite는 워크스페이스 링크로 소비합니다.

---

## 기술 스택

- **프레임워크**: web은 Next.js 16 (App Router, Turbopack), ait는 Vite SPA
- **언어**: TypeScript 5.x (strict)
- **UI**: React 19.x + styled-components 6.x, Base UI
- **상태**: Jotai — `imageSettingsAtom` + `jotai-optics`의 `focusAtom`
- **테스트/린트**: Vitest, ESLint(루트 flat config), tsc, Husky pre-commit

---

## 상태 관리 (`packages/editor/src/atoms/imageAtoms.ts`)

설정 상태는 `imageSettingsAtom` 하나에 모읍니다.

- 단순 UI 설정을 위해 **개별 atom을 만들지 마세요.** `ImageSettings`에 넣습니다.
- 패널은 `focusAtom`으로 파생해 구독합니다(객체 전체 리렌더 방지).
- `AspectRatio`, `BackgroundColor`, `FrameType`의 원본 정의는 `@resizer/canvas`에
  있고 `imageAtoms`가 재노출합니다. 렌더러의 어휘이기 때문입니다.

---

## 캔버스 엔진 (`packages/canvas/src/`)

web과 ait가 **함께 쓰는** 순수 TypeScript입니다. React도, styled-components도,
앱 상태도 없습니다.

- `dimensions.ts` — 비율/크기/프리뷰 배율 계산
- `frames.ts` — 프레임별 그리기 (roundRect, 필름 텍스트 등)
- `effects.ts` — Glass Blur
- `drawImage.ts` — 오케스트레이터 (진입점)
- `types.ts` — 도메인 타입과 `DrawImageOptions`
- `constants.ts` — 2000px 기준 치수 상수

**환경 분기를 패키지에 넣지 마세요.** 브라우저 이름으로 추측하는 대신 능력을 직접
감지하거나(`supportsCanvasFilter()`), 앱이 판단해 주입합니다. 과거 `isSafari`
플래그가 ait에서 느린 경로를 강제한 전례가 있습니다.

### 렌더링 성능

- 프리뷰는 **모든 브라우저**에서 축소 해상도로 렌더합니다 (모바일 800px /
  데스크톱 1200px). `getPreviewScaleFactor(isDesktop)`(0.4 / 0.6)이 2000px 기준
  설정값(패딩·블러·그림자)을 프리뷰 공간으로 환산합니다.
- 블러는 네이티브 `ctx.filter`를 쓰고, 미지원 환경에서만 StackBlur(순수 JS)로
  폴백합니다. 감지 결과는 1회 캐시됩니다.
- 업로드 이미지는 한 번만 디코드·축소해 공유합니다 (`loadEditableImage`).
- 설정 변경은 `useRafThrottle`로 프레임당 1회만 다시 그립니다.
- Glass Blur의 임시 캔버스는 모듈 스코프에서 재사용합니다.
- **다운로드는 항상 2000px 풀 해상도로 별도 렌더합니다.**

---

## 플랫폼 주입 (`packages/editor/src/platform.tsx`)

저장·공유는 실행 환경마다 방식이 다릅니다. 버튼의 UI와 흐름은 공통이므로, 다른
부분만 앱이 구현해 `PlatformProvider`로 넣습니다.

| 앱 | 구현 |
|---|---|
| `apps/web` | `window.ReactNativeWebView.postMessage` (모바일 래퍼 안일 때) |
| `apps/ait` | App in Toss SDK의 `saveBase64Data` |
| 일반 브라우저 | 기본값 `browserOnly` — 네이티브 없음, 각 버튼이 폴백을 탄다 |

명세: `@docs/native-bridge.md`

---

## 컴포넌트와 훅

- 컴포넌트는 화살표 함수: `const Component = () => { ... }`
- 타이머·이벤트 리스너·복잡한 전환이 섞인 로직은 훅으로 분리합니다.
  - `usePanelTransition` — 패널 전환 타이밍 (페이드아웃 → 높이 → 페이드인)
  - `useClickOutside` — 외부 클릭 감지
  - `useAspectRatio` — 비율 상태
- **effect 안에서 setState를 부르지 마세요.** prop 변화에 따른 상태 조정은 렌더
  중에 직접 합니다(`usePanelTransition`, `FocusReveal.Root` 참고). 린트의
  `react-hooks/set-state-in-effect`가 이를 강제합니다.
- 앱에 UI 로직을 새로 쌓지 마세요. 공용이면 `@resizer/ui`, 에디터 기능이면
  `@resizer/editor`입니다.

---

## 개발 워크플로우

### 명령어 (모두 루트에서)

```bash
pnpm install      # 의존성
pnpm dev:web      # 웹 개발 서버
pnpm dev:ait      # App in Toss 개발 서버
pnpm build:web    # 웹 빌드
pnpm build:ait    # .ait 번들 빌드
pnpm test         # 전체 워크스페이스 테스트
pnpm typecheck    # 전체 워크스페이스 타입체크
pnpm lint         # 전체 워크스페이스 ESLint
```

테스트는 패키지에 있습니다 — `packages/canvas`(렌더러), `packages/editor`,
`packages/ui`. 앱에는 테스트가 없습니다.

### 품질 기준

- **pre-commit이 `pnpm lint`, `pnpm typecheck`, `pnpm test`를 돌립니다.** 우회하지
  마세요. 실패하면 코드를 고칩니다. 타입 오류가 린트·테스트를 통과해 넘어간 전례가
  있어 셋을 모두 돌립니다.
- 린트 설정은 루트 `eslint.config.mjs` 하나입니다. `apps/web`만 Next 프리셋을
  받고 나머지는 TypeScript + React Hooks 규칙을 받습니다. 패키지별로 설정을
  따로 만들면 범위가 다시 갈라집니다.
- 테스트를 추가할 때는 **무력화해 보고 실패하는지 확인하세요.** 통과만 하는
  테스트는 회귀를 막지 못합니다.

### 효과를 하나 추가하려면

1. `packages/editor/src/atoms/imageAtoms.ts`의 `ImageSettings`에 필드 추가
2. `focusAtom`으로 파생
3. `packages/canvas/src/`에 그리기 로직 구현 후 `index.ts`에 export
4. `packages/editor/src/components/panels/`에 패널 생성
5. `NavigationBar.tsx`와 `NavPanelType`에 연결
6. **반드시** `packages/canvas/src/__tests__/`에 테스트 추가

---

## 문서

- **Claude Code 지침**: `@CLAUDE.md`
- **디렉토리 구조**: `@docs/project-structure.md`
- **서브에이전트 워크플로우**: `@docs/workflow.md`
- **네이티브 브릿지**: `@docs/native-bridge.md`
- **기능 명세**: `@docs/frame.md`, `@docs/canvas-padding.md`, `@docs/glass-blur.md`, `@docs/shadow.md`
- **커밋 자동화**: `@docs/commit-automation.md`

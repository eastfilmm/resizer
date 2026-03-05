# 프로젝트 구조 (Project Structure)

이 문서는 프로젝트의 현재 디렉토리 구조를 최신 상태로 유지합니다.

## 전체 구조

```
resizer/
├── .vscode/                   # VSCode 설정
├── .agents/                   # 에이전트 워크플로우 (있을 경우)
├── docs/                      # 기능별 기술 문서
│   ├── canvas-padding.md      # 패딩 기능 명세
│   ├── commit-automation.md   # 커밋 자동화 가이드
│   ├── frame.md               # 프레임 기능 명세 (Polaroid, Thin, Film)
│   ├── glass-blur.md          # Glass Blur 기능 명세
│   ├── project-structure.md   # 프로젝트 구조 문서 (이 파일)
│   ├── shadow.md              # Shadow 기능 명세
│   └── workflow.md            # 서브 에이전트 워크플로우 가이드
├── public/                    # 정적 자산 (SVG 아이콘, 로고)
├── src/
│   ├── app/                   # Next.js App Router (Layout, Page, Robots, Sitemap)
│   ├── atoms/                 # Jotai 상태 관리
│   │   └── imageAtoms.ts      # 중앙 집중식 imageSettingsAtom 및 focusAtom들
│   ├── components/            # React 컴포넌트
│   │   ├── panels/            # 개별 설정 패널 (Layout, Frame, Background, Blur, Shadow)
│   │   │   ├── BackgroundPanel.tsx
│   │   │   ├── FramePanel.tsx
│   │   │   ├── GlassBlurPanel.tsx
│   │   │   ├── LayoutPanel.tsx
│   │   │   ├── ShadowPanel.tsx
│   │   │   └── shared.tsx      # 공통 패너 스타일 및 컴포넌트
│   │   ├── styled/            # 공통 스타일 컴포넌트 (버튼, 레이아웃)
│   │   ├── ActionButtons.tsx  # Upload/Download/Reset 버튼 그룹
│   │   ├── DownloadButton.tsx # 이미지 익스포트 및 다운로드
│   │   ├── ImageCanvas.tsx    # 핵심 Canvas 프리뷰 컴포넌트
│   │   ├── ImageUploader.tsx  # 이미지 파일 선택 처리
│   │   ├── NavigationBar.tsx  # 하단 네비게이션 및 패널 관리
│   │   └── ...
│   ├── hooks/                 # 커스텀 React 훅
│   │   ├── useAspectRatio.ts    # 비율 상태 및 영속성 관리
│   │   ├── useClickOutside.ts   # 외부 클릭 감지
│   │   ├── usePanelTransition.ts # 패널 애니메이션 상태 관리
│   │   ├── useIsSafari.ts       # 브라우저 감지
│   │   └── useResetState.ts     # 상태 초기화 로직
│   ├── utils/canvas/          # 모듈화된 캔버스 렌더링 시스템
│   │   ├── dimensions.ts      # 크기 및 비율 계산
│   │   ├── effects.ts         # Blur, Shadow 필터 효과
│   │   ├── frames.ts          # 프레임 그리드 및 데코레이션
│   │   ├── drawImage.ts       # 메인 렌더링 오케스트레이터
│   │   ├── types.ts           # 캔버스 관련 공통 타입
│   │   └── index.ts           # Public API
│   ├── constants/             # 앱 전역 상수
│   │   └── CanvasContents.ts  # 해상도, 고정 크기, 스토리지 키
│   ├── types/                 # 전역 타입 정의
│   └── __tests__/             # Vitest 테스트 스위트
├── README.md                  # 프로젝트 메인 안내
├── AGENTS.md                  # AI 에이전트 개발 가이드
└── ...
```

## 주요 디렉토리 상세 설명

### `src/utils/canvas/` (Refactored)
과거 단일 파일(`CanvasUtils.ts`)로 관리되던 캔버스 로직이 5개의 전문 모듈로 분리되었습니다. 
- **`drawImage.ts`**: 전체 렌더링 흐름을 제어하는 메인 함수가 있습니다.
- **`frames.ts`**: Polaroid, Thin, Film 프레임의 복잡한 그리기 로직이 캡슐화되어 있습니다.
- **`dimensions.ts`**: 브라우저별(Safari 등) 권장 해상도와 비율별 캔버스 크기를 계산합니다.

### `src/atoms/` (Optimized)
개별적인 15개 Atom 대신, `imageSettingsAtom`이라는 하나의 거대한 상태 객체를 중심으로 관리합니다. 성능을 위해 `focusAtom`을 사용하여 필요한 부분(패널)만 개별적으로 구독하도록 구현되어 있습니다.

### `src/hooks/` (Decoupled)
UI 컴포넌트(`NavigationBar` 등) 내부에 복잡하게 얽혀 있던 애니메이션 타이머와 이벤트 리스너 로직이 `usePanelTransition`, `useClickOutside` 등으로 분리되어 코드 가독성과 재사용성을 높였습니다.

### `src/__tests__/` (Quality Assurance)
캔버스 렌더링 파이프라인의 모든 주요 조건과 분기를 테스트하는 88개 이상의 테스트 케이스가 포함되어 있으며, Vitest를 통해 실행됩니다.

## 문서 관리 규정

프로젝트 구조가 변경(파일 추가/삭제/이동)될 때는 반드시 이 파일을 최신화해야 합니다. 이는 `@AGENTS.md`에서 각 에이전트가 기능을 탐색하는 지도로 사용됩니다.

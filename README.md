# Picture Drucker

이미지를 업로드하고, 다양한 효과를 적용하여 리사이즈/다운로드할 수 있는 서비스입니다.

## 모노레포 구조

pnpm 워크스페이스 기반 모노레포입니다.

| 앱 | 경로 | 기술 스택 | 설명 |
|----|------|-----------|------|
| **Web** | `apps/web` | Next.js 16, React 19, Jotai, styled-components | 핵심 웹 앱 |
| **Mobile** | `apps/mobile` | Expo 55, React Native 0.83, WebView | 네이티브 래퍼 앱 |

## 주요 기능

- **이미지 업로드**: 최대 5장 동시 업로드 및 편집
- **비율 선택**: 1:1, 4:5, 9:16
- **프레임**: Polaroid, Thin, Medium Film (상호 배타)
- **효과**: 패딩, 배경색, Glass Blur, Drop Shadow
- **다운로드**: PNG 고품질 (단일/ZIP), 네이티브 앨범 저장
- **공유**: Web Share API / 네이티브 공유 시트

## 시작하기

### 사전 요구사항

- Node.js 18+
- pnpm 9+

### 설치 및 실행

```bash
pnpm install
```

**웹 개발 서버**:
```bash
pnpm dev:web
```
[http://localhost:3000](http://localhost:3000)에서 확인

**모바일 개발 서버**:
```bash
cd apps/mobile
pnpm start
```

### 빌드 및 테스트

```bash
pnpm build:web    # 웹 빌드
pnpm test:web     # Vitest 테스트 실행
```

## 배포

- **Web**: [picturedrucker.com](https://picturedrucker.com) — Vercel 자동 배포 (main 브랜치)
- **Mobile**: EAS Build (Expo) — `com.picturedrucker.app`

## 프로젝트 구조

```
resizer/
├── apps/
│   ├── web/                    # Next.js 웹 앱
│   │   ├── src/
│   │   │   ├── app/            # App Router (layout, page, SEO)
│   │   │   ├── atoms/          # Jotai 상태관리 (imageSettingsAtom)
│   │   │   ├── components/     # React 컴포넌트
│   │   │   │   ├── panels/     # 설정 패널 (Layout, Frame, Background, Blur, Shadow)
│   │   │   │   ├── styled/     # 디자인 시스템 컴포넌트
│   │   │   │   └── thumbnail-strip/  # 멀티 이미지 썸네일
│   │   │   ├── hooks/          # 커스텀 훅
│   │   │   ├── utils/canvas/   # 모듈화된 캔버스 렌더링 엔진
│   │   │   ├── constants/      # 앱 상수
│   │   │   └── __tests__/      # Vitest 테스트 (88+ 케이스)
│   │   └── docs/               # 기능별 명세서
│   └── mobile/                 # Expo React Native 앱
│       └── App.tsx             # WebView + 네이티브 브릿지
├── CLAUDE.md                   # Claude Code 지침
├── vercel.json                 # Vercel 배포 설정
└── pnpm-workspace.yaml         # 워크스페이스 설정
```

## 문서

| 문서 | 내용 |
|------|------|
| [CLAUDE.md](./CLAUDE.md) | Claude Code 개발 지침 |
| [AGENTS.md](./apps/web/AGENTS.md) | AI 에이전트 기술 가이드 |
| [프로젝트 구조](./apps/web/docs/project-structure.md) | 디렉토리 구조 상세 |
| [워크플로우](./apps/web/docs/workflow.md) | 4단계 서브에이전트 워크플로우 |
| [네이티브 브릿지](./apps/web/docs/native-bridge.md) | Web ↔ Mobile 브릿지 명세 |
| [Frame](./apps/web/docs/frame.md) | 프레임 기능 명세 |
| [Canvas Padding](./apps/web/docs/canvas-padding.md) | 패딩 기능 명세 |
| [Glass Blur](./apps/web/docs/glass-blur.md) | Glass Blur 기능 명세 |
| [Shadow](./apps/web/docs/shadow.md) | Shadow 기능 명세 |

## 라이선스

Private

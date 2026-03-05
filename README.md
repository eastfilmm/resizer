# Image Resizer

이미지를 업로드하고 리사이즈하여 다운로드할 수 있는 웹 애플리케이션입니다.

## 버전

**v0.1.0**

## 주요 기능

- **이미지 업로드**: 파일 선택을 통한 이미지 업로드
- **이미지 미리보기**: 2000x2000px 캔버스에 이미지를 표시 (화면에는 320px로 축소 표시)
- **고품질 다운로드**: PNG 형식으로 고품질 이미지 다운로드
- **리셋 기능**: 이미지 제거 및 캔버스 초기화

## 기술 스택

- **Next.js** 16.1.1 (App Router)
- **React** 19.1.0
- **TypeScript**
- **Jotai** (+ jotai-optics) - 상태 관리
- **Styled Components** - 스타일링
- **Vitest** - 단위 테스트

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### 테스트 실행

```bash
pnpm test
```

### 빌드

```bash
pnpm build
```

### 프로덕션 실행

```bash
pnpm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 사용 방법

1. "Select Image" 버튼을 클릭하여 이미지 파일을 선택합니다
2. 하단 네비게이션 메뉴를 통해 비율(1:1, 4:5, 9:16), 프레임(Polaroid, Thin, Film), 블러, 그림자 등을 조절합니다.
3. "Download" 버튼을 클릭하여 리사이즈된 이미지를 다운로드합니다
4. "Reset" 버튼을 클릭하여 모든 설정을 초기화하고 새로 시작할 수 있습니다

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router 페이지
├── atoms/            # Jotai 상태 관리 (imageSettingsAtom)
├── components/       # React 컴포넌트
│   ├── panels/       # 개별 설정 패널 UI
│   ├── styled/       # 공통 스타일 컴포넌트 디자인 시스템
│   └── ...
├── hooks/            # 커스텀 훅 (PanelTransition, ClickOutside 등)
├── utils/canvas/     # 모듈화된 캔버스 렌더링 엔진
└── __tests__/        # Vitest 테스트 스위트
```

## 라이선스

Private

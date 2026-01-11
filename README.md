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
- **Jotai** - 상태 관리
- **Styled Components** - 스타일링

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
pnpm build
```

### 프로덕션 실행

```bash
pnpm start
```

## 사용 방법

1. "Select Image" 버튼을 클릭하여 이미지 파일을 선택합니다
2. 선택한 이미지가 캔버스에 표시됩니다
3. "Download" 버튼을 클릭하여 리사이즈된 이미지를 다운로드합니다
4. "Reset" 버튼을 클릭하여 이미지를 제거하고 새로 시작할 수 있습니다

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router 페이지
├── components/       # React 컴포넌트
│   ├── ActionButtons.tsx    # 다운로드/리셋 버튼
│   ├── BottomSection.tsx    # 하단 설정 섹션 (패딩, 배경색, 블러)
│   ├── ImageCanvas.tsx      # 이미지 미리보기 캔버스
│   ├── ImageUploader.tsx    # 이미지 업로드 컴포넌트
│   └── styled/              # 스타일 컴포넌트
├── atoms/            # Jotai 상태 관리
├── lib/              # 유틸리티 및 설정
└── utils/            # 헬퍼 함수
```

## 라이선스

Private

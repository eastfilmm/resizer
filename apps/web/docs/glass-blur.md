# Glass Blur 기능 명세서

## 개요
이미지의 중앙 영역을 샘플링하고 블러 처리를 적용하여 캔버스의 배경으로 사용하는 시각 효과입니다.

## 기능 스펙

### 1. 주요 파라미터
- **Enabled**: 효과 활성화 여부 (Toggle).
- **Blur Intensity**: 블러의 강도 (1% - 100%, 기본값 30%).
- **Overlay Opacity**: 배경색(Tint)이 블러 배경 위에 씌워지는 불투명도 (0% - 100%, 기본값 30%).

### 2. 동작 방식
- 원본 이미지의 정중앙 정사각형 영역을 추출하여 캔버스 전체 크기로 확대 렌더링합니다.
- 확대된 배경 이미지에 StackBlur 알고리즘을 적용합니다.
- 설정된 `BackgroundColor` (White/Black)와 `Overlay Opacity`에 따라 배경색 오버레이가 투명하게 겹쳐집니다.
- 그 위에 원본 이미지가 설정된 비율과 패딩에 맞춰 렌더링됩니다.

## 기술 구현 상세

### 상태 관리 (Jotai)
- `glassBlurAtom`, `blurIntensityAtom`, `overlayOpacityAtom`이 각각 `imageSettingsAtom`의 하위 속성을 관리합니다.

### 렌더링 로직
- `src/utils/canvas/effects.ts` 내의 `drawGlassBlurBackground()` 함수에서 구현됩니다.
- **Edge Clamp**: 블러 적용 시 가장자리가 어두워지는 비네팅을 방지하기 위해 픽셀 복제 기법을 사용하여 여유 공간을 확보한 뒤 블러를 처리합니다.
- **Safari 최적화**: Safari 브라우저에서는 성능을 위해 `SCALE_FACTOR` (0.4)가 적용된 상태로 렌더링되며, CSS filter 대신 JS 연산 기반 블러를 사용합니다.

## 관련 파일 목록

- `src/atoms/imageAtoms.ts`: 관련 3종 Atom 정의.
- `src/utils/canvas/effects.ts`: 핵심 렌더링 및 Edge Clamp 로직.
- `src/components/panels/GlassBlurPanel.tsx`: 토글 및 슬라이더 UI.
- `src/__tests__/utils/canvas-effects.test.ts`: 블러 배경 생성 및 Tint 적용 테스트.

## UI 위치
하단 네비게이션 바의 **Glass Blur** 아이콘 패널.

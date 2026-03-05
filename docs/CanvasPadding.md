# Canvas Padding 기능 명세서

## 개요
캔버스 내에서 이미지 주변의 여백(Padding)을 조절하여 레이아웃을 조정하는 기능입니다.

## 기능 스펙

### 1. 패딩 범위
- **최소**: 0px
- **최대**: 200px
- **기본값**: 0px

### 2. 동작 방식
- 슬라이더를 통해 실시간으로 패딩 크기를 변경할 수 있습니다.
- 패딩 값이 증가하면 상대적으로 이미지의 크기는 줄어들며, 설정된 배경색(Background Color) 또는 Glass Blur 효과가 패딩 영역을 채우게 됩니다.
- 캔버스 비율(1:1, 4:5, 9:16)이 변경되어도 설정된 패딩 값은 유지됩니다.

## 기술 구현 상세

### 상태 관리 (Jotai)
- `paddingAtom`: `focusAtom`을 통해 `imageSettingsAtom.padding`을 관리합니다.
- 타입: `number`

### 렌더링 로직
- `src/utils/canvas/dimensions.ts` 내부의 `getCanvasDimensions` 함수에서 패딩을 고려한 실제 이미지 배치 좌표 및 크기를 계산합니다.
- 계산된 좌표는 `ImagePosition` 객체로 반환되어 실제 그리기 함수에서 사용됩니다.

## 관련 파일 목록

- `src/atoms/imageAtoms.ts`: `paddingAtom` 선언.
- `src/components/panels/LayoutPanel.tsx`: 패딩 조절 슬라이더 UI 포함.
- `src/utils/canvas/dimensions.ts`: 패딩 기반 좌표 계산 로직.
- `src/__tests__/utils/canvas-dimensions.test.ts`: 패딩 적용 시 크기 계산 테스트.

## UI 위치
하단 네비게이션 바의 **Layout** 패널 하단 슬라이더 섹션.

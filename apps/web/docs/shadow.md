# Shadow 기능 명세서

## 개요
중앙의 원본 이미지에 드리우는 그림자 효과를 추가하여 입체감을 부여하는 기능입니다.

## 기능 스펙

### 1. 주요 파라미터
- **Enabled**: 효과 활성화 여부 (Toggle).
- **Shadow Intensity (Blur)**: 그림자의 흐림 정도 (1px - 100px, 기본값 30px).
- **Shadow Offset**: 이미지에서 멀어지는 거리 (1px - 50px, 기본값 20px).

### 2. 동작 방식
- 이미지의 우측 상단에서 좌측 하단으로 빛이 들어오는 방향(오른쪽 아래)으로 그림자가 생성됩니다.
- 그림자는 이미지 레이어 바로 아래 위치합니다.
- 그림자 적용 시 이미지의 위치는 `Shadow Offset / 2` 만큼 반대 방향으로 소폭 조정되어 캔버스 중앙 균형을 맞춥니다.

## 기술 구현 상세

### 상태 관리 (Jotai)
- `shadowEnabledAtom`, `shadowIntensityAtom`, `shadowOffsetAtom`을 사용하여 상태 관리.

### 렌더링 로직
- `src/utils/canvas/effects.ts` 내의 `applyShadow()` 함수(또는 그리기 로직 내 인라인 처리)에서 Canvas API(`shadowColor`, `shadowBlur` 등)를 사용하여 구현됩니다.
- 전체 리렌더링 시 성능 최적화를 위해 Safari 환경에서는 적절한 스케일링이 적용됩니다.

## 관련 파일 목록

- `src/atoms/imageAtoms.ts`: 그림자 관련 Atom들.
- `src/utils/canvas/effects.ts`: 그림자 렌더링 헬퍼.
- `src/components/panels/ShadowPanel.tsx`: 토글 및 인디케이터 UI.
- `src/__tests__/utils/canvas-effects.test.ts`: 그림자 위치 오프셋 및 렌더링 테스트.

## UI 위치
하단 네비게이션 바의 **Shadow** 아이콘 패널.

# Frame 기능 명세서

## 개요
이미지 주변에 다양한 형태의 프레임(테두리)을 추가하는 기능입니다. 세 가지 프레임 타입은 서로 상호 배타적으로 동작합니다.

## 기능 스펙

### 1. 프레임 타입 (`FrameType`)
- **None**: 프레임 없음.
- **Polaroid**: 하단에 날짜를 기입할 수 있는 폴라로이드 스타일 프레임.
- **Thin**: 얇은 검정색(#000000) 테두리.
- **Medium Film**: 아날로그 필름 느낌의 두꺼운 프레임과 장식 텍스트.

### 2. 세부 동작 방식
- **상호 배제**: 하나의 프레임을 선택하면 이전 프레임은 자동으로 해제됩니다.
- **Padding 연동**: 프레임 적용 시 적절한 기본 패딩이 설정되거나, 사용자가 직접 패딩을 조절할 수 있습니다.
- **Polaroid Date**: Polaroid 프레임 선택 시에만 하단에 텍스트(날짜 등)를 입력할 수 있는 입력란이 활성화됩니다.
- **제한 로직**: 프레임이 활성화된 상태(None이 아닐 때)에서는 일부 효과(Glass Blur, Shadow 등)가 비활성화되거나 제한됩니다.

## 기술 구현 상세

### 상태 관리 (Jotai)
- `frameTypeAtom`: `focusAtom`을 통해 `imageSettingsAtom.frameType`을 관리합니다.
- 타입: `'none' | 'polaroid' | 'thin' | 'mediumFilm'`

### 렌더링 파이프라인
- `src/utils/canvas/frames.ts`에서 각 프레임별 전용 그리기 함수 구현:
  - `drawPolaroidFrame()`
  - `drawThinFrame()`
  - `drawMediumFilmFrame()`
- `drawImageWithEffects()`에서 `frameType`에 따라 스위치 분기하여 처리.

## 관련 파일 목록

- `src/atoms/imageAtoms.ts`: `FrameType` 타입 정의 및 `frameTypeAtom` 선언.
- `src/utils/canvas/frames.ts`: 실제 Canvas API 기반 프레임 렌더링 로직.
- `src/components/panels/FramePanel.tsx`: 프레임 선택 및 데이터 입력을 위한 UI 패널.
- `src/utils/canvas/drawImage.ts`: 프레임 로직 오케스트레이션.
- `src/__tests__/utils/canvas-frames.test.ts`: 프레임 렌더링 정확도 테스트.

## UI 위치
하단 네비게이션 바의 **Frame** 아이콘을 통해 진입하며, 가로 버튼 형태의 옵션 제공.

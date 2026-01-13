# Shadow 기능

## 개요
이미지의 오른쪽과 아래쪽에 그림자 효과를 추가하는 기능입니다.

## 기능 상세

### 1. Shadow 토글
- Glass Blur와 동일한 UI 스타일의 토글 스위치
- 활성화 시 파란색(#007bff)으로 표시

### 2. 그림자 처리 방식
- **토글 ON**: 이미지 오른쪽/아래 방향으로 그림자 생성
- 이미지 위치가 약간 왼쪽 위로 조정되어 그림자 공간 확보
- 그림자는 이미지 뒤에 렌더링됨

### 3. Blur 강도 조절
- **범위**: 1px ~ 100px
- **기본값**: 30px
- 토글 ON 시 슬라이더로 실시간 조정 가능
- 값이 클수록 그림자가 더 흐릿하고 넓게 퍼짐

### 4. Offset 조절
- **범위**: 1px ~ 50px
- **기본값**: 20px
- 그림자가 이미지에서 얼마나 떨어져 보이는지 조절
- 값이 클수록 그림자가 더 멀리 떨어져 보임 (입체감 증가)

### 5. Glass Blur와 함께 사용
- Glass Blur 활성화 시에도 Shadow 사용 가능
- blur 배경 위에 그림자가 있는 이미지가 표시됨

## 기술 상세

### 그림자 렌더링
Canvas API의 shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY 속성을 사용합니다.

1. 그림자 설정 (ctx.save()로 상태 저장)
2. 이미지와 동일한 크기의 검은색 사각형을 그려 그림자 생성
3. 상태 복원 후 원본 이미지를 그 위에 그림

### 이미지 위치 조정
그림자가 캔버스 밖으로 잘리지 않도록 이미지 위치를 조정합니다.
- X, Y 좌표를 각각 `shadowOffset / 2` 만큼 왼쪽 위로 이동
- 이미지와 그림자가 캔버스 중앙에 균형있게 배치됨

## 관련 파일

| 파일 | 설명 |
|------|------|
| `src/atoms/imageAtoms.ts` | shadowEnabledAtom, shadowIntensityAtom, shadowOffsetAtom, canResetAtom 정의 |
| `src/components/ShadowSelector.tsx` | 토글 및 슬라이더 UI 컴포넌트 |
| `src/components/ImageCanvas.tsx` | 그림자 렌더링 로직 (drawImage 함수 내) |
| `src/components/BottomSection.tsx` | ShadowSelector 컴포넌트 배치 |
| `src/components/ResetButton.tsx` | 그림자 상태 초기화 로직 |
| `src/components/DownloadButton.tsx` | 다운로드 후 그림자 상태 초기화 로직 |

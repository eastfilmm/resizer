# Glass Blur 기능

## 개요
이미지의 중앙 정사각형 영역을 blur 처리하여 배경으로 사용하는 기능입니다.

## 기능 상세

### 1. Glass Blur 토글
- Background Color와 동일한 UI 스타일의 토글 스위치
- 활성화 시 파란색(#007bff)으로 표시

### 2. 배경 처리 방식
- **토글 ON**: 선택한 이미지의 정중앙을 기준으로 정사각형으로 잘라서 캔버스에 가득 채움
- 채워진 이미지에 blur 처리 적용
- 기존 이미지는 정중앙에 그대로 표시 (blur 배경 위에 원본 이미지)

### 3. Blur 강도 조절
- **범위**: 1% ~ 100%
- **기본값**: 30%
- 토글 ON 시 슬라이더로 실시간 조정 가능

### 4. Tint (색상 오버레이) 강도 조절
- **범위**: 0% ~ 100%
- **기본값**: 30%
- Background Color(white/black)가 blur 위에 반투명하게 적용됨
- 토글 ON 시 슬라이더로 실시간 조정 가능

### 5. Background Color 연동
- Glass Blur 활성화 시에도 Background Color 토글 사용 가능
- White 선택: blur 배경이 밝아짐
- Black 선택: blur 배경이 어두워짐
- Tint 값으로 색상 적용 강도 조절

## 기술 상세

### Edge Clamp 기법
blur 적용 시 캔버스 가장자리에서 발생하는 비네팅(어두워짐) 효과를 방지하기 위해 Edge Clamp 기법을 사용합니다.

1. blur 강도의 3배 크기로 마진을 계산
2. 마진만큼 확장된 임시 캔버스에 이미지를 그림
3. 가장자리 픽셀을 복제하여 마진 영역을 채움 (이미지 확대 없음)
4. blur 적용 후 중앙의 2000×2000 영역만 잘라서 사용

이 방식으로 가장자리까지 균일한 blur 효과를 얻을 수 있습니다.

## 관련 파일

| 파일 | 설명 |
|------|------|
| `src/atoms/imageAtoms.ts` | glassBlurAtom, blurIntensityAtom, overlayOpacityAtom 정의 |
| `src/components/GlassBlurSelector.tsx` | 토글 및 슬라이더 UI 컴포넌트 |
| `src/components/ImageCanvas.tsx` | blur 배경 렌더링 로직 (drawGlassBlurBackground) |
| `src/app/page.tsx` | GlassBlurSelector 컴포넌트 배치 |

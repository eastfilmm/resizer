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
- **범위**: 1px ~ 100px
- **기본값**: 30px
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

## 관련 파일

| 파일 | 설명 |
|------|------|
| `src/atoms/imageAtoms.ts` | glassBlurAtom, blurIntensityAtom, overlayOpacityAtom 정의 |
| `src/components/GlassBlurSelector.tsx` | 토글 및 슬라이더 UI 컴포넌트 |
| `src/components/ImageCanvas.tsx` | blur 배경 렌더링 로직 (drawGlassBlurBackground) |
| `src/app/page.tsx` | GlassBlurSelector 컴포넌트 배치 |

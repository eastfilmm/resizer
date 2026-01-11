# Canvas Padding 기능

## 개요
캔버스에 표시되는 이미지의 패딩(여백)을 조절하는 기능

## 구현 완료

### 관련 파일
- `src/atoms/imageAtoms.ts` - `paddingAtom` 추가 (0-200px 범위)
- `src/components/CanvasPaddingSelector.tsx` - 패딩 조절 슬라이더 컴포넌트
- `src/components/ImageCanvas.tsx` - 패딩 적용 로직
- `src/app/page.tsx` - 컴포넌트 배치

### 기능 상세
1. **이미지 로드 시 자동 조정**: 이미지 추가 시 패딩이 0으로 초기화되어 가로 이미지는 가로로, 세로 이미지는 세로로 캔버스에 꽉 차게 표시
2. **슬라이더로 패딩 조절**: 0~200px 범위에서 드래그바로 패딩 크기 조절 가능
3. **실시간 미리보기**: 슬라이더 조작 시 캔버스에 즉시 반영

### UI 위치
`<CanvasBackgroundSelector />`, `<GlassBlurSelector />`와 같은 레벨(BottonSection 내부)에 배치

# Copyright 기능 명세서

## 개요

이미지에 저작권 텍스트를 추가하는 기능

## UI 위치

- Glass Blur 토글 아래에 배치

## 동작 방식

### 토글 & 입력

1. 토글을 ON으로 설정하면 텍스트 입력 필드가 나타남
2. 다운로드 버튼 클릭 시 입력된 텍스트를 **로컬스토리지에 저장**
3. 다음 방문 시 저장된 값을 불러와서 입력 필드에 표시

### Reset 동작

- Reset 버튼 클릭 시 **토글만 OFF**로 초기화
- 로컬스토리지에 저장된 텍스트는 유지됨

### 텍스트 위치

| 이미지 방향 | 텍스트 위치 | 텍스트 방향 |
|------------|-----------|-----------|
| 가로 이미지 | 이미지 아래, 오른쪽 정렬 | 일반 (가로) |
| 세로 이미지 | 이미지 오른쪽, 아래 정렬 | 90도 회전 (세로) |

### 상세 위치 (이미지 기준)

- **가로 이미지**: 이미지 하단에서 아래로 12px 떨어진 위치
- **세로 이미지**: 이미지 오른쪽에서 오른쪽으로 12px 떨어진 위치

### 스타일

- **폰트 크기**: 72px (캔버스 기준 2000px)
- **폰트 굵기**: Bold
- **글자 색상**:
  - 배경이 흰색 → 검정색 글자
  - 배경이 검정색 → 흰색 글자

## 구현 완료

- [x] Copyright 토글 atom 추가 (`copyrightEnabledAtom`)
- [x] Copyright 텍스트 atom 추가 (`copyrightTextAtom`)
- [x] BottomSection에 CopyrightSelector 컴포넌트 추가
- [x] 다운로드 시 로컬스토리지 저장 로직 추가
- [x] Reset 시 토글만 초기화 (텍스트 유지)
- [x] 캔버스에 copyright 텍스트 렌더링 로직 추가
  - 가로/세로 이미지 판별
  - 위치 계산 (이미지 바깥, 12px 간격)
  - 텍스트 회전 (세로 이미지의 경우 90도)
  - 배경색에 따른 글자색 설정

## 관련 파일

- `src/atoms/imageAtoms.ts` - copyrightEnabledAtom, copyrightTextAtom
- `src/components/CopyrightSelector.tsx` - UI 컴포넌트
- `src/components/BottomSection.tsx` - CopyrightSelector 포함
- `src/components/ImageCanvas.tsx` - drawCopyrightText 함수
- `src/components/DownloadButton.tsx` - 로컬스토리지 저장
- `src/components/ResetButton.tsx` - 토글 초기화

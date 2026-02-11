# Frame 기능 명세서

## 개요

기존 "Polaroid" 패널을 "Frame" 패널로 이름을 변경하고, 새로운 "Thin Frame" 기능을 추가합니다.

---

## 변경 사항

### 1. 패널 이름 변경

| Before | After |
|--------|-------|
| Polaroid | Frame |

- 네비게이션 바의 라벨: `Polaroid` → `Frame`
- 패널 ID: `polaroid` → `frame`
- 컴포넌트 파일명: `PolaroidPanel.tsx` → `FramePanel.tsx`

---

### 2. UI 레이아웃 변경

기존 세로 배열에서 **가로 배열**로 변경 (LayoutPanel의 AspectRatioOptions 스타일 참조)

```
Before:
┌─────────────────────┐
│ [Polaroid Button]   │
├─────────────────────┤
│ Date Input          │
└─────────────────────┘

After:
┌─────────────────────┐
│ Frame Type          │
├──────────┬──────────┤
│ Polaroid │ Thin     │
├──────────┴──────────┤
│ Date Input          │
└─────────────────────┘
```

---

### 3. 새로운 기능: Thin Frame

얇은 검정색 프레임을 이미지 주변에 추가하는 기능

#### 시각적 스펙

- 프레임 색상: **검정색 (#000000)**
- 프레임 두께: **얇은 테두리** (약 2-4px 정도, 캔버스 기준)
- 이미지와 프레임 사이: 약간의 여백X

#### 상태 관리

- 새로운 atom: `thinFrameModeAtom` (boolean, 기본값: false)
- Polaroid와 Thin Frame은 **상호 배타적** (둘 중 하나만 활성화 가능)

---

## 동작 규칙

### Thin Frame 활성화 시 제한 사항

Thin Frame이 활성화되면 다음 기능들이 **비활성화/제한**됩니다:

| 기능 | 상태 | 설명 |
|------|------|------|
| Date Stamp | 비활성화 | 입력 불가 |
| Glass Blur | 비활성화 | 네비게이션 버튼 dimmed 처리 |
| Shadow | 비활성화 | 네비게이션 버튼 dimmed 처리 |
| Background Color | 비활성화 | 네비게이션 버튼 dimmed 처리, 선택 불가 |
| Padding | 활성화 | 사용 가능 |

> Polaroid 모드의 제한 사항과 동일하지만, **Background Color도 추가로 비활성화**됨

### 상호 배타적 동작

```
Polaroid ON → Thin Frame OFF (자동)
Thin Frame ON → Polaroid OFF (자동)
```

---

## 수정 대상 파일

### 필수 수정

1. **`src/atoms/imageAtoms.ts`**
   - `thinFrameModeAtom` 추가
   - `NavPanelType`에서 `'polaroid'` → `'frame'` 변경
   - `canResetAtom`에 thin frame 상태 추가

2. **`src/components/panels/PolaroidPanel.tsx`** → **`FramePanel.tsx`**
   - 컴포넌트 이름 변경
   - 가로 배열 UI로 변경
   - Thin Frame 버튼 추가
   - 상호 배타적 토글 로직

3. **`src/components/NavigationBar.tsx`**
   - NAV_ITEMS에서 `polaroid` → `frame` 변경
   - Thin Frame 모드 제한 로직 추가 (background 포함)

4. **`src/components/ImageCanvas.tsx`**
   - Thin Frame 렌더링 로직 추가

5. **`src/components/DownloadButton.tsx`**
   - Thin Frame 렌더링 로직 추가

6. **`src/hooks/useResetState.ts`**
   - thinFrameMode 리셋 추가

7. **`src/utils/CanvasUtils.ts`**
   - Thin Frame 그리기 함수 추가

8. **`docs/PROJECT_STRUCTURE.md`**
   - 파일명 변경 반영

---

## 구현 우선순위

1. atom 및 타입 정의 변경
2. FramePanel UI 구현 (가로 배열 + Thin Frame 버튼)
3. NavigationBar 제한 로직 수정
4. Canvas 렌더링 로직 구현
5. Reset/Download 로직 업데이트
6. 문서 업데이트

---

## 참고

- Polaroid 제한 로직: `NavigationBar.tsx` 172-179번 라인
- 가로 버튼 배열 예시: `LayoutPanel.tsx` AspectRatioOptions

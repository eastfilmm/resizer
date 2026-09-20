# @resizer/ui

`apps/web`과 `apps/ait`가 공유하는 디자인 시스템.

## 원칙

- **도메인을 모른다.** jotai atoms나 캔버스 개념이 들어오면 안 된다.
  도메인이 필요한 패널·NavigationBar·ImageCanvas는 앱에 남긴다.
- **직접 만들지 말고 Base UI를 얇게 래핑한다.** 접근성·키보드·포커스 상태를
  공짜로 얻는다. 단 `@base-ui-components/react`가 RC 버전이라,
  앱에서 Base UI를 직접 import하지 말고 **반드시 이 패키지를 거친다.**
  그래야 breaking change의 폭발 반경이 여기로 제한된다.
- `@resizer/canvas`와 같이 **빌드 산출물 없이 TS 소스를 그대로 노출**한다.
  Next는 `transpilePackages`에, Vite는 기본 동작으로 처리된다.

## 구성

| 파일 | 내용 |
|---|---|
| `theme.ts` | 색상 토큰 |
| `RangeSlider.tsx` | Base UI Slider 래퍼 (값 뱃지, 막대형 thumb) |
| `FocusReveal.tsx` | 조작 중 주변 UI를 걷어내는 컴파운드 컴포넌트 |
| `primitives.tsx` | 패널 styled 원자 (PanelContainer, ToggleSwitch, SliderLabel…) |
| `Button.tsx` / `Layout.tsx` | 버튼·레이아웃 styled 원자 |
| `hooks/` | 범용 훅 (useClickOutside, useIsDesktop, useIsSafari, useRafThrottle) |

## 알려진 개선 대상

`primitives.tsx`의 `ToggleSwitch`는 `styled.div` + `onClick`이라 **키보드 조작과
ARIA가 없다.** Base UI `switch`로 교체해야 한다. 비율/프레임/배경 선택 버튼도
`toggle-group`/`radio-group` 후보다.

네비게이션 바 버튼은 `tabs`로 바꾸지 말 것 — "같은 탭 재클릭 = 닫기" 토글
시맨틱을 Base UI `tabs`가 지원하지 않는다.

/**
 * 모션 토큰.
 *
 * 전환 시간은 CSS(styled-components)와 JS(setTimeout 오케스트레이션) 양쪽에서
 * 쓰인다. 두 곳에 숫자를 따로 적어두면 한쪽만 바꿨을 때 조용히 어긋나므로
 * 여기서만 정의한다.
 */

/** 패널 높이 전환 */
export const PANEL_HEIGHT_MS = 300;

/** 패널 내용 페이드 인/아웃 */
export const PANEL_FADE_MS = 150;

/** 높이 전환이 시작된 뒤 페이드인까지의 지연 */
export const PANEL_FADE_IN_DELAY_MS = 50;

/** 네비게이션 인디케이터 이동 */
export const NAV_INDICATOR_MS = 300;

export const PANEL_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

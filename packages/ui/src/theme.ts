// Primary
export const COLOR_PRIMARY = '#007bff';
export const COLOR_PRIMARY_DARK = '#0056b3';
export const COLOR_PRIMARY_BG = '#e7f3ff';

// Gray scale
export const COLOR_GRAY = '#6c757d';
export const COLOR_GRAY_TEXT = '#666';
export const COLOR_GRAY_BORDER = '#ddd';
export const COLOR_GRAY_BG = '#f8f9fa';
export const COLOR_GRAY_PLACEHOLDER = '#999';
export const COLOR_GRAY_BG_DISABLED = '#f5f5f5';

// Breakpoint
// useIsDesktop과 styled-components의 미디어쿼리가 같은 값을 봐야 한다.
// 어긋나면 CSS는 데스크톱인데 캔버스 해상도는 모바일인 상태가 만들어진다.
export const DESKTOP_MIN_WIDTH_PX = 768;
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH_PX}px)`;

import { BACKGROUND_COLOR_FILL } from './constants';
import type { BackgroundColor } from './types';

/**
 * Soft 슬라이더 끝(100)에서 섞는 흰색 비율. 100%까지 섞으면 모든 색이 흰색이
 * 되므로 70%에서 멈춰 파스텔로 남긴다.
 */
export const BACKGROUND_SOFT_MAX_MIX = 0.7;

/** Soft를 적용하는 색인가. 검정은 섞으면 파스텔이 아니라 회색이 되므로 제외한다. */
export const isSoftenable = (color: BackgroundColor): boolean => color !== 'black';

const mixWithWhite = (hex: string, amount: number): string => {
  const rgb = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => {
    const value = (rgb >> shift) & 0xff;
    return Math.round(value + (255 - value) * amount)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(16)}${channel(8)}${channel(0)}`.toUpperCase();
};

/**
 * 실제로 칠할 배경색. softness(0~100)만큼 흰색을 섞는다.
 * 무지개 색은 파스텔로 밝아지고, 흰색은 그대로, 검정은 Soft를 무시한다.
 */
export const getBackgroundFill = (color: BackgroundColor, softness = 0): string => {
  const base = BACKGROUND_COLOR_FILL[color];
  if (!isSoftenable(color)) return base;
  const amount = (Math.min(Math.max(softness, 0), 100) / 100) * BACKGROUND_SOFT_MAX_MIX;
  return amount === 0 ? base : mixWithWhite(base, amount);
};

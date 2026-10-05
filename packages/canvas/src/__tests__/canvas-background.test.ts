import { describe, expect, it } from 'vitest';
import { BACKGROUND_COLOR_FILL, getBackgroundFill, isSoftenable } from '../index';

describe('getBackgroundFill', () => {
  it('softness 0이면 원색 그대로다', () => {
    expect(getBackgroundFill('red', 0)).toBe(BACKGROUND_COLOR_FILL.red);
    expect(getBackgroundFill('red')).toBe(BACKGROUND_COLOR_FILL.red);
  });

  it('끝까지 밀어도 흰색이 되지 않고 70%만 섞는다', () => {
    // 빨강 #E53935: E5(229) + (255 - 229) * 0.7 = 247.2 → F7
    expect(getBackgroundFill('red', 100)).toBe('#F7C4C2');
  });

  it('검정은 Soft 대상이 아니다', () => {
    expect(isSoftenable('black')).toBe(false);
    expect(getBackgroundFill('black', 50)).toBe('#000000');
    expect(getBackgroundFill('black', 100)).toBe('#000000');
  });

  it('흰색은 얼마를 섞어도 흰색이다', () => {
    expect(getBackgroundFill('white', 50)).toBe('#FFFFFF');
    expect(getBackgroundFill('white', 100)).toBe('#FFFFFF');
  });

  it('값이 커질수록 밝아진다', () => {
    const brightness = (hex: string) => parseInt(hex.slice(1, 3), 16);
    expect(brightness(getBackgroundFill('blue', 50))).toBeGreaterThan(
      brightness(getBackgroundFill('blue', 0)),
    );
    expect(brightness(getBackgroundFill('blue', 100))).toBeGreaterThan(
      brightness(getBackgroundFill('blue', 50)),
    );
  });

  it('범위를 벗어난 값은 0~100으로 자른다', () => {
    expect(getBackgroundFill('blue', -10)).toBe(BACKGROUND_COLOR_FILL.blue);
    expect(getBackgroundFill('red', 200)).toBe('#F7C4C2');
  });
});

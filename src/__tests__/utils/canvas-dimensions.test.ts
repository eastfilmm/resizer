import { describe, it, expect } from 'vitest';
import { getCanvasDimensions, getCanvasDisplaySize } from '@/utils/CanvasUtils';
import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_PREVIEW_SIZE,
  CANVAS_ACTUAL_SIZE_4_5_WIDTH,
  CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
  CANVAS_PREVIEW_SIZE_4_5_WIDTH,
  CANVAS_PREVIEW_SIZE_4_5_HEIGHT,
  CANVAS_ACTUAL_SIZE_9_16_WIDTH,
  CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
  CANVAS_PREVIEW_SIZE_9_16_WIDTH,
  CANVAS_PREVIEW_SIZE_9_16_HEIGHT,
  CANVAS_DISPLAY_SIZE,
} from '@/constants/CanvasContents';

describe('getCanvasDimensions', () => {
  describe('1:1 aspect ratio', () => {
    it('returns actual size for non-Safari', () => {
      const result = getCanvasDimensions('1:1', false);
      expect(result).toEqual({ width: CANVAS_ACTUAL_SIZE, height: CANVAS_ACTUAL_SIZE });
    });

    it('returns preview size for Safari', () => {
      const result = getCanvasDimensions('1:1', true);
      expect(result).toEqual({ width: CANVAS_PREVIEW_SIZE, height: CANVAS_PREVIEW_SIZE });
    });

    it('returns square dimensions (width === height)', () => {
      const nonSafari = getCanvasDimensions('1:1', false);
      expect(nonSafari.width).toBe(nonSafari.height);

      const safari = getCanvasDimensions('1:1', true);
      expect(safari.width).toBe(safari.height);
    });
  });

  describe('4:5 aspect ratio', () => {
    it('returns actual size for non-Safari', () => {
      const result = getCanvasDimensions('4:5', false);
      expect(result).toEqual({
        width: CANVAS_ACTUAL_SIZE_4_5_WIDTH,
        height: CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
      });
    });

    it('returns preview size for Safari', () => {
      const result = getCanvasDimensions('4:5', true);
      expect(result).toEqual({
        width: CANVAS_PREVIEW_SIZE_4_5_WIDTH,
        height: CANVAS_PREVIEW_SIZE_4_5_HEIGHT,
      });
    });

    it('maintains 4:5 ratio (width/height ≈ 0.8)', () => {
      const result = getCanvasDimensions('4:5', false);
      expect(result.width / result.height).toBe(0.8);
    });
  });

  describe('9:16 aspect ratio', () => {
    it('returns actual size for non-Safari', () => {
      const result = getCanvasDimensions('9:16', false);
      expect(result).toEqual({
        width: CANVAS_ACTUAL_SIZE_9_16_WIDTH,
        height: CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
      });
    });

    it('returns preview size for Safari', () => {
      const result = getCanvasDimensions('9:16', true);
      expect(result).toEqual({
        width: CANVAS_PREVIEW_SIZE_9_16_WIDTH,
        height: CANVAS_PREVIEW_SIZE_9_16_HEIGHT,
      });
    });

    it('maintains 9:16 ratio (width/height ≈ 0.5625)', () => {
      const result = getCanvasDimensions('9:16', false);
      expect(result.width / result.height).toBe(0.5625);
    });
  });

  describe('Safari vs non-Safari relationship', () => {
    it('Safari dimensions are smaller than non-Safari for all ratios', () => {
      const ratios: ('1:1' | '4:5' | '9:16')[] = ['1:1', '4:5', '9:16'];
      for (const ratio of ratios) {
        const safari = getCanvasDimensions(ratio, true);
        const nonSafari = getCanvasDimensions(ratio, false);
        expect(safari.width).toBeLessThan(nonSafari.width);
        expect(safari.height).toBeLessThan(nonSafari.height);
      }
    });

    it('Safari preview is 0.4x of actual for 1:1', () => {
      const safari = getCanvasDimensions('1:1', true);
      const nonSafari = getCanvasDimensions('1:1', false);
      expect(safari.width / nonSafari.width).toBe(0.4);
      expect(safari.height / nonSafari.height).toBe(0.4);
    });
  });
});

describe('getCanvasDisplaySize', () => {
  it('returns square display for 1:1', () => {
    const result = getCanvasDisplaySize('1:1');
    expect(result).toEqual({ width: CANVAS_DISPLAY_SIZE, height: CANVAS_DISPLAY_SIZE });
  });

  it('returns 256x320 for 4:5', () => {
    const result = getCanvasDisplaySize('4:5');
    expect(result).toEqual({ width: 256, height: CANVAS_DISPLAY_SIZE });
  });

  it('returns 180x320 for 9:16', () => {
    const result = getCanvasDisplaySize('9:16');
    expect(result).toEqual({ width: 180, height: CANVAS_DISPLAY_SIZE });
  });

  it('all display sizes have the same height (320px)', () => {
    const ratios: ('1:1' | '4:5' | '9:16')[] = ['1:1', '4:5', '9:16'];
    for (const ratio of ratios) {
      const result = getCanvasDisplaySize(ratio);
      expect(result.height).toBe(CANVAS_DISPLAY_SIZE);
    }
  });

  it('1:1 display is widest, 9:16 is narrowest', () => {
    const size1 = getCanvasDisplaySize('1:1');
    const size45 = getCanvasDisplaySize('4:5');
    const size916 = getCanvasDisplaySize('9:16');
    expect(size1.width).toBeGreaterThan(size45.width);
    expect(size45.width).toBeGreaterThan(size916.width);
  });
});

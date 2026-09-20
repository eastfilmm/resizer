import { describe, it, expect } from 'vitest';
import {
  getCanvasDimensions,
  getCanvasDisplaySize,
  getPreviewScaleFactor,
  getThumbnailCanvasSize,
} from '@/utils/canvas';
import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_PREVIEW_SIZE,
  CANVAS_PREVIEW_SIZE_DESKTOP,
  CANVAS_ACTUAL_SIZE_4_5_WIDTH,
  CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
  CANVAS_PREVIEW_SIZE_4_5_WIDTH,
  CANVAS_PREVIEW_SIZE_4_5_HEIGHT,
  CANVAS_ACTUAL_SIZE_9_16_WIDTH,
  CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
  CANVAS_PREVIEW_SIZE_9_16_WIDTH,
  CANVAS_PREVIEW_SIZE_9_16_HEIGHT,
  CANVAS_DISPLAY_SIZE,
  CANVAS_DISPLAY_SIZE_DESKTOP,
  CANVAS_DISPLAY_SIZE_4_5_WIDTH_DESKTOP,
  CANVAS_DISPLAY_SIZE_9_16_WIDTH_DESKTOP,
} from '@/constants/CanvasContents';

describe('getCanvasDimensions', () => {
  describe('1:1 aspect ratio', () => {
    it('returns full resolution when usePreviewSize is false', () => {
      const result = getCanvasDimensions('1:1', false);
      expect(result).toEqual({ width: CANVAS_ACTUAL_SIZE, height: CANVAS_ACTUAL_SIZE });
    });

    it('returns preview resolution when usePreviewSize is true', () => {
      const result = getCanvasDimensions('1:1', true);
      expect(result).toEqual({ width: CANVAS_PREVIEW_SIZE, height: CANVAS_PREVIEW_SIZE });
    });

    it('returns square dimensions (width === height)', () => {
      const full = getCanvasDimensions('1:1', false);
      expect(full.width).toBe(full.height);

      const preview = getCanvasDimensions('1:1', true);
      expect(preview.width).toBe(preview.height);
    });
  });

  describe('4:5 aspect ratio', () => {
    it('returns full resolution when usePreviewSize is false', () => {
      const result = getCanvasDimensions('4:5', false);
      expect(result).toEqual({
        width: CANVAS_ACTUAL_SIZE_4_5_WIDTH,
        height: CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
      });
    });

    it('returns preview resolution when usePreviewSize is true', () => {
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
    it('returns full resolution when usePreviewSize is false', () => {
      const result = getCanvasDimensions('9:16', false);
      expect(result).toEqual({
        width: CANVAS_ACTUAL_SIZE_9_16_WIDTH,
        height: CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
      });
    });

    it('returns preview resolution when usePreviewSize is true', () => {
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

  describe('preview vs full resolution relationship', () => {
    it('preview dimensions are smaller than full resolution for all ratios', () => {
      const ratios: ('1:1' | '4:5' | '9:16')[] = ['1:1', '4:5', '9:16'];
      for (const ratio of ratios) {
        const preview = getCanvasDimensions(ratio, true);
        const full = getCanvasDimensions(ratio, false);
        expect(preview.width).toBeLessThan(full.width);
        expect(preview.height).toBeLessThan(full.height);
      }
    });

    it('mobile preview is 0.4x of actual for 1:1', () => {
      const preview = getCanvasDimensions('1:1', true);
      const full = getCanvasDimensions('1:1', false);
      expect(preview.width / full.width).toBe(0.4);
      expect(preview.height / full.height).toBe(0.4);
    });
  });

  describe('desktop preview tier', () => {
    it('uses the desktop preview size when isDesktop is true', () => {
      const result = getCanvasDimensions('1:1', true, true);
      expect(result).toEqual({
        width: CANVAS_PREVIEW_SIZE_DESKTOP,
        height: CANVAS_PREVIEW_SIZE_DESKTOP,
      });
    });

    it('is larger than the mobile preview but smaller than full resolution', () => {
      const ratios: ('1:1' | '4:5' | '9:16')[] = ['1:1', '4:5', '9:16'];
      for (const ratio of ratios) {
        const mobile = getCanvasDimensions(ratio, true, false);
        const desktop = getCanvasDimensions(ratio, true, true);
        const full = getCanvasDimensions(ratio, false);
        expect(desktop.height).toBeGreaterThan(mobile.height);
        expect(desktop.height).toBeLessThan(full.height);
      }
    });

    it('keeps the aspect ratio of each preset', () => {
      expect(getCanvasDimensions('4:5', true, true)).toEqual({ width: 960, height: 1200 });
      expect(getCanvasDimensions('9:16', true, true)).toEqual({ width: 675, height: 1200 });
    });

    it('ignores isDesktop when rendering at full resolution', () => {
      expect(getCanvasDimensions('1:1', false, true)).toEqual(getCanvasDimensions('1:1', false, false));
    });
  });
});

describe('getPreviewScaleFactor', () => {
  it('is 0.4 on mobile and 0.6 on desktop', () => {
    expect(getPreviewScaleFactor(false)).toBe(0.4);
    expect(getPreviewScaleFactor(true)).toBe(0.6);
  });

  it('matches the ratio between the preview canvas and the full-resolution canvas', () => {
    for (const isDesktop of [false, true]) {
      const preview = getCanvasDimensions('1:1', true, isDesktop);
      const full = getCanvasDimensions('1:1', false);
      expect(getPreviewScaleFactor(isDesktop)).toBe(preview.height / full.height);
    }
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

  describe('desktop (isDesktop=true)', () => {
    it('returns 600x600 for 1:1', () => {
      const result = getCanvasDisplaySize('1:1', true);
      expect(result).toEqual({ width: CANVAS_DISPLAY_SIZE_DESKTOP, height: CANVAS_DISPLAY_SIZE_DESKTOP });
    });

    it('returns 480x600 for 4:5', () => {
      const result = getCanvasDisplaySize('4:5', true);
      expect(result).toEqual({ width: CANVAS_DISPLAY_SIZE_4_5_WIDTH_DESKTOP, height: CANVAS_DISPLAY_SIZE_DESKTOP });
    });

    it('returns 338x600 for 9:16', () => {
      const result = getCanvasDisplaySize('9:16', true);
      expect(result).toEqual({ width: CANVAS_DISPLAY_SIZE_9_16_WIDTH_DESKTOP, height: CANVAS_DISPLAY_SIZE_DESKTOP });
    });

    it('all desktop display sizes have the same height (600px)', () => {
      const ratios: ('1:1' | '4:5' | '9:16')[] = ['1:1', '4:5', '9:16'];
      for (const ratio of ratios) {
        const result = getCanvasDisplaySize(ratio, true);
        expect(result.height).toBe(CANVAS_DISPLAY_SIZE_DESKTOP);
      }
    });

    it('desktop sizes are larger than mobile sizes', () => {
      const ratios: ('1:1' | '4:5' | '9:16')[] = ['1:1', '4:5', '9:16'];
      for (const ratio of ratios) {
        const mobile = getCanvasDisplaySize(ratio, false);
        const desktop = getCanvasDisplaySize(ratio, true);
        expect(desktop.width).toBeGreaterThan(mobile.width);
        expect(desktop.height).toBeGreaterThan(mobile.height);
      }
    });
  });
});

describe('getThumbnailCanvasSize', () => {
  it('returns square thumbnail dimensions for 1:1', () => {
    const result = getThumbnailCanvasSize('1:1', 88, 2);
    expect(result).toEqual({
      width: 176,
      height: 176,
      displayWidth: 88,
      displayHeight: 88,
    });
  });

  it('returns portrait thumbnail dimensions for 4:5', () => {
    const result = getThumbnailCanvasSize('4:5', 90, 2);
    expect(result).toEqual({
      width: 144,
      height: 180,
      displayWidth: 72,
      displayHeight: 90,
    });
  });

  it('returns narrow portrait thumbnail dimensions for 9:16', () => {
    const result = getThumbnailCanvasSize('9:16', 96, 2);
    expect(result).toEqual({
      width: 108,
      height: 192,
      displayWidth: 54,
      displayHeight: 96,
    });
  });
});

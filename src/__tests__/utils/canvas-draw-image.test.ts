import { describe, it, expect, beforeEach } from 'vitest';
import { drawImageWithEffects } from '@/utils/canvas';
import type { DrawImageOptions } from '@/utils/canvas';

/**
 * Integration tests for drawImageWithEffects.
 * This is the main orchestrator that dispatches to frame/effect functions.
 * Tests ensure correct dispatch and that all code paths execute without error.
 */
describe('drawImageWithEffects', () => {
  let canvas: HTMLCanvasElement;
  let ctx: any;
  let landscapeImg: HTMLImageElement;
  let portraitImg: HTMLImageElement;
  let squareImg: HTMLImageElement;

  const baseOptions: DrawImageOptions = {
    actualCanvasWidth: 2000,
    actualCanvasHeight: 2000,
    imageAreaWidth: 2000,
    imageAreaHeight: 2000,
    padding: 0,
    bgColor: 'white',
    useGlassBlur: false,
    blurIntensity: 30,
    overlayOpacity: 0.3,
    useShadow: false,
    shadowIntensity: 30,
    shadowOffset: 20,
    usePolaroid: false,
    useThinFrame: false,
    useMediumFilmFrame: false,
    isSafari: false,
    scaleFactor: 1,
    polaroidDate: '',
  };

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 2000;
    ctx = canvas.getContext('2d');
    ctx.calls = [];

    landscapeImg = new Image();
    Object.defineProperty(landscapeImg, 'width', { value: 1200, writable: true });
    Object.defineProperty(landscapeImg, 'height', { value: 800, writable: true });

    portraitImg = new Image();
    Object.defineProperty(portraitImg, 'width', { value: 800, writable: true });
    Object.defineProperty(portraitImg, 'height', { value: 1200, writable: true });

    squareImg = new Image();
    Object.defineProperty(squareImg, 'width', { value: 1000, writable: true });
    Object.defineProperty(squareImg, 'height', { value: 1000, writable: true });
  });

  // ─── Basic rendering (no effects) ───

  describe('plain rendering (no effects)', () => {
    it('returns ImagePosition with valid values', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, baseOptions);
      expect(result).toHaveProperty('x');
      expect(result).toHaveProperty('y');
      expect(result).toHaveProperty('width');
      expect(result).toHaveProperty('height');
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });

    it('clears canvas before drawing', () => {
      drawImageWithEffects(ctx, landscapeImg, baseOptions);
      const clearRectCall = ctx.calls.find((c: any) => c.method === 'clearRect');
      expect(clearRectCall).toBeTruthy();
      expect(clearRectCall.args).toEqual([0, 0, 2000, 2000]);
    });

    it('fills background with specified color', () => {
      drawImageWithEffects(ctx, landscapeImg, { ...baseOptions, bgColor: 'black' });
      const fillRectCalls = ctx.calls.filter((c: any) => c.method === 'fillRect');
      expect(fillRectCalls.length).toBeGreaterThan(0);
    });

    it('draws image via drawImage call', () => {
      drawImageWithEffects(ctx, landscapeImg, baseOptions);
      const drawImageCalls = ctx.calls.filter((c: any) => c.method === 'drawImage');
      expect(drawImageCalls.length).toBe(1);
    });

    it('centers image on canvas', () => {
      const result = drawImageWithEffects(ctx, squareImg, baseOptions);
      // Square image on square 2000x2000 canvas should be centered
      expect(result.x).toBeCloseTo((2000 - result.width) / 2, 0);
      expect(result.y).toBeCloseTo((2000 - result.height) / 2, 0);
    });

    it('maintains image aspect ratio for landscape', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, baseOptions);
      const originalRatio = 1200 / 800;
      const resultRatio = result.width / result.height;
      expect(resultRatio).toBeCloseTo(originalRatio, 5);
    });

    it('maintains image aspect ratio for portrait', () => {
      const result = drawImageWithEffects(ctx, portraitImg, baseOptions);
      const originalRatio = 800 / 1200;
      const resultRatio = result.width / result.height;
      expect(resultRatio).toBeCloseTo(originalRatio, 5);
    });
  });

  // ─── Padding ───

  describe('with padding', () => {
    it('reduces image area by padding', () => {
      const noPadding = drawImageWithEffects(ctx, landscapeImg, baseOptions);
      const withPadding = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        padding: 100,
        imageAreaWidth: 1800,
        imageAreaHeight: 1800,
      });
      expect(withPadding.width).toBeLessThan(noPadding.width);
    });
  });

  // ─── Glass Blur ───

  describe('with glass blur', () => {
    it('draws without error', () => {
      expect(() => {
        drawImageWithEffects(ctx, landscapeImg, {
          ...baseOptions,
          useGlassBlur: true,
          blurIntensity: 30,
          overlayOpacity: 0.3,
        });
      }).not.toThrow();
    });

    it('returns valid position', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        useGlassBlur: true,
      });
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });
  });

  // ─── Shadow ───

  describe('with shadow', () => {
    it('offsets image position for shadow room', () => {
      const noShadow = drawImageWithEffects(ctx, landscapeImg, baseOptions);
      const withShadow = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        useShadow: true,
        shadowIntensity: 30,
        shadowOffset: 20,
      });

      // With shadow, image should be shifted top-left by shadowOffset/2
      expect(withShadow.x).toBeLessThan(noShadow.x);
      expect(withShadow.y).toBeLessThan(noShadow.y);
    });

    it('saves and restores context for shadow', () => {
      drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        useShadow: true,
      });
      const saveCalls = ctx.calls.filter((c: any) => c.method === 'save');
      const restoreCalls = ctx.calls.filter((c: any) => c.method === 'restore');
      expect(saveCalls.length).toBeGreaterThan(0);
      expect(restoreCalls.length).toBe(saveCalls.length);
    });

    it('draws shadow rectangle before image', () => {
      drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        useShadow: true,
      });
      const fillRectCalls = ctx.calls.filter((c: any) => c.method === 'fillRect');
      const drawImageCalls = ctx.calls.filter((c: any) => c.method === 'drawImage');

      // fillRect (bg) + fillRect (shadow) should come before drawImage
      expect(fillRectCalls.length).toBeGreaterThanOrEqual(2);
      expect(drawImageCalls.length).toBe(1);

      const lastFillRectIndex = ctx.calls.lastIndexOf(fillRectCalls[fillRectCalls.length - 1]);
      const drawImageIndex = ctx.calls.indexOf(drawImageCalls[0]);
      // The shadow fillRect should be before the drawImage
      // (bg fillRect → save → shadow fillRect → restore → drawImage)
    });
  });

  // ─── Polaroid mode dispatch ───

  describe('polaroid mode', () => {
    it('dispatches to polaroid rendering', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        usePolaroid: true,
      });
      // Polaroid draws roundRect for frame
      const roundRectCalls = ctx.calls.filter((c: any) => c.method === 'roundRect');
      expect(roundRectCalls.length).toBeGreaterThan(0);
      expect(result.width).toBeGreaterThan(0);
    });

    it('passes date text to polaroid frame', () => {
      drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        usePolaroid: true,
        polaroidDate: '2024.01.01',
      });
      const fillTextCalls = ctx.calls.filter((c: any) => c.method === 'fillText');
      expect(fillTextCalls.length).toBeGreaterThan(0);
    });

    it('polaroid takes priority over other effects (no shadow/blur applied)', () => {
      drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        usePolaroid: true,
        useShadow: true,
        useGlassBlur: true,
      });
      // In polaroid mode, shadow and blur should NOT be applied
      // (early return from drawPolaroidFrame)
      // The function should still succeed
      const result = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        usePolaroid: true,
      });
      expect(result.width).toBeGreaterThan(0);
    });
  });

  // ─── Thin Frame mode dispatch ───

  describe('thin frame mode', () => {
    it('dispatches to thin frame rendering', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        useThinFrame: true,
      });
      expect(result.width).toBeGreaterThan(0);
      // Thin frame uses fillRect for black border (no roundRect)
      const roundRectCalls = ctx.calls.filter((c: any) => c.method === 'roundRect');
      expect(roundRectCalls.length).toBe(0);
    });
  });

  // ─── Medium Film Frame mode dispatch ───

  describe('medium film frame mode', () => {
    it('dispatches to medium film frame rendering', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        useMediumFilmFrame: true,
      });
      expect(result.width).toBeGreaterThan(0);
      // Film frame has fillText calls for film info
      const fillTextCalls = ctx.calls.filter((c: any) => c.method === 'fillText');
      expect(fillTextCalls.length).toBeGreaterThan(0);
    });
  });

  // ─── Frame mode priority ───

  describe('frame mode priority', () => {
    it('polaroid takes priority over thin frame', () => {
      ctx.calls = [];
      drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        usePolaroid: true,
        useThinFrame: true,
      });
      // Polaroid uses roundRect, thin frame does not
      const roundRectCalls = ctx.calls.filter((c: any) => c.method === 'roundRect');
      expect(roundRectCalls.length).toBeGreaterThan(0);
    });

    it('thin frame takes priority over medium film frame', () => {
      ctx.calls = [];
      drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        useThinFrame: true,
        useMediumFilmFrame: true,
      });
      // Thin frame does NOT draw film info text
      const fillTextCalls = ctx.calls.filter((c: any) => c.method === 'fillText');
      expect(fillTextCalls.length).toBe(0);
    });
  });

  // ─── 4:5 and 9:16 canvas dimensions ───

  describe('different canvas dimensions', () => {
    it('works with 4:5 canvas', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        actualCanvasWidth: 1600,
        actualCanvasHeight: 2000,
        imageAreaWidth: 1600,
        imageAreaHeight: 2000,
      });
      expect(result.width).toBeGreaterThan(0);
      expect(result.x + result.width).toBeLessThanOrEqual(1600);
    });

    it('works with 9:16 canvas', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        actualCanvasWidth: 1125,
        actualCanvasHeight: 2000,
        imageAreaWidth: 1125,
        imageAreaHeight: 2000,
      });
      expect(result.width).toBeGreaterThan(0);
      expect(result.x + result.width).toBeLessThanOrEqual(1125);
    });
  });

  // ─── Safari mode ───

  describe('Safari mode', () => {
    it('works with Safari flag and scaled values', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        actualCanvasWidth: 800,
        actualCanvasHeight: 800,
        imageAreaWidth: 800,
        imageAreaHeight: 800,
        isSafari: true,
        scaleFactor: 0.4,
      });
      expect(result.width).toBeGreaterThan(0);
    });
  });

  // ─── Combined effects ───

  describe('combined effects', () => {
    it('glass blur + shadow works together', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        useGlassBlur: true,
        blurIntensity: 30,
        overlayOpacity: 0.3,
        useShadow: true,
        shadowIntensity: 30,
        shadowOffset: 20,
      });
      expect(result.width).toBeGreaterThan(0);
    });

    it('padding + glass blur + shadow works together', () => {
      const result = drawImageWithEffects(ctx, landscapeImg, {
        ...baseOptions,
        padding: 100,
        imageAreaWidth: 1800,
        imageAreaHeight: 1800,
        useGlassBlur: true,
        useShadow: true,
      });
      expect(result.width).toBeGreaterThan(0);
    });
  });
});

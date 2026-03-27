import { describe, it, expect, beforeEach } from 'vitest';
import { drawGlassBlurBackground } from '@/utils/canvas';

describe('drawGlassBlurBackground', () => {
  let canvas: HTMLCanvasElement;
  let ctx: any;
  let img: HTMLImageElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 2000;
    ctx = canvas.getContext('2d');
    ctx.calls = [];

    // Create a mock image
    img = new Image();
    Object.defineProperty(img, 'width', { value: 800, writable: true });
    Object.defineProperty(img, 'height', { value: 600, writable: true });
  });

  it('draws the image to canvas (non-Safari path)', () => {
    drawGlassBlurBackground(ctx, img, 2000, 2000, 30, 'white', 0.3, false);

    // Should have drawImage calls (at minimum the temp canvas operations)
    const drawImageCalls = ctx.calls.filter((c: any) => c.method === 'drawImage');
    expect(drawImageCalls.length).toBeGreaterThan(0);
  });

  it('applies color overlay with correct opacity', () => {
    drawGlassBlurBackground(ctx, img, 2000, 2000, 30, 'white', 0.5, false);

    // After drawing, globalAlpha should be reset to 1.0
    expect(ctx.globalAlpha).toBe(1.0);

    // Should have a fillRect call for the overlay
    const fillRectCalls = ctx.calls.filter((c: any) => c.method === 'fillRect');
    expect(fillRectCalls.length).toBeGreaterThan(0);

    // The last fillRect should be the overlay, covering the full canvas
    const overlayCall = fillRectCalls[fillRectCalls.length - 1];
    expect(overlayCall.args).toEqual([0, 0, 2000, 2000]);
  });

  it('uses fill style matching the overlay color', () => {
    drawGlassBlurBackground(ctx, img, 2000, 2000, 30, 'black', 0.3, false);
    // fillStyle should end up as the overlay color
    expect(ctx.fillStyle).toBe('black');
  });

  it('works with Safari flag (stackblur path)', () => {
    // Safari path uses canvasRGB from stackblur-canvas
    // This test just ensures no errors are thrown
    expect(() => {
      drawGlassBlurBackground(ctx, img, 800, 800, 12, 'white', 0.3, true);
    }).not.toThrow();
  });

  it('handles different canvas dimensions', () => {
    // 4:5 ratio canvas
    expect(() => {
      drawGlassBlurBackground(ctx, img, 1600, 2000, 30, 'white', 0.3, false);
    }).not.toThrow();

    // 9:16 ratio canvas
    expect(() => {
      drawGlassBlurBackground(ctx, img, 1125, 2000, 30, 'white', 0.3, false);
    }).not.toThrow();
  });

  it('handles zero intensity without errors', () => {
    expect(() => {
      drawGlassBlurBackground(ctx, img, 2000, 2000, 0, 'white', 0.3, false);
    }).not.toThrow();
  });

  it('handles zero opacity overlay', () => {
    drawGlassBlurBackground(ctx, img, 2000, 2000, 30, 'white', 0, false);
    expect(ctx.globalAlpha).toBe(1.0);
  });

  it('handles portrait image', () => {
    Object.defineProperty(img, 'width', { value: 600, writable: true });
    Object.defineProperty(img, 'height', { value: 800, writable: true });

    expect(() => {
      drawGlassBlurBackground(ctx, img, 2000, 2000, 30, 'white', 0.3, false);
    }).not.toThrow();
  });

  it('handles square image', () => {
    Object.defineProperty(img, 'width', { value: 500, writable: true });
    Object.defineProperty(img, 'height', { value: 500, writable: true });

    expect(() => {
      drawGlassBlurBackground(ctx, img, 2000, 2000, 30, 'white', 0.3, false);
    }).not.toThrow();
  });
});

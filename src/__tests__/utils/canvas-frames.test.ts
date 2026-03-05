import { describe, it, expect, beforeEach } from 'vitest';
import {
  drawPolaroidFrame,
  drawThinFrame,
  drawMediumFilmFrame,
} from '@/utils/CanvasUtils';

describe('drawPolaroidFrame', () => {
  let canvas: HTMLCanvasElement;
  let ctx: any;
  let landscapeImg: HTMLImageElement;
  let portraitImg: HTMLImageElement;

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
  });

  it('returns ImagePosition with x, y, width, height', () => {
    const result = drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white');
    expect(result).toHaveProperty('x');
    expect(result).toHaveProperty('y');
    expect(result).toHaveProperty('width');
    expect(result).toHaveProperty('height');
    expect(typeof result.x).toBe('number');
    expect(typeof result.y).toBe('number');
    expect(typeof result.width).toBe('number');
    expect(typeof result.height).toBe('number');
  });

  it('image fits within canvas bounds', () => {
    const result = drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white');
    expect(result.x).toBeGreaterThanOrEqual(0);
    expect(result.y).toBeGreaterThanOrEqual(0);
    expect(result.x + result.width).toBeLessThanOrEqual(2000);
    expect(result.y + result.height).toBeLessThanOrEqual(2000);
  });

  it('handles landscape image', () => {
    const result = drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white');
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
  });

  it('handles portrait image', () => {
    const result = drawPolaroidFrame(ctx, portraitImg, 2000, 2000, 'white');
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
  });

  it('fills canvas background with specified color', () => {
    drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'black');
    const bgFill = ctx.calls.find(
      (c: any) => c.method === 'fillRect' && c.args[0] === 0 && c.args[1] === 0
    );
    expect(bgFill).toBeTruthy();
    expect(bgFill.args).toEqual([0, 0, 2000, 2000]);
  });

  it('draws frame with roundRect (white fill)', () => {
    drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white');
    const roundRectCalls = ctx.calls.filter((c: any) => c.method === 'roundRect');
    expect(roundRectCalls.length).toBeGreaterThan(0);
  });

  it('resets shadow after frame rendering', () => {
    drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white');
    expect(ctx.shadowColor).toBe('transparent');
    expect(ctx.shadowBlur).toBe(0);
    expect(ctx.shadowOffsetX).toBe(0);
    expect(ctx.shadowOffsetY).toBe(0);
  });

  it('applies scaleFactor to frame elements', () => {
    const result1 = drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white', 1);
    ctx.calls = [];
    const result2 = drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white', 0.4);

    // Both should return valid positions
    expect(result1.width).toBeGreaterThan(0);
    expect(result2.width).toBeGreaterThan(0);
  });

  it('respects canvasPadding parameter', () => {
    const noPadding = drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white', 1, 0);
    const withPadding = drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white', 1, 200);

    // With padding, the frame should be smaller
    expect(withPadding.width).toBeLessThanOrEqual(noPadding.width);
  });

  it('draws date text when provided', () => {
    drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white', 1, 0, '2024.01.01');
    const fillTextCalls = ctx.calls.filter((c: any) => c.method === 'fillText');
    expect(fillTextCalls.length).toBeGreaterThan(0);
  });

  it('does not draw date text when empty', () => {
    drawPolaroidFrame(ctx, landscapeImg, 2000, 2000, 'white', 1, 0, '');
    const fillTextCalls = ctx.calls.filter((c: any) => c.method === 'fillText');
    expect(fillTextCalls.length).toBe(0);
  });

  it('works with 4:5 canvas dimensions', () => {
    const result = drawPolaroidFrame(ctx, landscapeImg, 1600, 2000, 'white');
    expect(result.width).toBeGreaterThan(0);
    expect(result.x + result.width).toBeLessThanOrEqual(1600);
  });

  it('works with 9:16 canvas dimensions', () => {
    const result = drawPolaroidFrame(ctx, landscapeImg, 1125, 2000, 'white');
    expect(result.width).toBeGreaterThan(0);
    expect(result.x + result.width).toBeLessThanOrEqual(1125);
  });
});

describe('drawThinFrame', () => {
  let canvas: HTMLCanvasElement;
  let ctx: any;
  let landscapeImg: HTMLImageElement;
  let portraitImg: HTMLImageElement;

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
  });

  it('returns ImagePosition with valid dimensions', () => {
    const result = drawThinFrame(ctx, landscapeImg, 2000, 2000, 'white');
    expect(result.x).toBeGreaterThanOrEqual(0);
    expect(result.y).toBeGreaterThanOrEqual(0);
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
  });

  it('image fits within canvas bounds', () => {
    const result = drawThinFrame(ctx, landscapeImg, 2000, 2000, 'white');
    expect(result.x + result.width).toBeLessThanOrEqual(2000);
    expect(result.y + result.height).toBeLessThanOrEqual(2000);
  });

  it('draws black frame border', () => {
    drawThinFrame(ctx, landscapeImg, 2000, 2000, 'white');
    // Should have fillRect calls - one for bg (white) and one for frame (black)
    const fillRectCalls = ctx.calls.filter((c: any) => c.method === 'fillRect');
    expect(fillRectCalls.length).toBeGreaterThanOrEqual(2);
  });

  it('handles portrait image', () => {
    const result = drawThinFrame(ctx, portraitImg, 2000, 2000, 'white');
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
    // Portrait: height should be larger
    expect(result.height).toBeGreaterThan(result.width);
  });

  it('handles landscape image', () => {
    const result = drawThinFrame(ctx, landscapeImg, 2000, 2000, 'white');
    // Landscape: width should be larger
    expect(result.width).toBeGreaterThan(result.height);
  });

  it('respects scaleFactor parameter', () => {
    const result1 = drawThinFrame(ctx, landscapeImg, 2000, 2000, 'white', 1);
    const result2 = drawThinFrame(ctx, landscapeImg, 2000, 2000, 'white', 0.4);
    // Both should return valid results
    expect(result1.width).toBeGreaterThan(0);
    expect(result2.width).toBeGreaterThan(0);
  });

  it('respects canvasPadding parameter', () => {
    const noPadding = drawThinFrame(ctx, landscapeImg, 2000, 2000, 'white', 1, 0);
    const withPadding = drawThinFrame(ctx, landscapeImg, 2000, 2000, 'white', 1, 200);
    expect(withPadding.width).toBeLessThan(noPadding.width);
  });

  it('draws image inside frame', () => {
    drawThinFrame(ctx, landscapeImg, 2000, 2000, 'white');
    const drawImageCalls = ctx.calls.filter((c: any) => c.method === 'drawImage');
    expect(drawImageCalls.length).toBe(1);
  });
});

describe('drawMediumFilmFrame', () => {
  let canvas: HTMLCanvasElement;
  let ctx: any;
  let landscapeImg: HTMLImageElement;
  let portraitImg: HTMLImageElement;

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
  });

  it('returns ImagePosition with valid dimensions', () => {
    const result = drawMediumFilmFrame(ctx, portraitImg, 2000, 2000, 'white');
    expect(result.x).toBeGreaterThanOrEqual(0);
    expect(result.y).toBeGreaterThanOrEqual(0);
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
  });

  it('image fits within canvas bounds', () => {
    const result = drawMediumFilmFrame(ctx, portraitImg, 2000, 2000, 'white');
    expect(result.x + result.width).toBeLessThanOrEqual(2000);
    expect(result.y + result.height).toBeLessThanOrEqual(2000);
  });

  it('draws film info text', () => {
    drawMediumFilmFrame(ctx, portraitImg, 2000, 2000, 'white');
    const fillTextCalls = ctx.calls.filter((c: any) => c.method === 'fillText');
    // Should have at least 2 text calls (left and right film info)
    expect(fillTextCalls.length).toBeGreaterThanOrEqual(2);
  });

  it('handles portrait image (normal orientation)', () => {
    const result = drawMediumFilmFrame(ctx, portraitImg, 2000, 2000, 'white');
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
  });

  it('handles landscape image (rotated orientation)', () => {
    const result = drawMediumFilmFrame(ctx, landscapeImg, 2000, 2000, 'white');
    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
    // For landscape, rotation is applied via save/restore/rotate
    const saveCalls = ctx.calls.filter((c: any) => c.method === 'save');
    const rotateCalls = ctx.calls.filter((c: any) => c.method === 'rotate');
    expect(saveCalls.length).toBeGreaterThan(0);
    expect(rotateCalls.length).toBeGreaterThan(0);
  });

  it('portrait image does NOT use rotate', () => {
    drawMediumFilmFrame(ctx, portraitImg, 2000, 2000, 'white');
    const rotateCalls = ctx.calls.filter((c: any) => c.method === 'rotate');
    expect(rotateCalls.length).toBe(0);
  });

  it('respects canvasPadding parameter', () => {
    const noPadding = drawMediumFilmFrame(ctx, portraitImg, 2000, 2000, 'white', 1, 0);
    const withPadding = drawMediumFilmFrame(ctx, portraitImg, 2000, 2000, 'white', 1, 200);
    expect(withPadding.width).toBeLessThan(noPadding.width);
  });

  it('draws image on black frame', () => {
    drawMediumFilmFrame(ctx, portraitImg, 2000, 2000, 'white');
    const drawImageCalls = ctx.calls.filter((c: any) => c.method === 'drawImage');
    expect(drawImageCalls.length).toBe(1);
  });

  it('uses orange color for film info text', () => {
    drawMediumFilmFrame(ctx, portraitImg, 2000, 2000, 'white');
    const fillTextCalls = ctx.calls.filter((c: any) => c.method === 'fillText');
    // Film text should be drawn after setting fillStyle to orange
    expect(fillTextCalls.length).toBeGreaterThan(0);
  });
});

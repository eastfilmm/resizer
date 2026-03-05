import { describe, it, expect, beforeEach } from 'vitest';
import { resetCanvas } from '@/utils/canvas';
import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  CANVAS_ACTUAL_SIZE_4_5_WIDTH,
  CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
  CANVAS_ACTUAL_SIZE_9_16_WIDTH,
  CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
} from '@/constants/CanvasContents';

describe('resetCanvas', () => {
  let canvas: HTMLCanvasElement;
  let ctx: any;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    ctx.calls = []; // Reset call tracking
  });

  it('sets canvas to default 1:1 actual dimensions when no options given', () => {
    resetCanvas(canvas, 'white');
    expect(canvas.width).toBe(CANVAS_ACTUAL_SIZE);
    expect(canvas.height).toBe(CANVAS_ACTUAL_SIZE);
  });

  it('sets canvas display size to 320px by default', () => {
    resetCanvas(canvas, 'white');
    expect(canvas.style.width).toBe(`${CANVAS_DISPLAY_SIZE}px`);
    expect(canvas.style.height).toBe(`${CANVAS_DISPLAY_SIZE}px`);
  });

  it('fills canvas with white background by default', () => {
    resetCanvas(canvas);
    expect(ctx.fillStyle).toBe('white');
    const fillRectCall = ctx.calls.find((c: any) => c.method === 'fillRect');
    expect(fillRectCall).toBeTruthy();
    expect(fillRectCall.args).toEqual([0, 0, CANVAS_ACTUAL_SIZE, CANVAS_ACTUAL_SIZE]);
  });

  it('fills canvas with black background when specified', () => {
    resetCanvas(canvas, 'black');
    expect(ctx.fillStyle).toBe('black');
  });

  it('uses 4:5 dimensions when aspectRatio option is 4:5', () => {
    resetCanvas(canvas, 'white', { aspectRatio: '4:5' });
    expect(canvas.width).toBe(CANVAS_ACTUAL_SIZE_4_5_WIDTH);
    expect(canvas.height).toBe(CANVAS_ACTUAL_SIZE_4_5_HEIGHT);
  });

  it('uses 9:16 dimensions when aspectRatio option is 9:16', () => {
    resetCanvas(canvas, 'white', { aspectRatio: '9:16' });
    expect(canvas.width).toBe(CANVAS_ACTUAL_SIZE_9_16_WIDTH);
    expect(canvas.height).toBe(CANVAS_ACTUAL_SIZE_9_16_HEIGHT);
  });

  it('respects custom displaySize option', () => {
    resetCanvas(canvas, 'white', { displaySize: 500 });
    expect(canvas.style.width).toBe('500px');
    expect(canvas.style.height).toBe('500px');
  });

  it('fills the entire canvas with background color', () => {
    resetCanvas(canvas, 'white', { aspectRatio: '4:5' });
    const fillRectCall = ctx.calls.find((c: any) => c.method === 'fillRect');
    expect(fillRectCall.args).toEqual([
      0, 0,
      CANVAS_ACTUAL_SIZE_4_5_WIDTH,
      CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
    ]);
  });
});

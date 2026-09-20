import { describe, it, expect, beforeEach, vi } from 'vitest';
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

describe('drawGlassBlurBackground 스크래치 캔버스 재사용', () => {
  let ctx: any;
  let img: HTMLImageElement;

  beforeEach(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 2000;
    ctx = canvas.getContext('2d');
    ctx.calls = [];

    img = new Image();
    Object.defineProperty(img, 'width', { value: 800, writable: true });
    Object.defineProperty(img, 'height', { value: 600, writable: true });
  });

  const countCreatedCanvases = (fn: () => void) => {
    const original = document.createElement.bind(document);
    let created = 0;
    const spy = vi.spyOn(document, 'createElement').mockImplementation(((
      tag: string,
      ...rest: unknown[]
    ) => {
      if (tag === 'canvas') created += 1;
      return original(tag, ...(rest as []));
    }) as typeof document.createElement);

    try {
      fn();
    } finally {
      spy.mockRestore();
    }
    return created;
  };

  // 드래그 중에는 초당 수십 번 호출된다. 매번 할당하면 2000px 기준 프레임당 약 40MB가 샌다.
  it('반복 호출해도 캔버스를 새로 만들지 않는다', () => {
    // 첫 호출로 스크래치 캔버스를 준비시킨다.
    drawGlassBlurBackground(ctx, img, 2000, 2000, 30, 'white', 0.3, false);

    const created = countCreatedCanvases(() => {
      for (let i = 0; i < 20; i += 1) {
        drawGlassBlurBackground(ctx, img, 2000, 2000, 30, 'white', 0.3, false);
      }
    });

    expect(created).toBe(0);
  });

  it('Safari 경로에서도 캔버스를 새로 만들지 않는다', () => {
    drawGlassBlurBackground(ctx, img, 800, 800, 12, 'white', 0.3, true);

    const created = countCreatedCanvases(() => {
      for (let i = 0; i < 20; i += 1) {
        drawGlassBlurBackground(ctx, img, 800, 800, 12, 'white', 0.3, true);
      }
    });

    expect(created).toBe(0);
  });

  it('크기나 강도가 바뀌어도 캔버스를 새로 만들지 않는다', () => {
    drawGlassBlurBackground(ctx, img, 2000, 2000, 30, 'white', 0.3, false);

    const created = countCreatedCanvases(() => {
      drawGlassBlurBackground(ctx, img, 800, 800, 10, 'white', 0.3, false);
      drawGlassBlurBackground(ctx, img, 1200, 1500, 55, 'black', 0.5, false);
    });

    expect(created).toBe(0);
  });

  // 블러는 가장자리를 반투명하게 만들기 때문에, 지우지 않으면 이전 프레임이 비쳐 보인다.
  it('재사용 전에 스크래치 캔버스를 지운다', async () => {
    // 스크래치 캔버스는 모듈 스코프에 캐시되므로, 새로 만들어지는 순간을 잡으려면
    // 모듈을 다시 로드해야 한다.
    vi.resetModules();

    const scratchCanvases: HTMLCanvasElement[] = [];
    const original = document.createElement.bind(document);
    const spy = vi
      .spyOn(document, 'createElement')
      .mockImplementation(((tag: string, ...rest: unknown[]) => {
        const el = original(tag, ...(rest as []));
        if (tag === 'canvas') scratchCanvases.push(el as HTMLCanvasElement);
        return el;
      }) as typeof document.createElement);

    const { drawGlassBlurBackground: freshDraw } = await import('@/utils/canvas/effects');

    // 1회차: 스크래치 캔버스 생성 + 사용
    freshDraw(ctx, img, 500, 500, 8, 'white', 0.3, false);
    // 2회차: 재사용되는 경로. 여기서 clearRect가 없으면 잔상이 남는다.
    scratchCanvases.forEach((c) => {
      ((c.getContext('2d') as any).calls as unknown[]).length = 0;
    });
    freshDraw(ctx, img, 500, 500, 8, 'white', 0.3, false);

    spy.mockRestore();

    expect(scratchCanvases.length).toBe(2); // temp + blur
    for (const c of scratchCanvases) {
      const calls = (c.getContext('2d') as any).calls as { method: string }[];
      expect(calls.some((call) => call.method === 'clearRect')).toBe(true);
    }
  });
});

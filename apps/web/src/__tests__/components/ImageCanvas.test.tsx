import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act, cleanup } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { createRef, type RefObject } from 'react';
import ImageCanvas from '@/components/ImageCanvas';
import {
  imageSettingsAtom,
  uploadedImagesAtom,
  selectedImageIdAtom,
  DEFAULT_IMAGE_SETTINGS,
  type AspectRatio,
  type ImageSettings,
} from '@/atoms/imageAtoms';
import {
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  CANVAS_DISPLAY_SIZE_DESKTOP,
  CANVAS_PREVIEW_SIZE,
  CANVAS_PREVIEW_SIZE_DESKTOP,
} from '@/constants/CanvasContents';
import { MockImage } from '../setup';

// drawImageWithEffects만 spy로 감싸고 나머지 캔버스 유틸은 실제 구현을 쓴다.
vi.mock('@/utils/canvas', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/canvas')>();
  return { ...actual, drawImageWithEffects: vi.fn(actual.drawImageWithEffects) };
});

const { drawImageWithEffects } = await import('@/utils/canvas');
const drawSpy = vi.mocked(drawImageWithEffects);

const OBJECT_URL = 'blob:test-image';

type RenderOptions = {
  isSafari?: boolean;
  isDesktop?: boolean;
  aspectRatio?: AspectRatio;
  settings?: Partial<ImageSettings>;
  withImage?: boolean;
};

const setup = async ({
  isSafari = false,
  isDesktop = false,
  aspectRatio = '1:1',
  settings,
  withImage = true,
}: RenderOptions = {}) => {
  const store = createStore();
  store.set(imageSettingsAtom, {
    ...DEFAULT_IMAGE_SETTINGS,
    canvasAspectRatio: aspectRatio,
    ...settings,
  });

  if (withImage) {
    store.set(uploadedImagesAtom, [
      { id: 'img-1', fileName: 'photo.jpg', objectUrl: OBJECT_URL },
    ]);
    store.set(selectedImageIdAtom, 'img-1');
  }

  const canvasRef = createRef<HTMLCanvasElement>() as RefObject<HTMLCanvasElement | null>;

  const view = render(
    <Provider store={store}>
      <ImageCanvas canvasRef={canvasRef} isSafari={isSafari} isDesktop={isDesktop} />
    </Provider>,
  );

  // MockImage는 onload를 setTimeout(0)으로 발화시킨다.
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  const rerender = (next: { isSafari?: boolean; isDesktop?: boolean }) =>
    act(() => {
      view.rerender(
        <Provider store={store}>
          <ImageCanvas
            canvasRef={canvasRef}
            isSafari={next.isSafari ?? isSafari}
            isDesktop={next.isDesktop ?? isDesktop}
          />
        </Provider>,
      );
    });

  return { store, canvasRef, rerender };
};

const lastDrawOptions = () => {
  expect(drawSpy).toHaveBeenCalled();
  return drawSpy.mock.calls[drawSpy.mock.calls.length - 1][2];
};

beforeEach(() => {
  vi.stubGlobal('Image', MockImage);
  drawSpy.mockClear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ImageCanvas 프리뷰 해상도', () => {
  it('모바일에서는 1:1 프리뷰를 800px로 렌더한다', async () => {
    const { canvasRef } = await setup({ isDesktop: false });

    expect(canvasRef.current?.width).toBe(CANVAS_PREVIEW_SIZE);
    expect(canvasRef.current?.height).toBe(CANVAS_PREVIEW_SIZE);
  });

  it('데스크톱에서는 1:1 프리뷰를 1200px로 렌더한다', async () => {
    const { canvasRef } = await setup({ isDesktop: true });

    expect(canvasRef.current?.width).toBe(CANVAS_PREVIEW_SIZE_DESKTOP);
    expect(canvasRef.current?.height).toBe(CANVAS_PREVIEW_SIZE_DESKTOP);
  });

  // 이번 변경의 핵심: 해상도가 더 이상 isSafari에 좌우되지 않는다.
  it.each([
    ['모바일', false, CANVAS_PREVIEW_SIZE],
    ['데스크톱', true, CANVAS_PREVIEW_SIZE_DESKTOP],
  ])('%s에서 isSafari 여부와 무관하게 같은 해상도를 쓴다', async (_label, isDesktop, expected) => {
    const safari = await setup({ isSafari: true, isDesktop });
    expect(safari.canvasRef.current?.width).toBe(expected);
    cleanup();

    const nonSafari = await setup({ isSafari: false, isDesktop });
    expect(nonSafari.canvasRef.current?.width).toBe(expected);
  });

  it('어떤 환경에서도 풀 해상도(2000px)로 프리뷰를 그리지 않는다', async () => {
    for (const isSafari of [true, false]) {
      for (const isDesktop of [true, false]) {
        const { canvasRef } = await setup({ isSafari, isDesktop });
        expect(canvasRef.current!.height).toBeLessThan(CANVAS_ACTUAL_SIZE);
        cleanup();
      }
    }
  });

  it.each([
    ['4:5', false, 640, 800],
    ['4:5', true, 960, 1200],
    ['9:16', false, 450, 800],
    ['9:16', true, 675, 1200],
  ] as const)('%s 비율을 유지한다 (desktop=%s)', async (aspectRatio, isDesktop, width, height) => {
    const { canvasRef } = await setup({ aspectRatio, isDesktop });

    expect(canvasRef.current?.width).toBe(width);
    expect(canvasRef.current?.height).toBe(height);
  });

  it('CSS 표시 크기는 프리뷰 해상도와 무관하게 유지된다', async () => {
    const mobile = await setup({ isDesktop: false });
    expect(mobile.canvasRef.current?.style.width).toBe(`${CANVAS_DISPLAY_SIZE}px`);
    cleanup();

    const desktop = await setup({ isDesktop: true });
    expect(desktop.canvasRef.current?.style.width).toBe(`${CANVAS_DISPLAY_SIZE_DESKTOP}px`);
  });
});

describe('ImageCanvas 설정값 환산', () => {
  const settings = { padding: 100, blurIntensity: 50, shadowIntensity: 40, shadowOffset: 20 };

  it.each([
    ['모바일', false, 0.4],
    ['데스크톱', true, 0.6],
  ])('%s에서 padding·blur·shadow에 프리뷰 배율(%s)을 적용한다', async (_label, isDesktop, scale) => {
    await setup({ isDesktop, settings });

    const options = lastDrawOptions();
    expect(options.scaleFactor).toBe(scale);
    expect(options.padding).toBe(settings.padding * scale);
    expect(options.blurIntensity).toBe(settings.blurIntensity * scale);
    expect(options.shadowIntensity).toBe(settings.shadowIntensity * scale);
    expect(options.shadowOffset).toBe(settings.shadowOffset * scale);
  });

  it('환산된 padding을 기준으로 이미지 영역을 계산한다', async () => {
    await setup({ isDesktop: false, settings });

    const options = lastDrawOptions();
    const expectedPadding = settings.padding * 0.4;
    expect(options.imageAreaWidth).toBe(CANVAS_PREVIEW_SIZE - expectedPadding * 2);
    expect(options.imageAreaHeight).toBe(CANVAS_PREVIEW_SIZE - expectedPadding * 2);
  });

  it('isSafari는 블러 구현 선택용으로 계속 전달된다', async () => {
    await setup({ isSafari: true });
    expect(lastDrawOptions().isSafari).toBe(true);
    cleanup();

    drawSpy.mockClear();
    await setup({ isSafari: false });
    expect(lastDrawOptions().isSafari).toBe(false);
  });
});

describe('ImageCanvas 재드로우 배선', () => {
  it('설정이 바뀌면 다시 그린다', async () => {
    const { store } = await setup();
    const before = drawSpy.mock.calls.length;

    await act(async () => {
      store.set(imageSettingsAtom, (prev) => ({ ...prev, padding: 80 }));
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    });

    expect(drawSpy.mock.calls.length).toBeGreaterThan(before);
    expect(lastDrawOptions().padding).toBe(80 * 0.4);
  });

  // useIsDesktop은 마운트 후에 false -> true로 뒤집힌다. 그때 캔버스가 재생성되고
  // 다시 그려지지 않으면 데스크톱에서 빈 캔버스가 남는다.
  it('isDesktop이 뒤집히면 캔버스를 다시 만들고 다시 그린다', async () => {
    const { canvasRef, rerender } = await setup({ isDesktop: false });
    expect(canvasRef.current?.width).toBe(CANVAS_PREVIEW_SIZE);

    const before = drawSpy.mock.calls.length;
    await act(async () => {
      rerender({ isDesktop: true });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(canvasRef.current?.width).toBe(CANVAS_PREVIEW_SIZE_DESKTOP);
    expect(canvasRef.current?.style.width).toBe(`${CANVAS_DISPLAY_SIZE_DESKTOP}px`);
    expect(drawSpy.mock.calls.length).toBeGreaterThan(before);
    expect(lastDrawOptions().actualCanvasWidth).toBe(CANVAS_PREVIEW_SIZE_DESKTOP);
  });

  it('이미지가 없으면 프리뷰 크기 캔버스를 배경색으로만 채운다', async () => {
    const { canvasRef } = await setup({ withImage: false, isDesktop: true });

    expect(canvasRef.current?.width).toBe(CANVAS_PREVIEW_SIZE_DESKTOP);
    expect(drawSpy).not.toHaveBeenCalled();
  });
});

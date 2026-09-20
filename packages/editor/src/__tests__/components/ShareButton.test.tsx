import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, createStore } from 'jotai';
import { ShareButton } from '../../components/ShareButton';
import { PlatformProvider, type Platform, type RenderedImage } from '../../platform';
import { uploadedImagesAtom, type UploadedImage } from '../../atoms/imageAtoms';

/**
 * 공유는 네이티브가 있으면 그쪽으로, 없으면 Web Share API로 간다.
 * 둘 다 없으면 버튼 자체를 숨긴다 — 눌러도 아무 일이 없는 버튼을 두지 않기 위해서다.
 */

vi.mock('../../utils/renderCanvasImage', () => ({
  renderImageToCanvas: vi.fn(async () => document.createElement('canvas')),
  renderImageToBlob: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
  canvasToBlob: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
}));

const image = (i = 0): UploadedImage => ({ id: `id-${i}`, fileName: `f${i}.jpg`, objectUrl: `blob:${i}` });

const nativePlatform = (): Platform & { shared: RenderedImage[] } => {
  const shared: RenderedImage[] = [];
  return {
    shared,
    isNativeAvailable: () => true,
    saveImagesNatively: async () => {},
    shareImageNatively: async (item) => {
      shared.push(item);
    },
  };
};

const browserPlatform = (): Platform => ({
  isNativeAvailable: () => false,
  saveImagesNatively: async () => {},
  shareImageNatively: async () => {},
});

const setup = (images: UploadedImage[], platform: Platform) => {
  const store = createStore();
  store.set(uploadedImagesAtom, images);
  render(
    <Provider store={store}>
      <PlatformProvider value={platform}>
        <ShareButton />
      </PlatformProvider>
    </Provider>,
  );
  return screen.queryByRole('button');
};

afterEach(() => {
  Reflect.deleteProperty(navigator, 'share');
  vi.restoreAllMocks();
  cleanup();
});

const stubWebShare = (impl: (data: ShareData) => Promise<void>) => {
  const share = vi.fn(impl);
  Object.defineProperty(navigator, 'share', { value: share, configurable: true, writable: true });
  return share;
};

describe('ShareButton', () => {
  it('이미지가 없으면 버튼을 그리지 않는다', () => {
    expect(setup([], nativePlatform())).toBeNull();
  });

  it('공유 수단이 하나도 없으면 버튼을 그리지 않는다', () => {
    expect(setup([image()], browserPlatform())).toBeNull();
  });

  it('네이티브가 가능하면 버튼을 그린다', () => {
    expect(setup([image()], nativePlatform())).not.toBeNull();
  });

  it('Web Share만 가능해도 버튼을 그린다', () => {
    stubWebShare(async () => {});
    expect(setup([image()], browserPlatform())).not.toBeNull();
  });

  it('네이티브가 가능하면 그쪽으로 넘긴다', async () => {
    const platform = nativePlatform();
    await userEvent.click(setup([image()], platform)!);

    await waitFor(() => expect(platform.shared).toHaveLength(1));
    expect(platform.shared[0].fileName).toBe('insta-frame.png');
  });

  it('여러 장이어도 네이티브로는 첫 장만 공유한다', async () => {
    const platform = nativePlatform();
    await userEvent.click(setup([image(0), image(1), image(2)], platform)!);

    await waitFor(() => expect(platform.shared).toHaveLength(1));
  });

  it('네이티브가 없으면 Web Share로 파일을 넘긴다', async () => {
    const share = stubWebShare(async () => {});
    await userEvent.click(setup([image(0), image(1)], browserPlatform())!);

    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    const files = share.mock.calls[0][0].files as File[];
    expect(files.map((f) => f.name)).toEqual(['photo-1.png', 'photo-2.png']);
    expect(files[0].type).toBe('image/png');
  });

  // 사용자가 공유 시트를 닫으면 navigator.share가 reject한다. 취소는 오류가 아니다.
  it('사용자가 공유 시트를 닫아도 오류를 내지 않는다', async () => {
    stubWebShare(async () => {
      throw new DOMException('Share canceled', 'AbortError');
    });

    const button = setup([image()], browserPlatform())!;
    await expect(userEvent.click(button)).resolves.not.toThrow();
  });
});

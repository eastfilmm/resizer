import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, createStore } from 'jotai';
import { DownloadButton } from '../../components/DownloadButton';
import { PlatformProvider, type Platform, type RenderedImage } from '../../platform';
import { uploadedImagesAtom, type UploadedImage } from '../../atoms/imageAtoms';

/**
 * 다운로드는 사용자가 결과물을 실제로 받는 유일한 출구다.
 * 네이티브 주입이 있으면 그쪽으로 넘기고, 없으면 브라우저 폴백(한 장은 그대로,
 * 여러 장은 zip)을 탄다. 이 분기가 깨지면 버튼을 눌러도 아무 일이 없다.
 */

// 실제 캔버스 렌더는 여기서 관심사가 아니다. 파일명과 분기만 본다.
vi.mock('../../utils/renderCanvasImage', () => ({
  renderImageToCanvas: vi.fn(async () => document.createElement('canvas')),
  canvasToBlob: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
  renderImageToBlob: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
}));

const image = (fileName: string, i = 0): UploadedImage => ({
  id: `id-${i}`,
  fileName,
  objectUrl: `blob:${i}`,
});

const nativePlatform = (): Platform & { saved: RenderedImage[][] } => {
  const saved: RenderedImage[][] = [];
  return {
    saved,
    isNativeAvailable: () => true,
    saveImagesNatively: async (images) => {
      saved.push(images);
    },
    shareImageNatively: async () => {},
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
        <DownloadButton />
      </PlatformProvider>
    </Provider>,
  );
  return screen.getByRole('button');
};

/** 브라우저 폴백이 만든 <a download>를 가로챈다 */
const captureAnchorClicks = () => {
  const clicks: { download: string; href: string }[] = [];
  const realCreate = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
    const el = realCreate(tag);
    if (tag === 'a') {
      el.click = () => clicks.push({ download: (el as HTMLAnchorElement).download, href: (el as HTMLAnchorElement).href });
    }
    return el;
  }) as typeof document.createElement);
  return clicks;
};

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => 'blob:download');
  URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe('DownloadButton', () => {
  it('이미지가 없으면 비활성이다', () => {
    expect(setup([], browserPlatform())).toBeDisabled();
  });

  it('이미지가 있으면 활성이다', () => {
    expect(setup([image('a.jpg')], browserPlatform())).toBeEnabled();
  });

  it('네이티브가 가능하면 그쪽으로 넘긴다', async () => {
    const platform = nativePlatform();
    const button = setup([image('a.jpg', 0), image('b.png', 1)], platform);

    await userEvent.click(button);

    await waitFor(() => expect(platform.saved).toHaveLength(1));
    expect(platform.saved[0]).toHaveLength(2);
  });

  it('네이티브 경로에서는 브라우저 다운로드를 만들지 않는다', async () => {
    const clicks = captureAnchorClicks();
    const button = setup([image('a.jpg')], nativePlatform());

    await userEvent.click(button);

    await waitFor(() => expect(clicks).toHaveLength(0));
  });

  it('브라우저에서 한 장이면 png로 바로 내려받는다', async () => {
    const clicks = captureAnchorClicks();
    const button = setup([image('sunset.jpg')], browserPlatform());

    await userEvent.click(button);

    await waitFor(() => expect(clicks).toHaveLength(1));
    expect(clicks[0].download).toBe('sunset.png');
  });

  it('브라우저에서 여러 장이면 zip으로 묶는다', async () => {
    const clicks = captureAnchorClicks();
    const button = setup([image('a.jpg', 0), image('b.jpg', 1)], browserPlatform());

    await userEvent.click(button);

    await waitFor(() => expect(clicks).toHaveLength(1));
    expect(clicks[0].download).toMatch(/^resized-images-\d+\.zip$/);
  });

  it('확장자를 png로 바꾼다', async () => {
    const platform = nativePlatform();
    await userEvent.click(setup([image('photo.jpeg')], platform));

    await waitFor(() => expect(platform.saved[0][0].fileName).toBe('photo.png'));
  });

  it('파일명의 특수문자를 하이픈으로 정리한다', async () => {
    const platform = nativePlatform();
    await userEvent.click(setup([image('내 사진 (1).jpg')], platform));

    await waitFor(() => expect(platform.saved[0][0].fileName).toBe('1.png'));
  });

  it('쓸 수 있는 글자가 없으면 순번으로 이름을 만든다', async () => {
    const platform = nativePlatform();
    await userEvent.click(setup([image('   ')], platform));

    await waitFor(() => expect(platform.saved[0][0].fileName).toBe('image-1.png'));
  });

  it('여러 장의 순서를 유지한다', async () => {
    const platform = nativePlatform();
    await userEvent.click(
      setup([image('first.jpg', 0), image('second.jpg', 1), image('third.jpg', 2)], platform),
    );

    await waitFor(() => expect(platform.saved[0].map((r) => r.fileName)).toEqual([
      'first.png',
      'second.png',
      'third.png',
    ]));
  });
});

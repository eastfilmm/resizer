import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CANVAS_ACTUAL_SIZE } from '@resizer/canvas';
import { MockImage } from '../setup';
import {
  loadEditableImage,
  releaseEditableImage,
  releaseAllEditableImages,
  getEditableImageCacheSize,
} from '../../utils/imageSource';

/** 지정한 크기로 디코드되는 이미지를 흉내낸다. */
const stubImageSize = (width: number, height: number) => {
  class SizedImage extends MockImage {
    constructor() {
      super();
      this.width = width;
      this.height = height;
    }
  }
  vi.stubGlobal('Image', SizedImage);
};

beforeEach(() => {
  releaseAllEditableImages();
  stubImageSize(100, 100);
});

afterEach(() => {
  releaseAllEditableImages();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('loadEditableImage', () => {
  // 같은 사진을 메인 캔버스 1 + 썸네일 최대 5 + 다운로드 1이 쓴다.
  // 각자 디코드하면 아이폰 사진 한 장당 약 48MB가 여러 벌 상주한다.
  it('같은 URL은 한 번만 디코드하고 같은 인스턴스를 돌려준다', async () => {
    let decodes = 0;
    class CountingImage extends MockImage {
      constructor() {
        super();
        decodes += 1;
      }
    }
    vi.stubGlobal('Image', CountingImage);

    const first = await loadEditableImage('blob:same');
    const second = await loadEditableImage('blob:same');
    const third = await loadEditableImage('blob:same');

    expect(decodes).toBe(1);
    expect(second).toBe(first);
    expect(third).toBe(first);
  });

  it('동시에 요청해도 디코드는 한 번이다', async () => {
    let decodes = 0;
    class CountingImage extends MockImage {
      constructor() {
        super();
        decodes += 1;
      }
    }
    vi.stubGlobal('Image', CountingImage);

    const [a, b, c] = await Promise.all([
      loadEditableImage('blob:race'),
      loadEditableImage('blob:race'),
      loadEditableImage('blob:race'),
    ]);

    expect(decodes).toBe(1);
    expect(b).toBe(a);
    expect(c).toBe(a);
  });

  it('렌더 최대 크기(2000px)보다 큰 원본은 줄인다', async () => {
    stubImageSize(4032, 3024); // 아이폰 12MP 가로 사진

    const canvas = await loadEditableImage('blob:big');

    expect(Math.max(canvas.width, canvas.height)).toBe(CANVAS_ACTUAL_SIZE);
    // 비율 보존: 4032/3024 = 4/3
    expect(canvas.width / canvas.height).toBeCloseTo(4032 / 3024, 2);
  });

  it('세로 사진도 긴 변을 기준으로 줄인다', async () => {
    stubImageSize(3024, 4032);

    const canvas = await loadEditableImage('blob:portrait');

    expect(canvas.height).toBe(CANVAS_ACTUAL_SIZE);
    expect(canvas.width).toBe(1500);
  });

  it('작은 원본은 확대하지 않는다', async () => {
    stubImageSize(640, 480);

    const canvas = await loadEditableImage('blob:small');

    expect(canvas.width).toBe(640);
    expect(canvas.height).toBe(480);
  });
});

describe('캐시 해제', () => {
  it('releaseEditableImage는 해당 항목만 비운다', async () => {
    await loadEditableImage('blob:a');
    await loadEditableImage('blob:b');
    expect(getEditableImageCacheSize()).toBe(2);

    releaseEditableImage('blob:a');

    expect(getEditableImageCacheSize()).toBe(1);
  });

  it('해제하면 백킹스토어를 0으로 줄여 메모리를 돌려준다', async () => {
    stubImageSize(4032, 3024);
    const canvas = await loadEditableImage('blob:release');
    expect(canvas.width).toBeGreaterThan(0);

    releaseEditableImage('blob:release');

    expect(canvas.width).toBe(0);
    expect(canvas.height).toBe(0);
  });

  it('해제 후 다시 요청하면 새로 디코드한다', async () => {
    const first = await loadEditableImage('blob:again');
    releaseEditableImage('blob:again');
    const second = await loadEditableImage('blob:again');

    expect(second).not.toBe(first);
  });

  it('releaseAllEditableImages는 전부 비운다', async () => {
    await loadEditableImage('blob:1');
    await loadEditableImage('blob:2');
    await loadEditableImage('blob:3');

    releaseAllEditableImages();

    expect(getEditableImageCacheSize()).toBe(0);
  });
});

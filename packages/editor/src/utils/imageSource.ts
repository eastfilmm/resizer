import { CANVAS_ACTUAL_SIZE } from '@resizer/canvas';

/**
 * 편집용 이미지 소스 — 한 번만 디코드하고, 축소해서, 공유한다.
 *
 * 예전에는 업로드한 원본 objectUrl을 그대로 들고 다니면서 필요한 곳마다
 * `new Image()`로 디코드했다. 소비자가 메인 캔버스 1 + 썸네일 최대 5 +
 * 다운로드 1이라, 아이폰 사진(4032x3024) 한 장이면 디코드된 비트맵이
 * 약 48MB씩 여러 벌 상주했다. 5장을 올리면 수백 MB가 되어 iOS에서
 * 탭이 통째로 날아갔다.
 *
 * 렌더 타깃이 최대 2000px이므로 그보다 큰 원본은 화질 손실 없이 줄일 수 있다.
 * 업로드 시점에 한 번 디코드·축소해 캔버스로 캐시하고, 모든 소비자가 그
 * 한 벌을 공유한다.
 */

/** 다운로드가 2000px로 렌더하므로 그보다 큰 소스는 쓸모가 없다. */
const MAX_SOURCE_SIZE = CANVAS_ACTUAL_SIZE;

const cache = new Map<string, HTMLCanvasElement>();
const inFlight = new Map<string, Promise<HTMLCanvasElement>>();

const decodeAndDownscale = async (objectUrl: string): Promise<HTMLCanvasElement> => {
  const img = new Image();

  // 핸들러를 먼저 붙인다. src를 먼저 넣으면 이미 캐시된 이미지에서
  // load 이벤트가 핸들러 등록 전에 지나가 영영 resolve되지 않는다.
  const decoded = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${objectUrl}`));
  });
  img.src = objectUrl;
  await decoded;

  // 원본이 이미 작으면 확대하지 않는다.
  const scale = Math.min(1, MAX_SOURCE_SIZE / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  return canvas;
};

/**
 * 축소된 편집용 소스를 얻는다. 같은 URL은 한 번만 디코드하고,
 * 동시에 여러 번 호출해도 작업이 중복되지 않는다.
 */
export const loadEditableImage = (objectUrl: string): Promise<HTMLCanvasElement> => {
  const cached = cache.get(objectUrl);
  if (cached) return Promise.resolve(cached);

  const pending = inFlight.get(objectUrl);
  if (pending) return pending;

  const promise = decodeAndDownscale(objectUrl)
    .then((canvas) => {
      cache.set(objectUrl, canvas);
      inFlight.delete(objectUrl);
      return canvas;
    })
    .catch((error) => {
      inFlight.delete(objectUrl);
      throw error;
    });

  inFlight.set(objectUrl, promise);
  return promise;
};

/** 이미지를 목록에서 뺄 때 호출한다. 호출하지 않으면 캐시가 계속 쌓인다. */
export const releaseEditableImage = (objectUrl: string): void => {
  const canvas = cache.get(objectUrl);
  if (canvas) {
    // 크기를 0으로 만들어 백킹스토어를 바로 돌려준다.
    canvas.width = 0;
    canvas.height = 0;
    cache.delete(objectUrl);
  }
  inFlight.delete(objectUrl);
};

export const releaseAllEditableImages = (): void => {
  for (const objectUrl of [...cache.keys()]) {
    releaseEditableImage(objectUrl);
  }
};

/** 테스트용. */
export const getEditableImageCacheSize = (): number => cache.size;

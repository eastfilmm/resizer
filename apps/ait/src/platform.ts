/**
 * 플랫폼 구현 (App in Toss).
 *
 * 토스 미니앱은 이미지 파일 직접 공유를 지원하지 않으므로, 공유도 갤러리
 * 저장으로 처리한다(사용자가 인스타그램에서 저장된 이미지를 올리는 흐름).
 */
import { saveBase64Data } from '@apps-in-toss/web-framework';
import type { Platform, RenderedImage } from '@resizer/editor';

const toBase64 = (canvas: HTMLCanvasElement) =>
  canvas.toDataURL('image/png', 1.0).split(',')[1];

const save = (image: RenderedImage) =>
  saveBase64Data({
    data: toBase64(image.canvas),
    fileName: image.fileName,
    mimeType: 'image/png',
  });

export const aitPlatform: Platform = {
  isNativeAvailable: () => {
    try {
      return typeof saveBase64Data?.isSupported === 'function' && saveBase64Data.isSupported();
    } catch {
      return false;
    }
  },

  saveImagesNatively: async (images: RenderedImage[]) => {
    for (const image of images) {
      await save(image);
    }
  },

  shareImageNatively: async (image: RenderedImage) => {
    await save(image);
  },
};

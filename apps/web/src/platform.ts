/**
 * 플랫폼 구현 (web).
 *
 * web은 React Native WebView(모바일 앱) 안에서 열릴 수 있고, 그때는
 * postMessage로 네이티브에 넘긴다. 일반 브라우저에서는 사용할 수 없다.
 */
import type { Platform, RenderedImage } from '@resizer/editor';

const toDataUrl = (canvas: HTMLCanvasElement) => canvas.toDataURL('image/png', 1.0);

export const webPlatform: Platform = {
  isNativeAvailable: () => typeof window !== 'undefined' && !!window.ReactNativeWebView,

  saveImagesNatively: async (images: RenderedImage[]) => {
    const webView = window.ReactNativeWebView;
    if (!webView) return;

    webView.postMessage(
      JSON.stringify({ type: 'download', data: images.map((image) => toDataUrl(image.canvas)) }),
    );
  },

  shareImageNatively: async (image: RenderedImage) => {
    const webView = window.ReactNativeWebView;
    if (!webView) return;

    webView.postMessage(JSON.stringify({ type: 'share', data: toDataUrl(image.canvas) }));
  },
};

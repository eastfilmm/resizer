import { getBackgroundFill, type DrawImageOptions } from '@resizer/canvas';
import type { ImageSettings, UploadedImage } from '../atoms/imageAtoms';
import { resolvePolaroidDate } from './imageUtils';

interface CanvasSize {
  width: number;
  height: number;
}

/**
 * 편집 설정을 렌더러 옵션으로 옮긴다. 프리뷰·썸네일·다운로드가 모두 이 함수를 쓴다.
 *
 * 설정의 픽셀 값(여백·블러·그림자)은 2000px 풀 해상도 기준이다. 더 작은 캔버스에
 * 그릴 때는 `scale`만큼 줄여야 프리뷰와 다운로드 결과가 같은 비율로 보인다.
 * 다운로드는 scale 1.
 */
export const toDrawOptions = (
  settings: ImageSettings,
  image: Pick<UploadedImage, 'photoDate'> | null | undefined,
  canvas: CanvasSize,
  scale: number,
): DrawImageOptions => {
  const padding = settings.padding * scale;

  return {
    actualCanvasWidth: canvas.width,
    actualCanvasHeight: canvas.height,
    imageAreaWidth: canvas.width - padding * 2,
    imageAreaHeight: canvas.height - padding * 2,
    padding,
    bgColor: getBackgroundFill(settings.backgroundColor, settings.backgroundSoftness),
    useGlassBlur: settings.glassBlurEnabled,
    blurIntensity: settings.blurIntensity * scale,
    overlayOpacity: settings.overlayOpacity,
    useShadow: settings.shadowEnabled,
    shadowIntensity: settings.shadowIntensity * scale,
    shadowOffset: settings.shadowOffset * scale,
    frameType: settings.frameType,
    scaleFactor: scale,
    polaroidDate: resolvePolaroidDate(settings, image),
  };
};

import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { saveBase64Data } from '@apps-in-toss/web-framework';
import { uploadedImagesAtom, imageSettingsAtom } from '@/atoms/imageAtoms';
import { useAspectRatio } from '@/hooks/useAspectRatio';
import { IconButton, ButtonIcon } from '@/components/styled/Button';
import { renderImageToBlob, renderImageToCanvas } from '@/utils/renderCanvasImage';

// App in Toss 환경에서 기기 갤러리 저장을 지원하는지 확인
const canSaveToToss = (): boolean => {
  try {
    return typeof saveBase64Data?.isSupported === 'function' && saveBase64Data.isSupported();
  } catch {
    return false;
  }
};

export const ShareButton = () => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const settings = useAtomValue(imageSettingsAtom);
  const { aspectRatio } = useAspectRatio();

  // 토스: 갤러리 저장 지원 / 브라우저: Web Share API
  const canShare =
    uploadedImages.length >= 1 &&
    (canSaveToToss() || (typeof navigator !== 'undefined' && !!navigator.share));

  const handleShare = useCallback(async () => {
    if (uploadedImages.length < 1) return;

    // App in Toss는 이미지 파일 직접 공유를 지원하지 않으므로 갤러리에 저장
    // (사용자가 인스타그램에서 저장된 이미지를 업로드하는 흐름)
    if (canSaveToToss()) {
      const canvas = await renderImageToCanvas(uploadedImages[0].objectUrl, settings, aspectRatio);
      const base64 = canvas.toDataURL('image/png', 1.0).split(',')[1];
      await saveBase64Data({ data: base64, fileName: 'insta-frame.png', mimeType: 'image/png' });
      return;
    }

    // 브라우저 폴백: Web Share API
    const blobs = await Promise.all(uploadedImages.map((img) => renderImageToBlob(img.objectUrl, settings, aspectRatio)));
    const files = blobs.map((blob, i) => new File([blob], `photo-${i + 1}.png`, { type: 'image/png' }));

    try {
      await navigator.share({ files });
    } catch {
      // User cancelled share sheet
    }
  }, [uploadedImages, settings, aspectRatio]);

  if (!canShare) return null;

  return (
    <IconButton
      $variant="blue"
      onClick={handleShare}
      style={{
        opacity: 0.9,
        background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
      }}
    >
      <ButtonIcon src="/instagram.svg" alt="Share to Instagram" />
    </IconButton>
  );
};

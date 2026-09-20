'use client';

import { IconButton, ButtonIcon, InstagramIcon } from '@resizer/ui';
import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { uploadedImagesAtom, imageSettingsAtom } from '../atoms/imageAtoms';
import { useAspectRatio } from '../hooks/useAspectRatio';
import { renderImageToBlob, renderImageToCanvas } from '../utils/renderCanvasImage';
import { usePlatform } from '../platform';

const canUseWebShare = () => typeof navigator !== 'undefined' && !!navigator.share;

export const ShareButton = () => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const settings = useAtomValue(imageSettingsAtom);
  const { aspectRatio } = useAspectRatio();
  const platform = usePlatform();

  const canShare = uploadedImages.length >= 1 && (platform.isNativeAvailable() || canUseWebShare());

  const handleShare = useCallback(async () => {
    if (uploadedImages.length < 1) return;

    // 네이티브 환경(RN WebView / App in Toss)
    if (platform.isNativeAvailable()) {
      const canvas = await renderImageToCanvas(uploadedImages[0].objectUrl, settings, aspectRatio);
      await platform.shareImageNatively({ canvas, fileName: 'insta-frame.png' });
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
  }, [uploadedImages, settings, aspectRatio, platform]);

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
      <ButtonIcon as={InstagramIcon} role="img" aria-label="Share to Instagram" />
    </IconButton>
  );
};

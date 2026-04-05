'use client';

import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { uploadedImagesAtom, imageSettingsAtom } from '@/atoms/imageAtoms';
import { useAspectRatio } from '@/hooks/useAspectRatio';
import { IconButton, ButtonIcon } from '@/components/styled/Button';
import { renderImageToBlob, renderImageToCanvas } from '@/utils/renderCanvasImage';

export const ShareButton = () => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const settings = useAtomValue(imageSettingsAtom);
  const { aspectRatio } = useAspectRatio();

  const isWebView = typeof window !== 'undefined' && !!(window as any).ReactNativeWebView;
  const canShare = uploadedImages.length >= 1 && (isWebView || (typeof navigator !== 'undefined' && !!navigator.share));

  const handleShare = useCallback(async () => {
    if (uploadedImages.length < 1) return;

    const webView = (window as any).ReactNativeWebView;
    if (webView) {
      const canvas = await renderImageToCanvas(uploadedImages[0].objectUrl, settings, aspectRatio);
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      webView.postMessage(JSON.stringify({ type: 'share', data: dataUrl }));
      return;
    }

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

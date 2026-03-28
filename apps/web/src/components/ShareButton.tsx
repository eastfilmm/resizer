'use client';

import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { uploadedImagesAtom, imageSettingsAtom } from '@/atoms/imageAtoms';
import { useAspectRatio } from '@/hooks/useAspectRatio';
import { IconButton, ButtonIcon } from '@/components/styled/Button';
import { drawImageWithEffects, getCanvasDimensions } from '@/utils/canvas';

const loadImage = async (src: string) => {
  const img = new Image();
  img.src = src;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });

  return img;
};

export const ShareButton = () => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const settings = useAtomValue(imageSettingsAtom);
  const { aspectRatio } = useAspectRatio();

  const canShare = uploadedImages.length === 1 && typeof navigator !== 'undefined' && !!navigator.share;

  const handleShare = useCallback(async () => {
    if (uploadedImages.length !== 1) return;

    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(aspectRatio, false);
    const img = await loadImage(uploadedImages[0].objectUrl);

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const imageAreaWidth = canvasWidth - settings.padding * 2;
    const imageAreaHeight = canvasHeight - settings.padding * 2;

    drawImageWithEffects(ctx, img, {
      actualCanvasWidth: canvasWidth,
      actualCanvasHeight: canvasHeight,
      imageAreaWidth,
      imageAreaHeight,
      padding: settings.padding,
      bgColor: settings.backgroundColor,
      useGlassBlur: settings.glassBlurEnabled,
      blurIntensity: settings.blurIntensity,
      overlayOpacity: settings.overlayOpacity,
      useShadow: settings.shadowEnabled,
      shadowIntensity: settings.shadowIntensity,
      shadowOffset: settings.shadowOffset,
      frameType: settings.frameType,
      polaroidDate: settings.polaroidDate,
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (!b) reject(new Error('Failed to create blob'));
        else resolve(b);
      }, 'image/png', 1.0);
    });

    const file = new File([blob], 'photo.png', { type: 'image/png' });

    try {
      await navigator.share({
        files: [file],
      });
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
        opacity: 0.7,
        background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
      }}
    >
      <ButtonIcon src="/instagram.svg" alt="Share to Instagram" />
    </IconButton>
  );
};

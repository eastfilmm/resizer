'use client';

import { RefObject, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { imageUrlAtom, imageSettingsAtom } from '@/atoms/imageAtoms';
import { useResetState } from '@/hooks/useResetState';
import { useIsSafari } from '@/hooks/useIsSafari';
import { useAspectRatio } from '@/hooks/useAspectRatio';
import { IconButton, ButtonIcon } from '@/components/styled/Button';
import { drawImageWithEffects, getCanvasDimensions } from '@/utils/canvas';

interface DownloadButtonProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const DownloadButton = ({ canvasRef, fileInputRef }: DownloadButtonProps) => {
  const imageUrl = useAtomValue(imageUrlAtom);
  const settings = useAtomValue(imageSettingsAtom);
  const resetState = useResetState({ canvasRef, fileInputRef });
  const isSafari = useIsSafari();
  const { aspectRatio } = useAspectRatio();

  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;

    let dataUrl: string;

    if (isSafari) {
      // Safari: Create full-resolution canvas for download
      // (Safari preview uses scaled-down 800px canvas, so we need a fresh 2000px canvas)
      const img = new Image();
      img.src = imageUrl;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      // Use shared getCanvasDimensions with isSafari=false to get full-res dimensions
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(aspectRatio, false);
      const fullResCanvas = document.createElement('canvas');
      fullResCanvas.width = canvasWidth;
      fullResCanvas.height = canvasHeight;
      const ctx = fullResCanvas.getContext('2d');
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
        isSafari: true,
        polaroidDate: settings.polaroidDate,
      });

      dataUrl = fullResCanvas.toDataURL('image/png', 1.0);
    } else {
      // Chrome/Firefox: Use existing canvas
      if (!canvasRef.current) return;
      dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    }

    const link = document.createElement('a');
    link.download = `resized-image-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    // Reset all state after download
    resetState();
  }, [
    imageUrl,
    settings,
    isSafari,
    canvasRef,
    resetState,
    aspectRatio,
  ]);

  return (
    <IconButton $variant="primary" disabled={!imageUrl} onClick={handleDownload}>
      <ButtonIcon src="/download.svg" alt="Download" />
    </IconButton>
  );
};

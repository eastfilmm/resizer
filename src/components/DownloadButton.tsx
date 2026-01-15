'use client';

import { RefObject, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import {
  imageUrlAtom,
  backgroundColorAtom,
  paddingAtom,
  glassBlurAtom,
  blurIntensityAtom,
  overlayOpacityAtom,
  shadowEnabledAtom,
  shadowIntensityAtom,
  shadowOffsetAtom,
  copyrightEnabledAtom,
  copyrightTextAtom,
} from '@/atoms/imageAtoms';
import { useResetState } from '@/hooks/useResetState';
import { useIsSafari } from '@/hooks/useIsSafari';
import { useAspectRatio } from '@/hooks/useAspectRatio';
import { IconButton, ButtonIcon } from '@/components/styled/Button';
import {
  COPYRIGHT_STORAGE_KEY,
  CANVAS_ACTUAL_SIZE,
  CANVAS_DISPLAY_SIZE,
  CANVAS_ACTUAL_SIZE_4_5_WIDTH,
  CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
  CANVAS_ACTUAL_SIZE_9_16_WIDTH,
  CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
} from '@/constants/canvas';
import { drawImageWithEffects } from '@/utils/canvas';

interface DownloadButtonProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const DownloadButton = ({ canvasRef, fileInputRef }: DownloadButtonProps) => {
  const imageUrl = useAtomValue(imageUrlAtom);
  const copyrightText = useAtomValue(copyrightTextAtom);
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const padding = useAtomValue(paddingAtom);
  const glassBlur = useAtomValue(glassBlurAtom);
  const blurIntensity = useAtomValue(blurIntensityAtom);
  const overlayOpacity = useAtomValue(overlayOpacityAtom);
  const shadowEnabled = useAtomValue(shadowEnabledAtom);
  const shadowIntensity = useAtomValue(shadowIntensityAtom);
  const shadowOffset = useAtomValue(shadowOffsetAtom);
  const copyrightEnabled = useAtomValue(copyrightEnabledAtom);
  const resetState = useResetState({ canvasRef, fileInputRef});
  const isSafari = useIsSafari();
  const { aspectRatio } = useAspectRatio();

  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;

    // Save copyright text to localStorage
    if (copyrightText) {
      localStorage.setItem(COPYRIGHT_STORAGE_KEY, copyrightText);
    }

    let dataUrl: string;

    const getCanvasDimensions = () => {
      if (aspectRatio === '4:5') {
        return {
          width: CANVAS_ACTUAL_SIZE_4_5_WIDTH,
          height: CANVAS_ACTUAL_SIZE_4_5_HEIGHT,
        };
      }
      if (aspectRatio === '9:16') {
        return {
          width: CANVAS_ACTUAL_SIZE_9_16_WIDTH,
          height: CANVAS_ACTUAL_SIZE_9_16_HEIGHT,
        };
      }
      return {
        width: CANVAS_ACTUAL_SIZE,
        height: CANVAS_ACTUAL_SIZE,
      };
    };

    if (isSafari) {
      // Safari: Create full-resolution canvas for download
      const img = new Image();
      img.src = imageUrl;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();
      const fullResCanvas = document.createElement('canvas');
      fullResCanvas.width = canvasWidth;
      fullResCanvas.height = canvasHeight;
      const ctx = fullResCanvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const effectivePadding = 0;
      const imageAreaWidth = canvasWidth - effectivePadding * 2;
      const imageAreaHeight = canvasHeight - effectivePadding * 2;

      drawImageWithEffects(ctx, img, {
        actualCanvasWidth: canvasWidth,
        actualCanvasHeight: canvasHeight,
        imageAreaWidth,
        imageAreaHeight,
        bgColor: backgroundColor,
        useGlassBlur: glassBlur,
        blurIntensity,
        overlayOpacity,
        showCopyright: copyrightEnabled,
        copyrightText,
        useShadow: shadowEnabled,
        shadowIntensity,
        shadowOffset,
        isSafari: true,
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
    copyrightText,
    backgroundColor,
    padding,
    glassBlur,
    blurIntensity,
    overlayOpacity,
    shadowEnabled,
    shadowIntensity,
    shadowOffset,
    copyrightEnabled,
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

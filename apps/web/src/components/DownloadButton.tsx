'use client';

import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import JSZip from 'jszip';
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

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create PNG blob'));
        return;
      }

      resolve(blob);
    }, 'image/png', 1.0);
  });

const getPngFileName = (fileName: string, index: number) => {
  const trimmedName = fileName.trim();
  const baseName = trimmedName.length > 0 ? trimmedName.replace(/\.[^/.]+$/, '') : `image-${index + 1}`;
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '');
  return `${sanitizedName || `image-${index + 1}`}.png`;
};

export const DownloadButton = () => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const settings = useAtomValue(imageSettingsAtom);
  const { aspectRatio } = useAspectRatio();

  const renderImage = useCallback(async (uploadedImage: typeof uploadedImages[0], index: number) => {
    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(aspectRatio, false);
    const img = await loadImage(uploadedImage.objectUrl);
    const fullResCanvas = document.createElement('canvas');
    fullResCanvas.width = canvasWidth;
    fullResCanvas.height = canvasHeight;

    const ctx = fullResCanvas.getContext('2d');
    if (!ctx) return null;

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

    return { canvas: fullResCanvas, fileName: getPngFileName(uploadedImage.fileName, index) };
  }, [aspectRatio, settings]);

  const handleDownload = useCallback(async () => {
    if (uploadedImages.length === 0) return;

    const webView = (window as any).ReactNativeWebView;

    if (webView) {
      // WebView: send base64 data to native app for saving
      const dataUrls: string[] = [];
      for (const [index, uploadedImage] of uploadedImages.entries()) {
        const result = await renderImage(uploadedImage, index);
        if (!result) continue;
        dataUrls.push(result.canvas.toDataURL('image/png', 1.0));
      }
      webView.postMessage(JSON.stringify({ type: 'download', data: dataUrls }));
      return;
    }

    if (uploadedImages.length === 1) {
      const result = await renderImage(uploadedImages[0], 0);
      if (!result) return;

      const blob = await canvasToBlob(result.canvas);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = result.fileName;
      link.href = url;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    const zip = new JSZip();
    for (const [index, uploadedImage] of uploadedImages.entries()) {
      const result = await renderImage(uploadedImage, index);
      if (!result) continue;
      zip.file(result.fileName, await canvasToBlob(result.canvas));
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.download = `resized-images-${Date.now()}.zip`;
    link.href = url;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [uploadedImages, renderImage]);

  return (
    <IconButton $variant="blue" disabled={uploadedImages.length === 0} onClick={handleDownload} style={{ opacity: 0.9 }}>
      <ButtonIcon src="/download.svg" alt="Download" />
    </IconButton>
  );
};

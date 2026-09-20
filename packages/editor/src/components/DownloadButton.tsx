'use client';

import { IconButton, ButtonIcon, DownloadIcon } from '@resizer/ui';
import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { uploadedImagesAtom, imageSettingsAtom } from '../atoms/imageAtoms';
import { useAspectRatio } from '../hooks/useAspectRatio';
import { renderImageToCanvas, canvasToBlob } from '../utils/renderCanvasImage';
import { usePlatform } from '../platform';

const getPngFileName = (fileName: string, index: number) => {
  const trimmedName = fileName.trim();
  const baseName = trimmedName.length > 0 ? trimmedName.replace(/\.[^/.]+$/, '') : `image-${index + 1}`;
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '');
  return `${sanitizedName || `image-${index + 1}`}.png`;
};

const triggerBrowserDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = url;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const DownloadButton = () => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const settings = useAtomValue(imageSettingsAtom);
  const { aspectRatio } = useAspectRatio();
  const platform = usePlatform();

  const renderImage = useCallback(async (uploadedImage: typeof uploadedImages[0], index: number) => {
    const canvas = await renderImageToCanvas(uploadedImage.objectUrl, settings, aspectRatio);
    return { canvas, fileName: getPngFileName(uploadedImage.fileName, index) };
  }, [aspectRatio, settings]);

  const handleDownload = useCallback(async () => {
    if (uploadedImages.length === 0) return;

    const rendered = [];
    for (const [index, uploadedImage] of uploadedImages.entries()) {
      rendered.push(await renderImage(uploadedImage, index));
    }

    // 네이티브 환경(RN WebView / App in Toss): 기기에 바로 저장
    if (platform.isNativeAvailable()) {
      await platform.saveImagesNatively(rendered);
      return;
    }

    // 브라우저 폴백: 한 장은 그대로, 여러 장은 zip
    if (rendered.length === 1) {
      triggerBrowserDownload(await canvasToBlob(rendered[0].canvas), rendered[0].fileName);
      return;
    }

    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    for (const item of rendered) {
      zip.file(item.fileName, await canvasToBlob(item.canvas));
    }

    triggerBrowserDownload(
      await zip.generateAsync({ type: 'blob' }),
      `resized-images-${Date.now()}.zip`,
    );
  }, [uploadedImages, renderImage, platform]);

  return (
    <IconButton $variant="blue" disabled={uploadedImages.length === 0} onClick={handleDownload} style={{ opacity: 0.9 }}>
      <ButtonIcon as={DownloadIcon} role="img" aria-label="Download" />
    </IconButton>
  );
};

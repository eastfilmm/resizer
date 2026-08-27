import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { saveBase64Data } from '@apps-in-toss/web-framework';
import { uploadedImagesAtom, imageSettingsAtom } from '@/atoms/imageAtoms';
import { useAspectRatio } from '@/hooks/useAspectRatio';
import { IconButton, ButtonIcon } from '@/components/styled/Button';
import { renderImageToCanvas, canvasToBlob } from '@/utils/renderCanvasImage';

const getPngFileName = (fileName: string, index: number) => {
  const trimmedName = fileName.trim();
  const baseName = trimmedName.length > 0 ? trimmedName.replace(/\.[^/.]+$/, '') : `image-${index + 1}`;
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '');
  return `${sanitizedName || `image-${index + 1}`}.png`;
};

// App in Toss 환경에서 기기 갤러리 저장을 지원하는지 확인
const canSaveToToss = (): boolean => {
  try {
    return typeof saveBase64Data?.isSupported === 'function' && saveBase64Data.isSupported();
  } catch {
    return false;
  }
};

export const DownloadButton = () => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const settings = useAtomValue(imageSettingsAtom);
  const { aspectRatio } = useAspectRatio();

  const renderImage = useCallback(async (uploadedImage: typeof uploadedImages[0], index: number) => {
    const canvas = await renderImageToCanvas(uploadedImage.objectUrl, settings, aspectRatio);
    return { canvas, fileName: getPngFileName(uploadedImage.fileName, index) };
  }, [aspectRatio, settings]);

  const handleDownload = useCallback(async () => {
    if (uploadedImages.length === 0) return;

    // App in Toss: 각 이미지를 기기 갤러리에 저장
    if (canSaveToToss()) {
      for (const [index, uploadedImage] of uploadedImages.entries()) {
        const result = await renderImage(uploadedImage, index);
        const base64 = result.canvas.toDataURL('image/png', 1.0).split(',')[1];
        await saveBase64Data({ data: base64, fileName: result.fileName, mimeType: 'image/png' });
      }
      return;
    }

    // 브라우저 폴백: 단일 다운로드
    if (uploadedImages.length === 1) {
      const result = await renderImage(uploadedImages[0], 0);
      const blob = await canvasToBlob(result.canvas);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = result.fileName;
      link.href = url;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    // 브라우저 폴백: 여러 장은 zip
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    for (const [index, uploadedImage] of uploadedImages.entries()) {
      const result = await renderImage(uploadedImage, index);
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

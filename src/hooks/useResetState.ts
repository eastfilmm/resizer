'use client';

import { RefObject, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  uploadedImagesAtom,
  selectedImageIdAtom,
  imageSettingsAtom,
  DEFAULT_IMAGE_SETTINGS,
} from '@/atoms/imageAtoms';
import { resetCanvas } from '@/utils/canvas';

interface UseResetStateProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const useResetState = ({ canvasRef, fileInputRef }: UseResetStateProps) => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const setUploadedImages = useSetAtom(uploadedImagesAtom);
  const setSelectedImageId = useSetAtom(selectedImageIdAtom);
  const setImageSettings = useSetAtom(imageSettingsAtom);

  const resetState = useCallback(() => {
    uploadedImages.forEach((image) => URL.revokeObjectURL(image.objectUrl));
    setUploadedImages([]);
    setSelectedImageId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setImageSettings(DEFAULT_IMAGE_SETTINGS);

    if (canvasRef.current) {
      resetCanvas(canvasRef.current, DEFAULT_IMAGE_SETTINGS.backgroundColor);
    }
  }, [
    canvasRef,
    fileInputRef,
    setImageSettings,
    setSelectedImageId,
    setUploadedImages,
    uploadedImages,
  ]);

  return resetState;
};

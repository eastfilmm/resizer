'use client';

import { RefObject, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { imageUrlAtom, imageSettingsAtom, DEFAULT_IMAGE_SETTINGS } from '@/atoms/imageAtoms';
import { resetCanvas } from '@/utils/canvas';

interface UseResetStateProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const useResetState = ({ canvasRef, fileInputRef }: UseResetStateProps) => {
  const setImageUrl = useSetAtom(imageUrlAtom);
  const setImageSettings = useSetAtom(imageSettingsAtom);

  const resetState = useCallback(() => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setImageSettings(DEFAULT_IMAGE_SETTINGS);

    if (canvasRef.current) {
      resetCanvas(canvasRef.current, DEFAULT_IMAGE_SETTINGS.backgroundColor);
    }
  }, [canvasRef, fileInputRef, setImageUrl, setImageSettings]);

  return resetState;
};

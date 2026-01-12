'use client';

import { RefObject } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  imageUrlAtom,
  backgroundColorAtom,
  paddingAtom,
  glassBlurAtom,
  blurIntensityAtom,
  overlayOpacityAtom,
  copyrightEnabledAtom,
  copyrightTextAtom,
} from '@/atoms/imageAtoms';
import { resetCanvas } from '@/utils/canvas';
import { Button } from '@/components/styled/Button';

interface DownloadButtonProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

const COPYRIGHT_STORAGE_KEY = 'resizer-copyright-text';

export const DownloadButton = ({ canvasRef, fileInputRef }: DownloadButtonProps) => {
  const imageUrl = useAtomValue(imageUrlAtom);
  const setImageUrl = useSetAtom(imageUrlAtom);
  const setBackgroundColor = useSetAtom(backgroundColorAtom);
  const setPadding = useSetAtom(paddingAtom);
  const setGlassBlur = useSetAtom(glassBlurAtom);
  const setBlurIntensity = useSetAtom(blurIntensityAtom);
  const setOverlayOpacity = useSetAtom(overlayOpacityAtom);
  const copyrightText = useAtomValue(copyrightTextAtom);
  const setCopyrightEnabled = useSetAtom(copyrightEnabledAtom);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    // Save copyright text to localStorage
    if (copyrightText) {
      localStorage.setItem(COPYRIGHT_STORAGE_KEY, copyrightText);
    }

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `resized-image-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();

    // Reset all state after download
    handleReset();
  };

  const handleReset = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setBackgroundColor('white');
    setPadding(0);
    setGlassBlur(false);
    setBlurIntensity(30);
    setOverlayOpacity(0.3);
    setCopyrightEnabled(false);
    if (canvasRef.current) {
      resetCanvas(canvasRef.current, 'white');
    }
  };

  return (
    <Button disabled={!imageUrl} onClick={handleDownload}>
      Download
    </Button>
  );
}

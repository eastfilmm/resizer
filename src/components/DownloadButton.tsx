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
} from '@/atoms/imageAtoms';
import { resetCanvas } from '@/utils/canvas';
import { Button } from '@/components/styled/Button';

interface DownloadButtonProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const DownloadButton = ({ canvasRef, fileInputRef }: DownloadButtonProps) => {
  const imageUrl = useAtomValue(imageUrlAtom);
  const setImageUrl = useSetAtom(imageUrlAtom);
  const setBackgroundColor = useSetAtom(backgroundColorAtom);
  const setPadding = useSetAtom(paddingAtom);
  const setGlassBlur = useSetAtom(glassBlurAtom);
  const setBlurIntensity = useSetAtom(blurIntensityAtom);
  const setOverlayOpacity = useSetAtom(overlayOpacityAtom);

  const handleDownload = () => {
    if (!canvasRef.current) return;

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

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
import { IconButton, ButtonIcon } from '@/components/styled/Button';

interface ResetButtonProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export default function ResetButton({ canvasRef, fileInputRef }: ResetButtonProps) {
  const imageUrl = useAtomValue(imageUrlAtom);
  const setImageUrl = useSetAtom(imageUrlAtom);
  const setBackgroundColor = useSetAtom(backgroundColorAtom);
  const setPadding = useSetAtom(paddingAtom);
  const setGlassBlur = useSetAtom(glassBlurAtom);
  const setBlurIntensity = useSetAtom(blurIntensityAtom);
  const setOverlayOpacity = useSetAtom(overlayOpacityAtom);

  const handleReset = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Reset all settings to initial values
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
    <IconButton $variant="secondary" disabled={!imageUrl} onClick={handleReset}>
      <ButtonIcon src="/refresh_icon.svg" alt="Reset" />
    </IconButton>
  );
}

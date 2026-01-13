'use client';

import { RefObject } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  imageUrlAtom,
  backgroundColorAtom,
  paddingEnabledAtom,
  paddingAtom,
  glassBlurAtom,
  blurIntensityAtom,
  overlayOpacityAtom,
  canResetAtom,
  copyrightEnabledAtom,
  shadowEnabledAtom,
  shadowIntensityAtom,
  shadowOffsetAtom,
} from '@/atoms/imageAtoms';
import { resetCanvas } from '@/utils/canvas';
import { IconButton, ButtonIcon } from '@/components/styled/Button';

interface ResetButtonProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const ResetButton = ({ canvasRef, fileInputRef }: ResetButtonProps) => {
  const canReset = useAtomValue(canResetAtom);

  const setImageUrl = useSetAtom(imageUrlAtom);
  const setBackgroundColor = useSetAtom(backgroundColorAtom);
  const setPaddingEnabled = useSetAtom(paddingEnabledAtom);
  const setPadding = useSetAtom(paddingAtom);
  const setGlassBlur = useSetAtom(glassBlurAtom);
  const setBlurIntensity = useSetAtom(blurIntensityAtom);
  const setOverlayOpacity = useSetAtom(overlayOpacityAtom);
  const setCopyrightEnabled = useSetAtom(copyrightEnabledAtom);
  const setShadowEnabled = useSetAtom(shadowEnabledAtom);
  const setShadowIntensity = useSetAtom(shadowIntensityAtom);
  const setShadowOffset = useSetAtom(shadowOffsetAtom);

  const handleReset = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Reset all settings to initial values
    setBackgroundColor('white');
    setPaddingEnabled(false);
    setPadding(100);
    setGlassBlur(false);
    setBlurIntensity(30);
    setOverlayOpacity(0.3);
    setCopyrightEnabled(false);
    setShadowEnabled(false);
    setShadowIntensity(30);
    setShadowOffset(20);
    if (canvasRef.current) {
      resetCanvas(canvasRef.current, 'white');
    }
  };

  return (
    <IconButton $variant={canReset ? 'danger' : 'secondary'} disabled={!canReset} onClick={handleReset}>
      <ButtonIcon src="/refresh_icon.svg" alt="Reset" />
    </IconButton>
  );
}

'use client';

import { RefObject, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import {
  imageUrlAtom,
  backgroundColorAtom,
  paddingAtom,
  glassBlurAtom,
  blurIntensityAtom,
  overlayOpacityAtom,
  copyrightEnabledAtom,
  shadowEnabledAtom,
  shadowIntensityAtom,
  shadowOffsetAtom,
  polaroidModeAtom,
} from '@/atoms/imageAtoms';
import { resetCanvas } from '@/utils/CanvasUtils';

// Default values for all settings (single source of truth)
export const DEFAULT_VALUES = {
  backgroundColor: 'white' as const,
  paddingEnabled: false,
  padding: 0,
  glassBlur: false,
  blurIntensity: 30,
  overlayOpacity: 0.3,
  copyrightEnabled: false,
  shadowEnabled: false,
  shadowIntensity: 30,
  shadowOffset: 20,
  polaroidMode: false,
} as const;

interface UseResetStateProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const useResetState = ({ canvasRef, fileInputRef }: UseResetStateProps) => {
  const setImageUrl = useSetAtom(imageUrlAtom);
  const setBackgroundColor = useSetAtom(backgroundColorAtom);
  const setPadding = useSetAtom(paddingAtom);
  const setGlassBlur = useSetAtom(glassBlurAtom);
  const setBlurIntensity = useSetAtom(blurIntensityAtom);
  const setOverlayOpacity = useSetAtom(overlayOpacityAtom);
  const setCopyrightEnabled = useSetAtom(copyrightEnabledAtom);
  const setShadowEnabled = useSetAtom(shadowEnabledAtom);
  const setShadowIntensity = useSetAtom(shadowIntensityAtom);
  const setShadowOffset = useSetAtom(shadowOffsetAtom);
  const setPolaroidMode = useSetAtom(polaroidModeAtom);

  const resetState = useCallback(() => {
    // Clear image
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Reset all settings to default values
    setBackgroundColor(DEFAULT_VALUES.backgroundColor);
    setPadding(DEFAULT_VALUES.padding);
    setGlassBlur(DEFAULT_VALUES.glassBlur);
    setBlurIntensity(DEFAULT_VALUES.blurIntensity);
    setOverlayOpacity(DEFAULT_VALUES.overlayOpacity);
    setCopyrightEnabled(DEFAULT_VALUES.copyrightEnabled);
    setShadowEnabled(DEFAULT_VALUES.shadowEnabled);
    setShadowIntensity(DEFAULT_VALUES.shadowIntensity);
    setShadowOffset(DEFAULT_VALUES.shadowOffset);
    setPolaroidMode(DEFAULT_VALUES.polaroidMode);

    // Reset canvas
    if (canvasRef.current) {
      resetCanvas(canvasRef.current, DEFAULT_VALUES.backgroundColor);
    }
  }, [
    canvasRef,
    fileInputRef,
    setImageUrl,
    setBackgroundColor,
    setPadding,
    setGlassBlur,
    setBlurIntensity,
    setOverlayOpacity,
    setCopyrightEnabled,
    setShadowEnabled,
    setShadowIntensity,
    setShadowOffset,
    setPolaroidMode,
  ]);

  return resetState;
};

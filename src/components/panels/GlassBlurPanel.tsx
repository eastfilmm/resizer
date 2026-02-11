'use client';

import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  glassBlurAtom,
  blurIntensityAtom,
  overlayOpacityAtom,
} from '@/atoms/imageAtoms';
import {
  PanelContainer,
  PanelRow,
  PanelLabel,
  ToggleSwitch,
  SliderSection,
  SliderLabelRow,
  SliderLabel,
  SliderValue,
  Slider,
} from './shared';

export const GlassBlurPanel = () => {
  const glassBlur = useAtomValue(glassBlurAtom);
  const setGlassBlur = useSetAtom(glassBlurAtom);
  const blurIntensity = useAtomValue(blurIntensityAtom);
  const setBlurIntensity = useSetAtom(blurIntensityAtom);
  const overlayOpacity = useAtomValue(overlayOpacityAtom);
  const setOverlayOpacity = useSetAtom(overlayOpacityAtom);

  const toggleGlassBlur = useCallback(() => {
    setGlassBlur((prev) => !prev);
  }, [setGlassBlur]);

  const handleIntensityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBlurIntensity(Number(e.target.value));
    },
    [setBlurIntensity],
  );

  const handleOpacityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOverlayOpacity(Number(e.target.value) / 100);
    },
    [setOverlayOpacity],
  );

  return (
    <PanelContainer>
      <PanelRow>
        <PanelLabel>Glass Blur</PanelLabel>
        <ToggleSwitch $isActive={glassBlur} onClick={toggleGlassBlur} />
      </PanelRow>
      <SliderSection>
        <SliderLabelRow>
          <SliderLabel>Blur</SliderLabel>
          <SliderValue>{blurIntensity}%</SliderValue>
        </SliderLabelRow>
        <Slider
          type="range"
          min="1"
          max="100"
          value={blurIntensity}
          onChange={handleIntensityChange}
          disabled={!glassBlur}
        />
      </SliderSection>

      <SliderSection>
        <SliderLabelRow>
          <SliderLabel>Tint</SliderLabel>
          <SliderValue>{Math.round(overlayOpacity * 100)}%</SliderValue>
        </SliderLabelRow>
        <Slider
          type="range"
          min="0"
          max="100"
          value={Math.round(overlayOpacity * 100)}
          onChange={handleOpacityChange}
          disabled={!glassBlur}
        />
      </SliderSection>
    </PanelContainer>
  );
};

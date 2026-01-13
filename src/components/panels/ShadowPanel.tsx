'use client';

import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { shadowEnabledAtom, shadowIntensityAtom, shadowOffsetAtom } from '@/atoms/imageAtoms';
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

export const ShadowPanel = () => {
  const shadowEnabled = useAtomValue(shadowEnabledAtom);
  const setShadowEnabled = useSetAtom(shadowEnabledAtom);
  const shadowIntensity = useAtomValue(shadowIntensityAtom);
  const setShadowIntensity = useSetAtom(shadowIntensityAtom);
  const shadowOffset = useAtomValue(shadowOffsetAtom);
  const setShadowOffset = useSetAtom(shadowOffsetAtom);

  const toggleShadow = useCallback(() => {
    setShadowEnabled((prev) => !prev);
  }, [setShadowEnabled]);

  const handleIntensityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setShadowIntensity(Number(e.target.value));
    },
    [setShadowIntensity]
  );

  const handleOffsetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setShadowOffset(Number(e.target.value));
    },
    [setShadowOffset]
  );

  return (
    <PanelContainer>
      <PanelRow>
        <PanelLabel>Shadow</PanelLabel>
        <ToggleSwitch $isActive={shadowEnabled} onClick={toggleShadow} />
      </PanelRow>

      <SliderSection>
        <SliderLabelRow>
          <SliderLabel>Blur</SliderLabel>
          <SliderValue>{shadowIntensity}px</SliderValue>
        </SliderLabelRow>
        <Slider
          type="range"
          min="1"
          max="100"
          value={shadowIntensity}
          onChange={handleIntensityChange}
          disabled={!shadowEnabled}
        />
      </SliderSection>

      <SliderSection>
        <SliderLabelRow>
          <SliderLabel>Offset</SliderLabel>
          <SliderValue>{shadowOffset}px</SliderValue>
        </SliderLabelRow>
        <Slider
          type="range"
          min="1"
          max="50"
          value={shadowOffset}
          onChange={handleOffsetChange}
          disabled={!shadowEnabled}
        />
      </SliderSection>
    </PanelContainer>
  );
};


import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  shadowEnabledAtom,
  shadowIntensityAtom,
  shadowOffsetAtom,
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
} from './shared';
import { FocusReveal } from '@/components/FocusReveal';
import { RangeSlider } from '@/components/RangeSlider';

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
    (v: number) => setShadowIntensity(v),
    [setShadowIntensity],
  );

  const handleOffsetChange = useCallback(
    (v: number) => setShadowOffset(v),
    [setShadowOffset],
  );

  return (
    <PanelContainer>
      <PanelRow>
        <PanelLabel>Shadow</PanelLabel>
        <ToggleSwitch $isActive={shadowEnabled} onClick={toggleShadow} />
      </PanelRow>
      <SliderSection>
        <FocusReveal.Scope>
          <SliderLabelRow>
            <SliderLabel>Blur</SliderLabel>
            <SliderValue>{shadowIntensity}px</SliderValue>
          </SliderLabelRow>
          <FocusReveal.Trigger>
            <RangeSlider
              min={1}
              max={100}
              value={shadowIntensity}
              onValueChange={handleIntensityChange}
              disabled={!shadowEnabled}
            />
          </FocusReveal.Trigger>
        </FocusReveal.Scope>
      </SliderSection>

      <SliderSection>
        <FocusReveal.Scope>
          <SliderLabelRow>
            <SliderLabel>Offset</SliderLabel>
            <SliderValue>{shadowOffset}px</SliderValue>
          </SliderLabelRow>
          <FocusReveal.Trigger>
            <RangeSlider
              min={1}
              max={50}
              value={shadowOffset}
              onValueChange={handleOffsetChange}
              disabled={!shadowEnabled}
            />
          </FocusReveal.Trigger>
        </FocusReveal.Scope>
      </SliderSection>
    </PanelContainer>
  );
};

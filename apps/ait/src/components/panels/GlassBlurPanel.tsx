
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
} from './shared';
import { FocusReveal } from '@/components/FocusReveal';
import { RangeSlider } from '@/components/RangeSlider';

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
    (v: number) => setBlurIntensity(v),
    [setBlurIntensity],
  );

  const handleOpacityChange = useCallback(
    (v: number) => setOverlayOpacity(v / 100),
    [setOverlayOpacity],
  );

  return (
    <PanelContainer>
        <PanelRow>
          <PanelLabel>Glass Blur</PanelLabel>
          <ToggleSwitch $isActive={glassBlur} onClick={toggleGlassBlur} />
        </PanelRow>
        <SliderSection>
          <FocusReveal.Scope>
            <SliderLabelRow>
              <SliderLabel>Blur</SliderLabel>
              <SliderValue>{blurIntensity}%</SliderValue>
            </SliderLabelRow>
            <FocusReveal.Trigger>
              <RangeSlider
                min={1}
                max={100}
                value={blurIntensity}
                onValueChange={handleIntensityChange}
                disabled={!glassBlur}
              />
            </FocusReveal.Trigger>
          </FocusReveal.Scope>
        </SliderSection>

        <SliderSection>
          <FocusReveal.Scope>
            <SliderLabelRow>
              <SliderLabel>Tint</SliderLabel>
              <SliderValue>{Math.round(overlayOpacity * 100)}%</SliderValue>
            </SliderLabelRow>
            <FocusReveal.Trigger>
              <RangeSlider
                min={0}
                max={100}
                value={Math.round(overlayOpacity * 100)}
                onValueChange={handleOpacityChange}
                disabled={!glassBlur}
              />
            </FocusReveal.Trigger>
          </FocusReveal.Scope>
        </SliderSection>
      </PanelContainer>
  );
};

'use client';

import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { paddingEnabledAtom, paddingAtom } from '@/atoms/imageAtoms';
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

export const PaddingPanel = () => {
  const paddingEnabled = useAtomValue(paddingEnabledAtom);
  const setPaddingEnabled = useSetAtom(paddingEnabledAtom);
  const padding = useAtomValue(paddingAtom);
  const setPadding = useSetAtom(paddingAtom);

  const togglePadding = useCallback(() => {
    setPaddingEnabled((prev) => !prev);
  }, [setPaddingEnabled]);

  const handlePaddingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPadding(Number(e.target.value));
    },
    [setPadding]
  );

  return (
    <PanelContainer>
      <PanelRow>
        <PanelLabel>Padding</PanelLabel>
        <ToggleSwitch $isActive={paddingEnabled} onClick={togglePadding} />
      </PanelRow>

      <SliderSection>
        <SliderLabelRow>
          <SliderLabel>Size</SliderLabel>
          <SliderValue>{padding}px</SliderValue>
        </SliderLabelRow>
        <Slider
          type="range"
          min="0"
          max="200"
          value={padding}
          onChange={handlePaddingChange}
          disabled={!paddingEnabled}
        />
      </SliderSection>
    </PanelContainer>
  );
};

'use client';

import { memo, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { paddingAtom, polaroidModeAtom } from '@/atoms/imageAtoms';
import {
  PanelContainer,
  PanelLabel,
  SliderSection,
  SliderLabelRow,
  SliderValue,
  Slider,
} from './shared';

export const PaddingPanel = memo(() => {
  const padding = useAtomValue(paddingAtom);
  const setPadding = useSetAtom(paddingAtom);
  const polaroidMode = useAtomValue(polaroidModeAtom);

  const handlePaddingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPadding(Number(e.target.value));
    },
    [setPadding]
  );

  return (
    <PanelContainer>
      <SliderSection>
        <SliderLabelRow>
          <PanelLabel $isDimmed={polaroidMode}>Padding</PanelLabel>
          <SliderValue style={{ width: '40px' }} $isDimmed={polaroidMode}>{padding}px</SliderValue>
        </SliderLabelRow>
        <Slider
          type="range"
          min="0"
          max="200"
          value={padding}
          onChange={handlePaddingChange}
          disabled={polaroidMode}
        />
      </SliderSection>
    </PanelContainer>
  );
});

PaddingPanel.displayName = 'PaddingPanel';

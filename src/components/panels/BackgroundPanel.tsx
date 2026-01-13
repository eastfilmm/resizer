'use client';

import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { backgroundColorAtom } from '@/atoms/imageAtoms';
import { PanelContainer, PanelLabel, ToggleSwitch } from './shared';

export const BackgroundPanel = () => {
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const setBackgroundColor = useSetAtom(backgroundColorAtom);

  const toggleBackgroundColor = useCallback(() => {
    setBackgroundColor((prev) => (prev === 'white' ? 'black' : 'white'));
  }, [setBackgroundColor]);

  return (
    <PanelContainer $direction="row">
      <PanelLabel>Background Color</PanelLabel>
      <ToggleSwitch
        $isActive={backgroundColor === 'black'}
        $activeColor="#000000"
        onClick={toggleBackgroundColor}
      />
    </PanelContainer>
  );
};

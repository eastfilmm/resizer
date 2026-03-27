import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  shadowEnabledAtom,
  shadowIntensityAtom,
  shadowOffsetAtom,
  frameTypeAtom,
} from '@resizer/shared/atoms';
import { PanelContainer, ToggleRow, SliderRow } from './shared';

export default function ShadowPanel() {
  const [shadowEnabled, setShadowEnabled] = useAtom(shadowEnabledAtom);
  const [shadowIntensity, setShadowIntensity] = useAtom(shadowIntensityAtom);
  const [shadowOffset, setShadowOffset] = useAtom(shadowOffsetAtom);
  const frameType = useAtomValue(frameTypeAtom);

  const disabled = frameType !== 'none';

  return (
    <PanelContainer>
      <ToggleRow
        label="그림자"
        value={!disabled && shadowEnabled}
        onValueChange={(val) => !disabled && setShadowEnabled(val)}
      />
      {shadowEnabled && !disabled && (
        <>
          <SliderRow
            label="블러"
            value={shadowIntensity}
            min={1}
            max={100}
            onValueChange={setShadowIntensity}
            unit="px"
          />
          <SliderRow
            label="오프셋"
            value={shadowOffset}
            min={1}
            max={50}
            onValueChange={setShadowOffset}
            unit="px"
          />
        </>
      )}
    </PanelContainer>
  );
}

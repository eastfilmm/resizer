import React from 'react';
import { useAtom } from 'jotai';
import {
  glassBlurAtom,
  blurIntensityAtom,
  overlayOpacityAtom,
  frameTypeAtom,
} from '@resizer/shared/atoms';
import { useAtomValue } from 'jotai';
import { PanelContainer, ToggleRow, SliderRow } from './shared';

export default function GlassBlurPanel() {
  const [glassBlur, setGlassBlur] = useAtom(glassBlurAtom);
  const [blurIntensity, setBlurIntensity] = useAtom(blurIntensityAtom);
  const [overlayOpacity, setOverlayOpacity] = useAtom(overlayOpacityAtom);
  const frameType = useAtomValue(frameTypeAtom);

  const disabled = frameType !== 'none';

  return (
    <PanelContainer>
      <ToggleRow
        label="유리 블러"
        value={!disabled && glassBlur}
        onValueChange={(val) => !disabled && setGlassBlur(val)}
      />
      {glassBlur && !disabled && (
        <>
          <SliderRow
            label="블러 강도"
            value={blurIntensity}
            min={1}
            max={100}
            onValueChange={setBlurIntensity}
            unit="%"
          />
          <SliderRow
            label="틴트 불투명도"
            value={Math.round(overlayOpacity * 100)}
            min={0}
            max={100}
            onValueChange={(val) => setOverlayOpacity(val / 100)}
            unit="%"
          />
        </>
      )}
    </PanelContainer>
  );
}

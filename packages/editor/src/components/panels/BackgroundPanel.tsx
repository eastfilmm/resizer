'use client';

import {
  ColorSwatch,
  PanelContainer,
  PanelLabel,
  PanelLabelWrapper,
  SwatchStrip,
  TitleAndInputWrapper,
} from '@resizer/ui';
import { BACKGROUND_COLOR_FILL } from '@resizer/canvas';
import { useAtom } from 'jotai';
import { backgroundColorAtom, type BackgroundColor } from '../../atoms/imageAtoms';

// 무지개 순서 + 흰·검
const PALETTE: { color: BackgroundColor; label: string }[] = [
  { color: 'red', label: 'Red' },
  { color: 'orange', label: 'Orange' },
  { color: 'yellow', label: 'Yellow' },
  { color: 'green', label: 'Green' },
  { color: 'blue', label: 'Blue' },
  { color: 'indigo', label: 'Indigo' },
  { color: 'violet', label: 'Violet' },
  { color: 'white', label: 'White' },
  { color: 'black', label: 'Black' },
];

export const BackgroundPanel = () => {
  const [backgroundColor, setBackgroundColor] = useAtom(backgroundColorAtom);

  return (
    <PanelContainer $direction="column">
      <TitleAndInputWrapper>
        <PanelLabelWrapper $textAlign="left">
          <PanelLabel>Background Color</PanelLabel>
        </PanelLabelWrapper>
        <SwatchStrip role="radiogroup" aria-label="Background color">
          {PALETTE.map(({ color, label }) => (
            <ColorSwatch
              key={color}
              role="radio"
              aria-label={label}
              aria-checked={backgroundColor === color}
              $color={BACKGROUND_COLOR_FILL[color]}
              $isSelected={backgroundColor === color}
              onClick={() => setBackgroundColor(color)}
            />
          ))}
        </SwatchStrip>
      </TitleAndInputWrapper>
    </PanelContainer>
  );
};

'use client';

import {
  Collapsible,
  ColorSwatch,
  FocusReveal,
  PanelContainer,
  PanelLabel,
  PanelLabelWrapper,
  RangeSlider,
  SliderLabel,
  SliderLabelRow,
  SliderSection,
  SlidersWrapper,
  SwatchStrip,
} from '@resizer/ui';
import { BACKGROUND_COLOR_FILL, isSoftenable } from '@resizer/canvas';
import { useAtom } from 'jotai';
import {
  backgroundColorAtom,
  backgroundSoftnessAtom,
  type BackgroundColor,
} from '../../atoms/imageAtoms';

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

/**
 * 색 띠 + Soft 슬라이더. Soft는 캔버스 배경에만 적용한다 — 결과가 바로 보이므로
 * 띠는 원색으로 둔다. 띠까지 따라 바꾸면 드래그마다 칸 9개를 다시 칠하게 된다.
 * 검정은 Soft 대상이 아니라서 고르면 Soft 줄을 접는다(값은 기억해 둔다).
 */
export const BackgroundPanel = () => {
  const [backgroundColor, setBackgroundColor] = useAtom(backgroundColorAtom);
  const [softness, setSoftness] = useAtom(backgroundSoftnessAtom);

  return (
    // 간격은 컨테이너 gap이 아니라 SlidersWrapper와 Collapsible이 갖는다.
    // gap을 두면 Soft가 접혀도 그 몫의 빈칸이 남는다.
    <PanelContainer $direction="column" style={{ gap: 0 }}>
      <SlidersWrapper>
        <PanelLabelWrapper $textAlign="left">
          <PanelLabel>Background Color</PanelLabel>
        </PanelLabelWrapper>

        {/* Soft 줄과 같은 구조라 라벨 폭·조작부 시작선이 맞는다 */}
        <SliderSection>
          <SliderLabelRow>
            <SliderLabel>Palette</SliderLabel>
          </SliderLabelRow>
          <SwatchStrip role="radiogroup" aria-label="Background color">
            {PALETTE.map(({ color, label }) => (
              <ColorSwatch
                key={color}
                role="radio"
                aria-label={label}
                aria-checked={backgroundColor === color}
                $color={BACKGROUND_COLOR_FILL[color]}
                $isSelected={backgroundColor === color}
              // 흰 칸은 패널 배경과 같아서 경계선이 있어야 칸으로 보인다
              $isOutlined={color === 'white'}
                onClick={() => setBackgroundColor(color)}
              />
            ))}
          </SwatchStrip>
        </SliderSection>
      </SlidersWrapper>

      <Collapsible isOpen={isSoftenable(backgroundColor)}>
        <SliderSection>
          <FocusReveal.Scope>
            <SliderLabelRow>
              <SliderLabel>Soft</SliderLabel>
            </SliderLabelRow>
            <FocusReveal.Trigger>
              <RangeSlider
                min={0}
                max={100}
                value={softness}
                onValueChange={setSoftness}
                format={(v) => `${v}%`}
              />
            </FocusReveal.Trigger>
          </FocusReveal.Scope>
        </SliderSection>
      </Collapsible>
    </PanelContainer>
  );
};

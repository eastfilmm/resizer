import { Slider } from '@base-ui-components/react/slider';
import styled from 'styled-components';
import { COLOR_PRIMARY, COLOR_GRAY_BORDER } from '@/constants/theme';

interface RangeSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Base UI Slider 기반 공용 슬라이더.
 * - 두꺼운 트랙 + 막대형 thumb(가로 좁고 세로 길며 라운드)
 * - Indicator(핸들 왼쪽 채움)는 활성 시 핸들과 같은 색, 비활성 시 회색
 */
export const RangeSlider = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
}: RangeSliderProps) => {
  return (
    <SliderRoot
      className={className}
      value={value}
      onValueChange={(v) => onValueChange(v as number)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
    >
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </SliderRoot>
  );
};

const SliderRoot = styled(Slider.Root)`
  flex: 1;
  min-width: 0;
`;

const SliderControl = styled(Slider.Control)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  cursor: pointer;
  touch-action: none;

  &[data-disabled] {
    cursor: not-allowed;
  }
`;

const SliderTrack = styled(Slider.Track)`
  position: relative;
  width: 100%;
  height: 20px;
  border-radius: 4px;
  background: ${COLOR_GRAY_BORDER};
`;

/* 채움: 왼쪽은 트랙과 같은 4px, 핸들 쪽(오른쪽 상하)은 2px */
const SliderIndicator = styled(Slider.Indicator)`
  height: 100%;
  border-radius: 4px 2px 2px 4px;
  background: ${COLOR_PRIMARY};

  &[data-disabled] {
    background: ${COLOR_GRAY_BORDER};
  }
`;

/* 핸들: 항상 흰색 막대 */
const SliderThumb = styled(Slider.Thumb)`
  width: 6px;
  height: 16px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

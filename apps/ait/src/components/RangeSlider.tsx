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
  /** 기능이 꺼진 상태: 회색으로 보이지만 조작 가능(움직이면 켜짐) */
  inactive?: boolean;
  className?: string;
  /** 드래그 중 슬라이더 위에 표시할 값 포맷 (예: (v) => `${v}px`) */
  format?: (value: number) => string;
}

/**
 * Base UI Slider 기반 공용 슬라이더.
 * - 두꺼운 트랙 + 막대형 thumb, Indicator(왼쪽 채움)
 * - 드래그 중(FocusReveal.Trigger 활성): 슬라이더 반투명 + 값 뱃지를 슬라이더 위에 노출
 */
export const RangeSlider = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  inactive = false,
  className,
  format = (v) => String(v),
}: RangeSliderProps) => {
  return (
    <SliderRoot
      className={className}
      data-inactive={inactive ? '' : undefined}
      value={value}
      onValueChange={(v) => onValueChange(v as number)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      thumbAlignment="edge"
    >
      <ValueBadge>{format(value)}</ValueBadge>
      <SliderControl>
        <SliderTrack>
          {/* 최솟값에선 edge 정렬로 남는 파란 조각을 없애기 위해 미렌더 */}
          {value > min && <SliderIndicator />}
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </SliderRoot>
  );
};

const ValueBadge = styled.div`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 6px;
  background: ${COLOR_PRIMARY};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;

  /* 실제 슬라이딩(FocusReveal 이동 신호) 중에만 노출 */
  [data-focus-active-trigger] & {
    opacity: 1;
  }
`;

const SliderRoot = styled(Slider.Root)`
  position: relative;
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
  transition: opacity 0.15s ease;

  &[data-disabled] {
    cursor: not-allowed;
  }

  /* 실제 슬라이딩(FocusReveal 이동 신호) 중 슬라이더 반투명 */
  [data-focus-active-trigger] & {
    opacity: 0.3;
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

  /* 기능 OFF(inactive) 또는 disabled → 회색 채움 */
  &[data-disabled],
  [data-inactive] & {
    background: ${COLOR_GRAY_BORDER};
  }
`;

/* 핸들: 항상 흰색 막대. 세로 높이는 고정(16px), 가로만 평소 얇고 드래그 중 두꺼워짐 */
const SliderThumb = styled(Slider.Thumb)`
  width: 4px;
  height: 16px;
  border-radius: 3px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: width 0.15s ease, border-radius 0.15s ease;

  /* 실제 슬라이딩(FocusReveal 이동 신호) 중 핸들 확대 */
  [data-focus-active-trigger] & {
    width: 6px;
    border-radius: 4px;
  }
`;

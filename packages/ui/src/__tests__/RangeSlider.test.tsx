import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { RangeSlider } from '../RangeSlider';

afterEach(cleanup);

/**
 * 슬라이더는 값 표시·채움·상태 표기와 키보드 조작까지를 책임진다.
 * 드래그 중 시각 효과는 FocusReveal이 붙여 주는 data 속성에 달려 있어 여기서 다루지 않는다.
 *
 * Base UI는 트랙 폭을 실제로 재서 thumb을 배치하는데 jsdom에는 레이아웃이 없어
 * thumb이 visibility:hidden으로 남는다. 그래서 role 조회 대신 DOM을 직접 가리키고,
 * 위치가 아니라 동작을 검증한다.
 */

const rangeInput = () => document.querySelector('input[type="range"]') as HTMLInputElement;
const indicator = () => document.querySelector('[data-base-ui-slider-indicator]');
const control = () => document.querySelector('[data-base-ui-slider-control]') as HTMLElement;
const root = () => screen.getByRole('group');

const pressArrow = (key: 'ArrowRight' | 'ArrowLeft') => fireEvent.keyDown(rangeInput(), { key });

describe('RangeSlider', () => {
  it('현재 값을 range 입력으로 노출한다', () => {
    render(<RangeSlider value={30} onValueChange={() => {}} />);

    expect(rangeInput()).toHaveAttribute('aria-valuenow', '30');
  });

  it('min/max/step을 그대로 전달한다', () => {
    render(<RangeSlider value={5} onValueChange={() => {}} min={2} max={8} step={2} />);

    expect(rangeInput()).toHaveAttribute('min', '2');
    expect(rangeInput()).toHaveAttribute('max', '8');
    expect(rangeInput()).toHaveAttribute('step', '2');
  });

  it('format으로 값 뱃지 문구를 만든다', () => {
    render(<RangeSlider value={24} onValueChange={() => {}} format={(v) => `${v}px`} />);

    expect(screen.getByText('24px')).toBeInTheDocument();
  });

  it('format이 없으면 값을 그대로 보여준다', () => {
    render(<RangeSlider value={24} onValueChange={() => {}} />);

    expect(screen.getByText('24')).toBeInTheDocument();
  });

  // 최솟값에서 Indicator를 그리면 edge 정렬 탓에 트랙 왼쪽에 파란 조각이 남는다.
  it('값이 최솟값이면 채움(Indicator)을 그리지 않는다', () => {
    render(<RangeSlider value={0} onValueChange={() => {}} min={0} />);

    expect(indicator()).toBeNull();
  });

  it('최솟값이 0이 아닐 때도 최솟값이면 채움을 그리지 않는다', () => {
    render(<RangeSlider value={10} onValueChange={() => {}} min={10} max={50} />);

    expect(indicator()).toBeNull();
  });

  it('값이 최솟값보다 크면 채움을 그린다', () => {
    render(<RangeSlider value={1} onValueChange={() => {}} min={0} />);

    expect(indicator()).not.toBeNull();
  });

  it('inactive면 data-inactive를 단다 (회색 채움의 근거)', () => {
    render(<RangeSlider value={40} onValueChange={() => {}} inactive />);

    expect(root()).toHaveAttribute('data-inactive');
  });

  it('inactive가 아니면 data-inactive가 없다', () => {
    render(<RangeSlider value={40} onValueChange={() => {}} />);

    expect(root()).not.toHaveAttribute('data-inactive');
  });

  it('inactive여도 조작은 막지 않는다 (움직이면 기능이 켜지는 흐름)', () => {
    const onValueChange = vi.fn();
    render(<RangeSlider value={40} onValueChange={onValueChange} inactive />);

    pressArrow('ArrowRight');

    expect(onValueChange).toHaveBeenCalledWith(41);
  });

  // 잠금은 input의 disabled가 담당한다. 브라우저는 disabled 입력에 키 이벤트를
  // 전달하지 않으므로, 직접 keyDown을 쏘아 콜백을 확인하는 건 그 보호를 우회하는
  // 인공적인 검증이 된다. 잠금이 실제로 걸렸는지만 본다.
  it('disabled면 입력을 잠그고 그 상태를 표기한다', () => {
    render(<RangeSlider value={40} onValueChange={() => {}} disabled />);

    expect(rangeInput()).toBeDisabled();
    expect(control()).toHaveAttribute('data-disabled');
  });

  it('키보드로 값을 올리고 내린다', () => {
    const onValueChange = vi.fn();
    render(<RangeSlider value={50} onValueChange={onValueChange} />);

    pressArrow('ArrowRight');
    expect(onValueChange).toHaveBeenLastCalledWith(51);

    pressArrow('ArrowLeft');
    expect(onValueChange).toHaveBeenLastCalledWith(49);
  });

  it('step 단위로 움직인다', () => {
    const onValueChange = vi.fn();
    render(<RangeSlider value={20} onValueChange={onValueChange} step={5} />);

    pressArrow('ArrowRight');

    expect(onValueChange).toHaveBeenCalledWith(25);
  });

  it('최댓값을 넘지 않는다', () => {
    const onValueChange = vi.fn();
    render(<RangeSlider value={10} onValueChange={onValueChange} min={0} max={10} />);

    pressArrow('ArrowRight');

    expect(onValueChange).not.toHaveBeenCalledWith(11);
  });

  it('최솟값 아래로 내려가지 않는다', () => {
    const onValueChange = vi.fn();
    render(<RangeSlider value={0} onValueChange={onValueChange} min={0} max={10} />);

    pressArrow('ArrowLeft');

    expect(onValueChange).not.toHaveBeenCalledWith(-1);
  });
});

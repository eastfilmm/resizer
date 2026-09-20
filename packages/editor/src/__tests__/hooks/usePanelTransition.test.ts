import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PANEL_FADE_MS, PANEL_FADE_IN_DELAY_MS } from '@resizer/ui';
import { usePanelTransition } from '../../hooks/usePanelTransition';
import type { NavPanelType } from '../../atoms/imageAtoms';

/**
 * 패널 전환은 페이드아웃 → 높이 전환 → 페이드인 순서를 타이머로 이어 붙인다.
 * 중간 단계가 어긋나면 패널이 비어 보이거나, 사라지지 않고 남거나, 내용이
 * 바뀌는 순간이 눈에 보인다. 각 단계의 타이밍을 고정해 둔다.
 */

const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

const setup = (initial: NavPanelType = null) =>
  renderHook(({ panel }: { panel: NavPanelType }) => usePanelTransition(panel), {
    initialProps: { panel: initial },
  });

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('usePanelTransition', () => {
  it('처음에는 아무 패널도 보이지 않는다', () => {
    const { result } = setup(null);

    expect(result.current.displayedPanel).toBeNull();
    expect(result.current.isContentVisible).toBe(false);
  });

  it('열 때 패널을 먼저 붙이고 내용은 나중에 보인다', () => {
    const { result, rerender } = setup(null);

    rerender({ panel: 'layout' });
    // 높이 전환이 시작되도록 패널은 즉시 붙되 내용은 아직 감춘다
    expect(result.current.displayedPanel).toBe('layout');
    expect(result.current.isContentVisible).toBe(false);

    advance(PANEL_FADE_IN_DELAY_MS);
    expect(result.current.isContentVisible).toBe(true);
  });

  it('페이드인 지연 직전에는 아직 내용을 보이지 않는다', () => {
    const { result, rerender } = setup(null);
    rerender({ panel: 'layout' });

    advance(PANEL_FADE_IN_DELAY_MS - 1);

    expect(result.current.isContentVisible).toBe(false);
  });

  it('닫을 때 내용을 먼저 감추고 그 다음 패널을 뗀다', () => {
    const { result, rerender } = setup(null);
    rerender({ panel: 'layout' });
    advance(PANEL_FADE_IN_DELAY_MS);

    rerender({ panel: null });
    // 페이드아웃 중에도 높이를 유지해야 하므로 패널은 아직 붙어 있다
    expect(result.current.isContentVisible).toBe(false);
    expect(result.current.displayedPanel).toBe('layout');

    advance(PANEL_FADE_MS);
    expect(result.current.displayedPanel).toBeNull();
  });

  it('패널을 바꾸면 페이드아웃 뒤에 내용이 교체된다', () => {
    const { result, rerender } = setup(null);
    rerender({ panel: 'layout' });
    advance(PANEL_FADE_IN_DELAY_MS);

    rerender({ panel: 'shadow' });
    // 교체 순간이 보이지 않도록 이전 패널을 감춘 채 유지한다
    expect(result.current.displayedPanel).toBe('layout');
    expect(result.current.isContentVisible).toBe(false);

    advance(PANEL_FADE_MS);
    expect(result.current.displayedPanel).toBe('shadow');
    expect(result.current.isContentVisible).toBe(true);
  });

  it('같은 패널을 다시 지정하면 보이는 상태를 유지한다', () => {
    const { result, rerender } = setup(null);
    rerender({ panel: 'layout' });
    advance(PANEL_FADE_IN_DELAY_MS);

    rerender({ panel: 'layout' });

    expect(result.current.displayedPanel).toBe('layout');
    expect(result.current.isContentVisible).toBe(true);
  });

  // 전환 도중 다시 누르는 건 흔한 조작이다. 예약된 단계가 취소되지 않으면
  // 패널이 사라진 뒤 되살아나거나 엉뚱한 패널이 남는다.
  it('닫는 도중 다시 열면 닫힘이 취소된다', () => {
    const { result, rerender } = setup(null);
    rerender({ panel: 'layout' });
    advance(PANEL_FADE_IN_DELAY_MS);

    rerender({ panel: null });
    advance(PANEL_FADE_MS / 2);
    rerender({ panel: 'layout' });

    advance(PANEL_FADE_MS * 2);
    expect(result.current.displayedPanel).toBe('layout');
    expect(result.current.isContentVisible).toBe(true);
  });

  it('전환 도중 또 바꾸면 마지막 선택만 남는다', () => {
    const { result, rerender } = setup(null);
    rerender({ panel: 'layout' });
    advance(PANEL_FADE_IN_DELAY_MS);

    rerender({ panel: 'shadow' });
    advance(PANEL_FADE_MS / 2);
    rerender({ panel: 'frame' });

    advance(PANEL_FADE_MS * 2);
    expect(result.current.displayedPanel).toBe('frame');
    expect(result.current.isContentVisible).toBe(true);
  });

  it('열자마자 닫아도 패널이 남지 않는다', () => {
    const { result, rerender } = setup(null);

    rerender({ panel: 'layout' });
    rerender({ panel: null });

    advance(PANEL_FADE_MS * 2 + PANEL_FADE_IN_DELAY_MS);
    expect(result.current.displayedPanel).toBeNull();
    expect(result.current.isContentVisible).toBe(false);
  });

  it('언마운트 후에는 예약된 타이머가 상태를 건드리지 않는다', () => {
    const { rerender, unmount } = setup(null);
    rerender({ panel: 'layout' });

    unmount();

    expect(() => vi.advanceTimersByTime(PANEL_FADE_MS * 3)).not.toThrow();
  });
});

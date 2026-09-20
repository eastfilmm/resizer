import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { useState } from 'react';
import { FocusReveal } from '../FocusReveal';

afterEach(cleanup);

/**
 * FocusReveal은 "슬라이더를 실제로 끌 때만 주변 UI를 걷어낸다"가 전부다.
 * 탭과 드래그를 가르는 4px 임계값, 포인터 종료 처리, enabled 해제가 핵심이며
 * 여기서 어긋나면 UI가 투명해진 채 남거나(조작 불가) 아예 반응하지 않는다.
 */

const DRAG_OVER_THRESHOLD = 10; // 4px 임계값을 확실히 넘기는 이동량

const renderRoot = (rootProps: Partial<Parameters<typeof FocusReveal.Root>[0]> = {}) =>
  render(
    <FocusReveal.Root {...rootProps}>
      <span data-testid="sibling">주변 UI</span>
      <FocusReveal.Trigger>
        <button data-testid="handle">핸들</button>
      </FocusReveal.Trigger>
    </FocusReveal.Root>,
  );

const root = () => document.querySelector('[data-focus-root]') as HTMLElement;
const trigger = () => document.querySelector('[data-focus-trigger]') as HTMLElement;
const isActive = () => root().hasAttribute('data-active');

/** 실제 포인터 제스처: 핸들에서 pointerdown → window로 이동 → 종료 */
const pointerDown = (target: Element, clientX = 0, clientY = 0) =>
  act(() => {
    target.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, clientX, clientY }),
    );
  });

const pointerMoveTo = (clientX: number, clientY = 0) =>
  act(() => {
    window.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY }));
  });

const pointerFinish = (type: 'pointerup' | 'pointercancel' = 'pointerup') =>
  act(() => {
    window.dispatchEvent(new PointerEvent(type));
  });

describe('FocusReveal', () => {
  it('Root 밖에서 Trigger를 쓰면 명확한 오류를 던진다', () => {
    // React가 렌더 실패를 콘솔로 보고하므로 테스트 출력만 조용히 시킨다
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      render(
        <FocusReveal.Trigger>
          <button>핸들</button>
        </FocusReveal.Trigger>,
      ),
    ).toThrow(/FocusReveal.Root/);

    consoleError.mockRestore();
  });

  it('초기에는 비활성이다', () => {
    renderRoot();
    expect(isActive()).toBe(false);
    expect(trigger()).not.toHaveAttribute('data-focus-active-trigger');
  });

  it('단순 탭(이동 없음)으로는 활성화되지 않는다', () => {
    renderRoot();

    pointerDown(screen.getByTestId('handle'));
    pointerFinish();

    expect(isActive()).toBe(false);
  });

  it('임계값(4px) 이하 미세 이동으로는 활성화되지 않는다', () => {
    renderRoot();

    pointerDown(screen.getByTestId('handle'));
    pointerMoveTo(3);

    expect(isActive()).toBe(false);
  });

  it('임계값을 넘겨 끌면 활성화된다', () => {
    renderRoot();

    pointerDown(screen.getByTestId('handle'));
    pointerMoveTo(DRAG_OVER_THRESHOLD);

    expect(isActive()).toBe(true);
    expect(trigger()).toHaveAttribute('data-focus-active-trigger');
  });

  it('pointerup으로 해제된다', () => {
    renderRoot();

    pointerDown(screen.getByTestId('handle'));
    pointerMoveTo(DRAG_OVER_THRESHOLD);
    pointerFinish('pointerup');

    expect(isActive()).toBe(false);
    expect(trigger()).not.toHaveAttribute('data-focus-active-trigger');
  });

  it('pointercancel로도 해제된다 (시스템 제스처에 드래그를 뺏기는 경우)', () => {
    renderRoot();

    pointerDown(screen.getByTestId('handle'));
    pointerMoveTo(DRAG_OVER_THRESHOLD);
    pointerFinish('pointercancel');

    expect(isActive()).toBe(false);
  });

  it('드래그가 끝나면 window 리스너를 남기지 않는다', () => {
    renderRoot();

    pointerDown(screen.getByTestId('handle'));
    pointerMoveTo(DRAG_OVER_THRESHOLD);
    pointerFinish();

    // 종료 후의 이동은 아무 영향이 없어야 한다
    pointerMoveTo(500);
    expect(isActive()).toBe(false);
  });

  it('enabled=false면 끌어도 활성화되지 않는다', () => {
    renderRoot({ enabled: false });

    pointerDown(screen.getByTestId('handle'));
    pointerMoveTo(DRAG_OVER_THRESHOLD);

    expect(isActive()).toBe(false);
  });

  it('드래그 도중 enabled가 꺼지면 즉시 해제된다', () => {
    const Harness = () => {
      const [enabled, setEnabled] = useState(true);
      return (
        <>
          <button data-testid="off" onClick={() => setEnabled(false)}>
            끄기
          </button>
          <FocusReveal.Root enabled={enabled}>
            <FocusReveal.Trigger>
              <button data-testid="handle">핸들</button>
            </FocusReveal.Trigger>
          </FocusReveal.Root>
        </>
      );
    };
    render(<Harness />);

    pointerDown(screen.getByTestId('handle'));
    pointerMoveTo(DRAG_OVER_THRESHOLD);
    expect(isActive()).toBe(true);

    act(() => {
      screen.getByTestId('off').click();
    });

    expect(isActive()).toBe(false);
  });

  it('비활성(disabled) 컨트롤에서 시작한 드래그는 무시한다', () => {
    render(
      <FocusReveal.Root>
        <FocusReveal.Trigger>
          <button data-testid="handle" disabled>
            핸들
          </button>
        </FocusReveal.Trigger>
      </FocusReveal.Root>,
    );

    pointerDown(screen.getByTestId('handle'));
    pointerMoveTo(DRAG_OVER_THRESHOLD);

    expect(isActive()).toBe(false);
  });

  it('Base UI의 data-disabled 컨트롤도 무시한다', () => {
    render(
      <FocusReveal.Root>
        <FocusReveal.Trigger>
          <div data-testid="handle" data-disabled="">
            핸들
          </div>
        </FocusReveal.Trigger>
      </FocusReveal.Root>,
    );

    pointerDown(screen.getByTestId('handle'));
    pointerMoveTo(DRAG_OVER_THRESHOLD);

    expect(isActive()).toBe(false);
  });

  it('dimOpacity와 transitionMs를 CSS 변수로 노출한다', () => {
    renderRoot({ dimOpacity: 0.25, transitionMs: 300 });

    expect(root().style.getPropertyValue('--focus-dim-opacity')).toBe('0.25');
    expect(root().style.getPropertyValue('--focus-transition')).toBe('300ms');
  });

  it('드래그 중 언마운트해도 리스너가 정리된다', () => {
    const { unmount } = renderRoot();

    pointerDown(screen.getByTestId('handle'));
    pointerMoveTo(DRAG_OVER_THRESHOLD);

    expect(() => {
      unmount();
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 999 }));
      window.dispatchEvent(new PointerEvent('pointerup'));
    }).not.toThrow();
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, render, screen, act, cleanup } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { DESKTOP_MEDIA_QUERY, DESKTOP_MIN_WIDTH_PX } from '../theme';

/**
 * 프리뷰 캔버스의 렌더 해상도가 이 값에 달려 있다(getPreviewScaleFactor).
 * 첫 렌더가 모바일로 고정되면 데스크톱에서 저해상도로 한 번 그렸다가 다시
 * 그리는 구간이 생기므로, 하이드레이션 시점에 값이 맞는지가 핵심이다.
 */

// 모듈이 matchMedia 결과를 캐시하므로 테스트 전체가 이 하나를 공유한다.
const listeners = new Set<() => void>();
const mediaQuery = {
  matches: false,
  media: DESKTOP_MEDIA_QUERY,
  addEventListener: (_: string, fn: () => void) => void listeners.add(fn),
  removeEventListener: (_: string, fn: () => void) => void listeners.delete(fn),
};

const matchMedia = vi.fn(() => mediaQuery);

const setViewport = (isDesktop: boolean) =>
  act(() => {
    mediaQuery.matches = isDesktop;
    listeners.forEach((fn) => fn());
  });

beforeEach(() => {
  mediaQuery.matches = false;
  listeners.clear();
  matchMedia.mockClear();
  Object.defineProperty(window, 'matchMedia', { value: matchMedia, configurable: true, writable: true });
});

afterEach(cleanup);

const Probe = () => <span>{String(useIsDesktop())}</span>;

// React가 act() 밖 렌더를 경고하지 않게 잠시 끄기 위한 전역 플래그
const reactGlobals = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean };

describe('useIsDesktop', () => {
  it('모바일 폭이면 false다', () => {
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);
  });

  // 예전 구현(useState + effect)은 여기서 반드시 false를 거쳐 갔다.
  it('데스크톱 폭이면 true다', () => {
    mediaQuery.matches = true;

    render(<Probe />);

    expect(screen.getByText('true')).toBeInTheDocument();
  });

  /**
   * 이 훅을 바꾼 진짜 이유.
   *
   * effect는 페인트 뒤에 흐른다. 그래서 useState + effect 구현은 데스크톱에서도
   * 첫 페인트가 반드시 모바일 값이었다. 테스트에서 act()는 effect를 앞당겨
   * 흘려버리므로 최종 DOM만 보면 두 구현이 구별되지 않는다.
   * 커밋 직후·effect 이전 상태를 직접 확인해야 한다.
   */
  it('첫 커밋 시점에 이미 데스크톱 값이다 (effect를 기다리지 않는다)', () => {
    mediaQuery.matches = true;

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const wasActEnvironment = reactGlobals.IS_REACT_ACT_ENVIRONMENT;
    reactGlobals.IS_REACT_ACT_ENVIRONMENT = false;

    try {
      // flushSync는 렌더와 커밋만 동기로 끝낸다. passive effect는 아직 흐르지 않았다.
      flushSync(() => root.render(<Probe />));

      expect(container.textContent).toBe('true');
    } finally {
      reactGlobals.IS_REACT_ACT_ENVIRONMENT = wasActEnvironment;
      flushSync(() => root.unmount());
      document.body.removeChild(container);
    }
  });

  it('뷰포트가 넓어지면 반영한다', () => {
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);

    setViewport(true);

    expect(result.current).toBe(true);
  });

  it('뷰포트가 좁아지면 반영한다', () => {
    mediaQuery.matches = true;
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);

    setViewport(false);

    expect(result.current).toBe(false);
  });

  it('언마운트하면 리스너를 떼어 놓는다', () => {
    const { unmount } = renderHook(() => useIsDesktop());
    expect(listeners.size).toBe(1);

    unmount();

    expect(listeners.size).toBe(0);
  });

  // matchMedia 결과는 모듈에 캐시되므로, 질의 문자열을 보려면 새로 불러와야 한다.
  it('CSS와 같은 브레이크포인트를 질의한다', async () => {
    vi.resetModules();
    const { useIsDesktop: fresh } = await import('../hooks/useIsDesktop');

    renderHook(() => fresh());

    expect(matchMedia).toHaveBeenCalledWith(`(min-width: ${DESKTOP_MIN_WIDTH_PX}px)`);
  });

  // 프리렌더에는 뷰포트가 없다. 서버가 데스크톱으로 단정하면 모바일 사용자가
  // 데스크톱 레이아웃을 한 번 보게 된다.
  it('서버 렌더에서는 뷰포트를 모르므로 모바일로 그린다', () => {
    mediaQuery.matches = true; // 클라이언트는 데스크톱이어도

    expect(renderToString(<Probe />)).toContain('>false<');
  });

  // 이 훅을 바꾼 이유. 예전 구현은 하이드레이션 후 effect에서야 값을 고쳐
  // 데스크톱에서도 첫 페인트가 모바일이었다.
  it('하이드레이션 직후 경고 없이 데스크톱 값으로 맞춘다', async () => {
    mediaQuery.matches = true;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const container = document.createElement('div');
    container.innerHTML = renderToString(<Probe />);
    document.body.appendChild(container);

    await act(async () => {
      hydrateRoot(container, <Probe />);
    });

    expect(container.textContent).toBe('true');
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
    document.body.removeChild(container);
  });

  it('여러 컴포넌트가 같은 값을 본다', () => {
    mediaQuery.matches = true;
    const A = () => <span data-testid="a">{String(useIsDesktop())}</span>;
    const B = () => <span data-testid="b">{String(useIsDesktop())}</span>;

    render(<><A /><B /></>);

    expect(screen.getByTestId('a').textContent).toBe('true');
    expect(screen.getByTestId('b').textContent).toBe('true');
  });
});

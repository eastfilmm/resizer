import { describe, it, expect, afterEach } from 'vitest';
import { render, renderHook, screen, cleanup } from '@testing-library/react';
import { PlatformProvider, usePlatform, type Platform } from '../platform';

/**
 * 주입이 없을 때의 기본값이 중요하다. 기본값이 "네이티브 있음"이면 앱이
 * 구현을 넣는 걸 잊었을 때 저장이 조용히 사라진다. 기본은 항상 "없음"이어야 한다.
 */

afterEach(cleanup);

const Probe = () => {
  const platform = usePlatform();
  return <span data-testid="native">{String(platform.isNativeAvailable())}</span>;
};

const nativeFlag = () => screen.getByTestId('native').textContent;

describe('PlatformProvider', () => {
  it('Provider 없이 쓰면 네이티브 없음으로 동작한다', () => {
    render(<Probe />);
    expect(nativeFlag()).toBe('false');
  });

  it('기본 구현의 저장·공유는 아무 일도 하지 않고 끝난다', async () => {
    const { result } = renderHook(() => usePlatform());

    await expect(result.current.saveImagesNatively([])).resolves.toBeUndefined();
    await expect(
      result.current.shareImageNatively({ canvas: document.createElement('canvas'), fileName: 'a.png' }),
    ).resolves.toBeUndefined();
  });

  it('주입한 구현을 하위에서 받는다', () => {
    const platform: Platform = {
      isNativeAvailable: () => true,
      saveImagesNatively: async () => {},
      shareImageNatively: async () => {},
    };

    render(
      <PlatformProvider value={platform}>
        <Probe />
      </PlatformProvider>,
    );

    expect(nativeFlag()).toBe('true');
  });

  it('안쪽 Provider가 바깥을 덮어쓴다', () => {
    const outer: Platform = {
      isNativeAvailable: () => true,
      saveImagesNatively: async () => {},
      shareImageNatively: async () => {},
    };
    const inner: Platform = { ...outer, isNativeAvailable: () => false };

    render(
      <PlatformProvider value={outer}>
        <PlatformProvider value={inner}>
          <Probe />
        </PlatformProvider>
      </PlatformProvider>,
    );

    expect(nativeFlag()).toBe('false');
  });
});

'use client';

import { useRef, useCallback, useEffect } from 'react';

/**
 * rAF 기반 스로틀 훅.
 *
 * 한 프레임 안에 여러 번 요청이 들어와도 마지막 콜백 하나만 실행한다.
 * 슬라이더 드래그는 포인터 이벤트를 초당 60~120회 발생시키는데,
 * 스로틀이 없으면 매 이벤트마다 캔버스를 통째로 다시 그리게 된다.
 * 브라우저 종류와 무관하게 항상 적용한다.
 */
export const useRafThrottle = () => {
  const rafIdRef = useRef<number | null>(null);
  const pendingCallbackRef = useRef<(() => void) | null>(null);

  const throttle = useCallback((callback: () => void) => {
    // 같은 프레임에 들어온 이전 요청은 버리고 최신 것만 남긴다.
    pendingCallbackRef.current = callback;

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const pending = pendingCallbackRef.current;
        pendingCallbackRef.current = null;
        pending?.();
      });
    }
  }, []);

  const cleanup = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    pendingCallbackRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  return { throttle, cleanup };
};

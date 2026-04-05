import { useRef, useCallback, useEffect } from 'react';

/**
 * Safari에서 RAF 기반 스로틀링을 적용하는 훅.
 * isSafari가 false면 콜백을 즉시 실행한다.
 */
export const useSafariRafThrottle = (isSafari: boolean) => {
  const rafIdRef = useRef<number | null>(null);
  const pendingRenderRef = useRef(false);

  const throttle = useCallback(
    (callback: () => void) => {
      if (!isSafari) {
        callback();
        return;
      }

      pendingRenderRef.current = true;
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          if (pendingRenderRef.current) {
            pendingRenderRef.current = false;
            callback();
          }
        });
      }
    },
    [isSafari],
  );

  const cleanup = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  return { throttle, cleanup };
};

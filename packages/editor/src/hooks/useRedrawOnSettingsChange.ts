'use client';

import { useEffect, useRef } from 'react';
import { useStore } from 'jotai';
import { useRafThrottle } from '@resizer/ui';
import { imageSettingsAtom } from '../atoms/imageAtoms';

interface Options {
  /** 설정이 이 시간 동안 잠잠해진 뒤에만 그린다. 썸네일처럼 급하지 않은 곳용. */
  debounceMs?: number;
}

/**
 * 설정이 바뀌면 React 렌더를 거치지 않고 캔버스를 다시 그린다.
 *
 * 슬라이더 드래그는 초당 60~120번 설정을 바꾼다. 컴포넌트를 매번 리렌더하는
 * 대신 스토어를 직접 구독하고, rAF로 묶어 프레임당 한 번만 `redraw`를 부른다.
 * `redraw`는 호출 시점에 `store.get`으로 최신 설정을 읽으면 된다.
 */
export const useRedrawOnSettingsChange = (redraw: () => void, { debounceMs }: Options = {}) => {
  const store = useStore();
  const { throttle } = useRafThrottle();

  // 구독은 한 번만 하고, 매 렌더의 최신 redraw를 부른다.
  const redrawRef = useRef(redraw);
  useEffect(() => {
    redrawRef.current = redraw;
  }, [redraw]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => throttle(() => redrawRef.current());

    const unsubscribe = store.sub(imageSettingsAtom, () => {
      if (debounceMs === undefined) {
        schedule();
        return;
      }
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        schedule();
      }, debounceMs);
    });

    return () => {
      unsubscribe();
      if (timer !== null) clearTimeout(timer);
    };
  }, [store, throttle, debounceMs]);
};

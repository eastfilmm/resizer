'use client';

import { useSyncExternalStore } from 'react';
import { DESKTOP_MEDIA_QUERY } from '../theme';

/**
 * 뷰포트가 데스크톱 폭인지 여부.
 *
 * 예전 구현은 useState(false) + effect에서 갱신이었다. effect는 페인트 뒤에
 * 흐르므로 데스크톱에서도 첫 페인트는 반드시 모바일 값으로 그려졌다.
 * 프리뷰 캔버스의 렌더 해상도가 이 값에 달려 있어(getPreviewScaleFactor),
 * 저해상도로 한 번 그린 뒤 다시 그리는 구간이 생긴다.
 *
 * useSyncExternalStore는 하이드레이션 직후 동기 재렌더로 값을 맞추므로
 * 그 구간이 사라진다. effect 안에서 setState를 부르지 않는다는 점도 같다.
 */

// matchMedia 결과는 재사용한다. getSnapshot은 렌더마다 불리기 때문이다.
let mediaQuery: MediaQueryList | null = null;
const getMediaQuery = () => (mediaQuery ??= window.matchMedia(DESKTOP_MEDIA_QUERY));

const subscribe = (onStoreChange: () => void) => {
  const mql = getMediaQuery();
  mql.addEventListener('change', onStoreChange);
  return () => mql.removeEventListener('change', onStoreChange);
};

const getSnapshot = () => getMediaQuery().matches;

// 서버와 프리렌더에는 뷰포트가 없다. 모바일을 기본으로 둔다.
const getServerSnapshot = () => false;

export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

'use client';

import { useCallback, useMemo, useState } from 'react';

/**
 * 클릭 시 비워지는 hover 상태.
 *
 * CSS `:hover`는 브라우저가 소유하고 **포인터가 움직여야만 재평가된다.**
 * 그래서 "선택된 동안 hover를 억제"하는 스타일을 쓰면, 클릭으로 선택을
 * 해제하는 순간 억제만 풀리고 포인터는 그대로라 hover 스타일이 그 자리에
 * 남아버린다(파란 보더·회색 배경 잔상).
 *
 * 포인터 이벤트로 직접 관리하고 클릭 시 비우면, 다시 칠해지려면 포인터가
 * 실제로 움직여야 한다. 터치 기기에서 탭 후 hover가 남는 문제도 함께 없어진다.
 *
 * @example
 * const { hoveredKey, hoverProps, clearHover } = useClickClearedHover<FrameType>();
 * <Button {...hoverProps('polaroid')} $isHovered={hoveredKey === 'polaroid'}
 *         onClick={() => { clearHover(); toggle('polaroid'); }} />
 */
export const useClickClearedHover = <K extends string>() => {
  const [hoveredKey, setHoveredKey] = useState<K | null>(null);

  const clearHover = useCallback(() => setHoveredKey(null), []);

  const hoverProps = useCallback(
    (key: K) => ({
      onPointerEnter: () => setHoveredKey(key),
      onPointerLeave: () =>
        setHoveredKey((prev) => (prev === key ? null : prev)),
    }),
    [],
  );

  /** 그룹 전체를 벗어날 때 확실히 해제하기 위해 컨테이너에 붙인다. */
  const containerProps = useMemo(
    () => ({ onPointerLeave: clearHover }),
    [clearHover],
  );

  return { hoveredKey, hoverProps, containerProps, clearHover };
};

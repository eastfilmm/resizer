'use client';

import { useCallback } from 'react';
import { useStore } from 'jotai';
import {
  imageSettingsAtom,
  prevBackgroundColorAtom,
  type BackgroundColor,
  type FrameType,
  type ImageSettings,
} from '../atoms/imageAtoms';

export const FRAME_DEFAULT_PADDING = 80;

interface FrameToggleState {
  settings: ImageSettings;
  /** Thin/Film이 배경을 흰색으로 고정하기 전 색. 프레임을 벗어날 때 되돌린다. */
  prevBackgroundColor: BackgroundColor | null;
}

/**
 * 프레임 버튼을 눌렀을 때의 다음 상태.
 *
 * - 켜진 프레임을 다시 누르면 끈다.
 * - Thin/Film은 배경을 흰색으로 고정하고, 원래 색은 기억했다가 벗어날 때 복원한다.
 * - Polaroid는 배경을 건드리지 않는다. 다른 프레임으로 바꾸면 날짜를 비운다.
 */
export const toggleFrame = (
  { settings, prevBackgroundColor }: FrameToggleState,
  type: FrameType,
): FrameToggleState => {
  const current = settings.frameType;

  if (current === type) {
    const restore = type !== 'polaroid' && prevBackgroundColor;
    return {
      settings: {
        ...settings,
        frameType: 'none',
        padding: 0,
        ...(restore && { backgroundColor: prevBackgroundColor }),
      },
      prevBackgroundColor: restore ? null : prevBackgroundColor,
    };
  }

  const activated = { ...settings, frameType: type, padding: FRAME_DEFAULT_PADDING };

  if (type !== 'polaroid') {
    return {
      settings: { ...activated, polaroidDate: '', backgroundColor: 'white' },
      prevBackgroundColor:
        settings.backgroundColor !== 'white' ? settings.backgroundColor : prevBackgroundColor,
    };
  }

  // Thin/Film → Polaroid 전환이면 흰색으로 고정했던 배경을 돌려놓는다.
  const restore = current !== 'none' && prevBackgroundColor;
  return {
    settings: {
      ...activated,
      ...(restore && { backgroundColor: prevBackgroundColor }),
    },
    prevBackgroundColor: restore ? null : prevBackgroundColor,
  };
};

export const useFrameToggle = () => {
  const store = useStore();

  return useCallback(
    (type: FrameType) => {
      const next = toggleFrame(
        {
          settings: store.get(imageSettingsAtom),
          prevBackgroundColor: store.get(prevBackgroundColorAtom),
        },
        type,
      );
      store.set(imageSettingsAtom, next.settings);
      store.set(prevBackgroundColorAtom, next.prevBackgroundColor);
    },
    [store],
  );
};

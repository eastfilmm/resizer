'use client';

import { useCallback, useMemo } from 'react';
import { useStore } from 'jotai';
import {
  imageSettingsAtom,
  prevBackgroundColorAtom,
  type BackgroundColor,
  type FrameType,
  type ImageSettings,
  type SelectableFrameType,
} from '../atoms/imageAtoms';

interface FrameToggleState {
  settings: ImageSettings;
  /** Thin/Film이 배경을 흰색으로 고정하기 전 색. 프레임을 벗어날 때 되돌린다. */
  prevBackgroundColor: BackgroundColor | null;
}

/**
 * 프레임을 켜고 끄는 기본 전이. 버튼·스위치는 아래 selectFrame/setFrameEnabled를 쓴다.
 *
 * - 켜진 프레임을 다시 넘기면 끈다. 켤 때는 lastFrameType에 기억한다.
 * - 여백(padding)은 건드리지 않는다. 기본 여백이 있고, 사용자가 Layout에서
 *   맞춘 값이 프레임을 켜고 꺼도 유지돼야 한다.
 * - Thin/Film은 배경을 흰색으로 고정하고, 원래 색은 기억했다가 벗어날 때 복원한다.
 * - Polaroid는 배경을 건드리지 않는다. 날짜는 직접 입력하지 않았다면 사진마다
 *   자기 촬영일이 찍힌다(resolvePolaroidDate). 다른 프레임으로 바꾸면 입력값을
 *   버리고 다시 촬영일을 따르게 한다.
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
        ...(restore && { backgroundColor: prevBackgroundColor }),
      },
      prevBackgroundColor: restore ? null : prevBackgroundColor,
    };
  }

  const activated = {
    ...settings,
    frameType: type,
    ...(type !== 'none' && { lastFrameType: type }),
  };

  if (type !== 'polaroid') {
    return {
      settings: { ...activated, polaroidDate: null, backgroundColor: 'white' },
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

/** 프레임 버튼: 종류만 고른다. 이미 켜진 프레임을 다시 눌러도 끄지 않는다(끄기는 스위치). */
export const selectFrame = (state: FrameToggleState, type: SelectableFrameType): FrameToggleState =>
  state.settings.frameType === type ? state : toggleFrame(state, type);

/** 프레임 스위치: 켜면 마지막에 쓴 프레임으로, 끄면 지금 프레임을 해제한다. */
export const setFrameEnabled = (state: FrameToggleState, enabled: boolean): FrameToggleState => {
  const { frameType, lastFrameType } = state.settings;
  const isEnabled = frameType !== 'none';
  if (enabled === isEnabled) return state;
  return toggleFrame(state, enabled ? lastFrameType : frameType);
};

export const useFrameToggle = () => {
  const store = useStore();

  const apply = useCallback(
    (update: (state: FrameToggleState) => FrameToggleState) => {
      const next = update({
        settings: store.get(imageSettingsAtom),
        prevBackgroundColor: store.get(prevBackgroundColorAtom),
      });
      store.set(imageSettingsAtom, next.settings);
      store.set(prevBackgroundColorAtom, next.prevBackgroundColor);
    },
    [store],
  );

  return useMemo(
    () => ({
      selectFrame: (type: SelectableFrameType) => apply((state) => selectFrame(state, type)),
      setFrameEnabled: (enabled: boolean) => apply((state) => setFrameEnabled(state, enabled)),
    }),
    [apply],
  );
};

'use client';

import { useCallback, useMemo } from 'react';
import { useStore } from 'jotai';
import {
  imageSettingsAtom,
  type FrameType,
  type ImageSettings,
  type SelectableFrameType,
} from '../atoms/imageAtoms';

/**
 * 프레임을 켜고 끄는 기본 전이. 버튼·스위치는 아래 selectFrame/setFrameEnabled를 쓴다.
 *
 * - 켜진 프레임을 다시 넘기면 끈다. 켤 때는 lastFrameType에 기억한다.
 * - 여백(padding)과 배경색은 건드리지 않는다. 사용자가 Layout·Background에서
 *   맞춘 값이 프레임을 켜고 꺼도 그대로 유지돼야 한다.
 * - 날짜는 직접 입력하지 않았다면 사진마다 자기 촬영일이 찍힌다
 *   (resolvePolaroidDate). Polaroid가 아닌 프레임으로 바꾸면 입력값을 버리고
 *   다시 촬영일을 따르게 한다.
 */
export const toggleFrame = (settings: ImageSettings, type: FrameType): ImageSettings => {
  if (settings.frameType === type) {
    return { ...settings, frameType: 'none' };
  }

  return {
    ...settings,
    frameType: type,
    ...(type !== 'none' && { lastFrameType: type }),
    ...(type !== 'polaroid' && { polaroidDate: null }),
  };
};

/** 프레임 버튼: 종류만 고른다. 이미 켜진 프레임을 다시 눌러도 끄지 않는다(끄기는 스위치). */
export const selectFrame = (settings: ImageSettings, type: SelectableFrameType): ImageSettings =>
  settings.frameType === type ? settings : toggleFrame(settings, type);

/** 프레임 스위치: 켜면 마지막에 쓴 프레임으로, 끄면 지금 프레임을 해제한다. */
export const setFrameEnabled = (settings: ImageSettings, enabled: boolean): ImageSettings => {
  const isEnabled = settings.frameType !== 'none';
  if (enabled === isEnabled) return settings;
  return toggleFrame(settings, enabled ? settings.lastFrameType : settings.frameType);
};

export const useFrameToggle = () => {
  const store = useStore();

  const apply = useCallback(
    (update: (settings: ImageSettings) => ImageSettings) => {
      store.set(imageSettingsAtom, update(store.get(imageSettingsAtom)));
    },
    [store],
  );

  return useMemo(
    () => ({
      selectFrame: (type: SelectableFrameType) => apply((settings) => selectFrame(settings, type)),
      setFrameEnabled: (enabled: boolean) => apply((settings) => setFrameEnabled(settings, enabled)),
    }),
    [apply],
  );
};

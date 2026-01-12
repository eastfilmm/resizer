import { atom } from 'jotai';

// 이미지 Blob URL
export const imageUrlAtom = atom<string | null>(null);

// 캔버스 배경색 ('white' | 'black')
export const backgroundColorAtom = atom<'white' | 'black'>('white');

// Glass Blur 효과 활성화 여부
export const glassBlurAtom = atom<boolean>(false);

// Glass Blur 강도 (1-100%, 내부적으로 px로 변환하여 사용)
export const blurIntensityAtom = atom<number>(30);

// 색상 오버레이 투명도 (0-100%, 0.0-1.0)
export const overlayOpacityAtom = atom<number>(0.3);

// 캔버스 패딩 (0-200px 범위, 캔버스 기준 2000px)
export const paddingAtom = atom<number>(0);

// Copyright 기능 활성화 여부
export const copyrightEnabledAtom = atom<boolean>(false);

// Copyright 텍스트
export const copyrightTextAtom = atom<string>('');

// Reset 가능 여부 (이미지가 있거나 필터가 초기값과 다를 때)
export const canResetAtom = atom((get) => {
  const hasImage = get(imageUrlAtom) !== null;
  const hasFilterChanges =
    get(backgroundColorAtom) !== 'white' ||
    get(paddingAtom) !== 0 ||
    get(glassBlurAtom) !== false ||
    get(blurIntensityAtom) !== 30 ||
    get(overlayOpacityAtom) !== 0.3 ||
    get(copyrightEnabledAtom) !== false;

  return hasImage || hasFilterChanges;
});

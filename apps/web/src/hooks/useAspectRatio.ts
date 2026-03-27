'use client';

import { useAtom } from 'jotai';
import { canvasAspectRatioAtom } from '@/atoms/imageAtoms';
import type { AspectRatio } from '@/atoms/imageAtoms';

export const useAspectRatio = () => {
  const [aspectRatio, setAspectRatio] = useAtom(canvasAspectRatioAtom);

  const updateAspectRatio = (newRatio: AspectRatio) => {
    setAspectRatio(newRatio);
  };

  return { aspectRatio, updateAspectRatio };
};

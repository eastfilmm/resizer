'use client';

import { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { canvasAspectRatioAtom } from '@/atoms/imageAtoms';
import { ASPECT_RATIO_STORAGE_KEY } from '@/constants/CanvasContents';

export const useAspectRatio = () => {
  const [aspectRatio, setAspectRatio] = useAtom(canvasAspectRatioAtom);

  useEffect(() => {
    const saved = localStorage.getItem(ASPECT_RATIO_STORAGE_KEY);
     if (saved === '1:1' || saved === '4:5' || saved === '9:16') {
      setAspectRatio(saved);
    }

  }, [setAspectRatio]);

  const updateAspectRatio = (newRatio: '1:1' | '4:5' | '9:16') => {
    setAspectRatio(newRatio);
    localStorage.setItem(ASPECT_RATIO_STORAGE_KEY, newRatio);
  };

  return { aspectRatio, updateAspectRatio };
};

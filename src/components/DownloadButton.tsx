'use client';

import { RefObject } from 'react';
import { useAtomValue } from 'jotai';
import { imageUrlAtom, copyrightTextAtom } from '@/atoms/imageAtoms';
import { useResetState } from '@/hooks/useResetState';
import { IconButton, ButtonIcon } from '@/components/styled/Button';
import { COPYRIGHT_STORAGE_KEY } from '@/constants/canvas';

interface DownloadButtonProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const DownloadButton = ({ canvasRef, fileInputRef }: DownloadButtonProps) => {
  const imageUrl = useAtomValue(imageUrlAtom);
  const copyrightText = useAtomValue(copyrightTextAtom);
  const resetState = useResetState({ canvasRef, fileInputRef });

  const handleDownload = () => {
    if (!canvasRef.current) return;

    // Save copyright text to localStorage
    if (copyrightText) {
      localStorage.setItem(COPYRIGHT_STORAGE_KEY, copyrightText);
    }

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `resized-image-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();

    // Reset all state after download
    resetState();
  };

  return (
    <IconButton $variant="primary" disabled={!imageUrl} onClick={handleDownload}>
      <ButtonIcon src="/download.svg" alt="Download" />
    </IconButton>
  );
};

'use client';

import { RefObject } from 'react';
import { useAtomValue } from 'jotai';
import { canResetAtom } from '@/atoms/imageAtoms';
import { useResetState } from '@/hooks/useResetState';
import { IconButton, ButtonIcon } from '@/components/styled/Button';

interface ResetButtonProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const ResetButton = ({ canvasRef, fileInputRef }: ResetButtonProps) => {
  const canReset = useAtomValue(canResetAtom);
  const resetState = useResetState({ canvasRef, fileInputRef });

  return (
    <IconButton
      $variant={canReset ? 'danger' : 'secondary'}
      disabled={!canReset}
      onClick={resetState}
    >
      <ButtonIcon src="/refresh_icon.svg" alt="Reset" />
    </IconButton>
  );
};

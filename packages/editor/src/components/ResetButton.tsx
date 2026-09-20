'use client';

import { IconButton, ButtonIcon } from '@resizer/ui';
import type { RefObject } from 'react';
import { useAtomValue } from 'jotai';
import { canResetAtom } from '../atoms/imageAtoms';
import { useResetState } from '../hooks/useResetState';
interface ResetButtonProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export const ResetButton = ({ canvasRef }: ResetButtonProps) => {
  const canReset = useAtomValue(canResetAtom);
  const resetState = useResetState({ canvasRef });

  return (
    <IconButton
      $variant={canReset ? 'danger' : 'secondary'}
      disabled={!canReset}
      onClick={resetState}
      style={{ opacity: 0.9 }}
    >
      <ButtonIcon src="/refresh_icon.svg" alt="Reset" />
    </IconButton>
  );
};

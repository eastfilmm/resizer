'use client';

import styled from 'styled-components';
import { RefObject } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { imageUrlAtom } from '@/atoms/imageAtoms';
import { resetCanvasToWhite } from '@/utils/canvas';

interface ActionButtonsProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export default function ActionButtons({ canvasRef, fileInputRef }: ActionButtonsProps) {
  const imageUrl = useAtomValue(imageUrlAtom);
  const setImageUrl = useSetAtom(imageUrlAtom);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `resized-image-${Date.now()}.png`;
    // Download as high quality PNG
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();

    // Reset all state after download
    handleReset();
  };

  const handleReset = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (canvasRef.current) {
      resetCanvasToWhite(canvasRef.current);
    }
  };

  return (
    <ButtonGroup>
      <Button disabled={!imageUrl} onClick={handleDownload}>
        Download
      </Button>
      <Button disabled={!imageUrl} variant="secondary" onClick={handleReset}>
        Reset
      </Button>
    </ButtonGroup>
  );
}

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
`;

interface ButtonProps {
  variant?: 'secondary';
}

const Button = styled.button<ButtonProps>`
  background-color: ${props => props.variant === 'secondary' ? '#6c757d' : '#28a745'};
  color: white;
  border: none;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  touch-action: manipulation;
  width: 100%;
  max-width: 320px;
  height: 40px;
  
  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#5a6268' : '#218838'};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;
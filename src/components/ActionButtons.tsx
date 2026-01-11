'use client';

import styled from 'styled-components';
import { RefObject } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { imageUrlAtom, backgroundColorAtom } from '@/atoms/imageAtoms';
import { resetCanvas } from '@/utils/canvas';
import ImageUploader from './ImageUploader';

interface ActionButtonsProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export default function ActionButtons({ canvasRef, fileInputRef }: ActionButtonsProps) {
  const imageUrl = useAtomValue(imageUrlAtom);
  const setImageUrl = useSetAtom(imageUrlAtom);
  const backgroundColor = useAtomValue(backgroundColorAtom);

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
      resetCanvas(canvasRef.current, backgroundColor);
    }
  };

  return (
    <ButtonGroup>
      <ImageUploader fileInputRef={fileInputRef} />
      <Button disabled={!imageUrl} onClick={handleDownload}>
        Download
      </Button>
      <ResetButton disabled={!imageUrl} variant="secondary" onClick={handleReset}>
        <Icon src="/refresh_icon.svg" alt="Reset" />
      </ResetButton>
    </ButtonGroup>
  );
}

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
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

const ResetButton = styled(Button)`
  width: 40px !important;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  flex: 0 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
`;
'use client';

import styled from 'styled-components';
import { RefObject } from 'react';
import { resetCanvasToWhite } from '@/utils/canvas';



interface ActionButtonsProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onReset: () => void;
}

export default function ActionButtons({ canvasRef, onReset }: ActionButtonsProps) {
  const handleDownload = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `resized-image-${Date.now()}.png`;
    // Download as high quality PNG
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();

    // Reset canvas to white background after download
    resetCanvasToWhite(canvas);
  };

  return (
    <ButtonGroup>
      <Button onClick={handleDownload}>
        Download
      </Button>
      <Button variant="secondary" onClick={onReset}>
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
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  touch-action: manipulation;
  
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
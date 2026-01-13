'use client';

import styled from 'styled-components';
import { RefObject } from 'react';
import { ImageUploader } from './ImageUploader';
import { DownloadButton } from './DownloadButton';
import { ResetButton } from './ResetButton';

interface ActionButtonsProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export default function ActionButtons({ canvasRef, fileInputRef }: ActionButtonsProps) {
  return (
    <ButtonGroup>
      <ImageUploader fileInputRef={fileInputRef} />
      <DownloadButton canvasRef={canvasRef} fileInputRef={fileInputRef} />
      <ResetButton canvasRef={canvasRef} fileInputRef={fileInputRef} />
    </ButtonGroup>
  );
}

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: right;
  gap: 8px;
  width: 100%;
  max-width: 320px;
`;

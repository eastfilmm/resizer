'use client';

import styled from 'styled-components';
import { RefObject } from 'react';
import { ImageUploader } from './ImageUploader';
import { DownloadButton } from './DownloadButton';
import { ResetButton } from './ResetButton';

interface ActionButtonsProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export default function ActionButtons({ canvasRef, fileInputRef }: ActionButtonsProps) {
  return (
    <ButtonGroup>
      <ImageUploader fileInputRef={fileInputRef} />
      <DownloadButton />
      <ResetButton canvasRef={canvasRef} fileInputRef={fileInputRef} />
    </ButtonGroup>
  );
}

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

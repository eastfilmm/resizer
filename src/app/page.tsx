'use client';

import { useRef } from 'react';
import { Container, Main, Title } from '@/components/styled/Layout';
import ImageUploader from '@/components/ImageUploader';
import ImageCanvas from '@/components/ImageCanvas';
import ActionButtons from '@/components/ActionButtons';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <Main>
        <Title>Image Resizer</Title>
        
        <ImageUploader fileInputRef={fileInputRef} />

        <ImageCanvas canvasRef={canvasRef} />

        <ActionButtons canvasRef={canvasRef} fileInputRef={fileInputRef} />
      </Main>
    </Container>
  );
}

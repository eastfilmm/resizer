'use client';

import { useRef } from 'react';
import { Container, Main, Title } from '@/components/styled/Layout';
import ImageUploader from '@/components/ImageUploader';
import CanvasBackgroundSelector from '@/components/CanvasBackgroundSelector';
import ImageCanvas from '@/components/ImageCanvas';
import ActionButtons from '@/components/ActionButtons';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <Main>
        <Title>Image Resizer</Title>
        {/* 이미지 업로드 및 다운로드 버튼 */}
        <ImageUploader fileInputRef={fileInputRef} />
        <ActionButtons canvasRef={canvasRef} fileInputRef={fileInputRef} />

        {/* 이미지 캔버스 */}
        <ImageCanvas canvasRef={canvasRef} />
        {/* 캔버스 관련 속성 */}
        <CanvasBackgroundSelector />
 
      </Main>
    </Container>
  );
}

'use client';

import { useRef } from 'react';
import { Container, Main, Title } from '@/components/styled/Layout';
import ImageUploader from '@/components/ImageUploader';
import CanvasBackgroundSelector from '@/components/CanvasBackgroundSelector';
import ImageCanvas from '@/components/ImageCanvas';
import ActionButtons from '@/components/ActionButtons';
import { styled } from 'styled-components';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <Main>
        <Title>Image Resizer</Title>
        {/* 이미지 업로드 및 다운로드 버튼 */}
       
        <ActionButtons canvasRef={canvasRef} fileInputRef={fileInputRef} />

        {/* 이미지 캔버스 */}
        <ImageCanvas canvasRef={canvasRef} />
        <BottonSection>
        {/* 캔버스 관련 속성 */}
          <CanvasBackgroundSelector />
        </BottonSection>
      </Main>
    </Container>
  );
}

const BottonSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  height: 40px;
  padding: 0px 10px;
  max-width: 320px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;
'use client';

import { useRef } from 'react';
import styled from 'styled-components';
import { Container, Main, Title } from '@/components/styled/Layout';
import ImageCanvas from '@/components/ImageCanvas';
import ActionButtons from '@/components/ActionButtons';
import { BottomSection } from '@/components/BottomSection';

const BOTTOM_SHEET_COLLAPSED_HEIGHT = 48;

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

       
        {/* 바텀시트 공간 확보 */}
        <BottomSpacer />
      </Main>
      
      {/* 바텀시트 */}
      <BottomSection />
    </Container>
  );
}

const BottomSpacer = styled.div`
  height: ${BOTTOM_SHEET_COLLAPSED_HEIGHT}px;
  flex-shrink: 0;
`;


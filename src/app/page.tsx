'use client';

import { useRef } from 'react';
import styled from 'styled-components';
import { Container, Main, Title } from '@/components/styled/Layout';
import ImageCanvas from '@/components/ImageCanvas';
import ActionButtons from '@/components/ActionButtons';
import { NavigationBar } from '@/components/NavigationBar';

const NAV_HEIGHT = 200;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <Main>
        <Title>Image Resizer</Title>
      
        {/* 이미지 캔버스 */}
        <ImageCanvas canvasRef={canvasRef} />

        {/* 이미지 업로드 및 다운로드 버튼 */}
        <ActionButtons canvasRef={canvasRef} fileInputRef={fileInputRef} />

       
      {/* 네비게이션 바 공간 확보 */}
      <NavSpacer />
      </Main>
      
      {/* 네비게이션 바 */}
      <NavigationBar />
    </Container>
  );
}

const NavSpacer = styled.div`
  height: ${NAV_HEIGHT}px;
  flex-shrink: 0;
`;


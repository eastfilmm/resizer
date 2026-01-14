'use client';

import { useRef } from 'react';
import styled from 'styled-components';
import { Container, Main, Title, SubTitle } from '@/components/styled/Layout';
import ImageCanvas from '@/components/ImageCanvas';
import SafariImageCanvas from '@/components/SafariImageCanvas';
import ActionButtons from '@/components/ActionButtons';
import { NavigationBar } from '@/components/NavigationBar';
import { useIsSafari } from '@/hooks/useIsSafari';

const NAV_HEIGHT = 200;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSafari = useIsSafari();

  return (
    <Container>
      <Main>
        <HeaderWrapper>
        <Title>Image Resizer</Title>
        <SubTitle>for Instagram</SubTitle>
        </HeaderWrapper>
        {/* 이미지 캔버스 - Safari는 최적화된 버전 사용 */}
        {isSafari ? (
          <SafariImageCanvas canvasRef={canvasRef} />
        ) : (
          <ImageCanvas canvasRef={canvasRef} />
        )}

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

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
`;
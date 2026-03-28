'use client';

import { useRef } from 'react';
import styled from 'styled-components';
import { Container, Main } from '@/components/styled/Layout';
import ImageCanvas from '@/components/ImageCanvas';
import { DownloadButton } from '@/components/DownloadButton';
import { ShareButton } from '@/components/ShareButton';
import { ThumbnailStrip } from '@/components/ThumbnailStrip';
import { NavigationBar } from '@/components/NavigationBar';
import { useIsSafari } from '@/hooks/useIsSafari';

const NAV_HEIGHT = 200;

export default function ClientPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSafari = useIsSafari();

  return (
    <Container>
      <Main>
        <CanvasWrapper>
          <ImageCanvas canvasRef={canvasRef} isSafari={isSafari} />
          <FloatingButtons>
            <ShareButton />
            <DownloadButton />
          </FloatingButtons>
        </CanvasWrapper>
        <ThumbnailStrip isSafari={isSafari} />

        <NavSpacer />
      </Main>

      <NavigationBar />
    </Container>
  );
}

const CanvasWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  position: relative;
`;

const FloatingButtons = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;

  button {
    width: 32px !important;
    min-width: 32px;
    max-width: 32px;
    height: 32px;
    flex: 0 0 32px;
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

const NavSpacer = styled.div`
  height: ${NAV_HEIGHT}px;
  flex-shrink: 0;
`;

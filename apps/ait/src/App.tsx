
import { Container, Main, useIsDesktop } from '@resizer/ui';
import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import {
  imageUrlAtom,
  ImageCanvas,
  ResetButton,
  DownloadButton,
  ShareButton,
  ThumbnailStrip,
  NavigationBar,
  PlatformProvider,
} from '@resizer/editor';
import { aitPlatform } from '@/platform';
const NAV_HEIGHT = 200;

export default function ClientPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDesktop = useIsDesktop();
  const imageUrl = useAtomValue(imageUrlAtom);
  const hasImages = imageUrl !== null;

  return (
    <PlatformProvider value={aitPlatform}>
      <Container>
      <Main>
        <Title>Insta Frame</Title>
        <CanvasWrapper>
          <ImageCanvas canvasRef={canvasRef} isDesktop={isDesktop} />
          {hasImages && (
            <FloatingButtons>
              <ResetButton canvasRef={canvasRef} />
              <DownloadButton />
              <ShareButton />
            </FloatingButtons>
          )}
        </CanvasWrapper>
        <ThumbnailStrip />

        <NavSpacer />
      </Main>

        <NavigationBar />
      </Container>
    </PlatformProvider>
  );
}

const Title = styled.h1`
  margin: 6px 0 2px;
  font-size: 16px;
  font-weight: 700;
  color: #191f28;
  text-align: center;
  flex-shrink: 0;
`;

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

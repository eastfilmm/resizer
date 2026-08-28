
import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { imageUrlAtom } from '@/atoms/imageAtoms';
import styled from 'styled-components';
import { Container, Main } from '@/components/styled/Layout';
import ImageCanvas from '@/components/ImageCanvas';
import { ResetButton } from '@/components/ResetButton';
import { DownloadButton } from '@/components/DownloadButton';
import { ShareButton } from '@/components/ShareButton';
import { ThumbnailStrip } from '@/components/ThumbnailStrip';
import { NavigationBar } from '@/components/NavigationBar';
import { useIsDesktop } from '@/hooks/useIsDesktop';

const NAV_HEIGHT = 200;

export default function ClientPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 토스 모바일 웹뷰: 항상 최적화된 프리뷰 경로(0.4배 축소 + RAF 스로틀) 사용.
  // 풀해상도 다운로드는 renderImageToCanvas가 별도로 처리하므로 화질 영향 없음.
  const isSafari = true;
  const isDesktop = useIsDesktop();
  const imageUrl = useAtomValue(imageUrlAtom);
  const hasImages = imageUrl !== null;

  return (
    <Container>
      <Main>
        <CanvasWrapper>
          <ImageCanvas canvasRef={canvasRef} isSafari={isSafari} isDesktop={isDesktop} />
          {hasImages && (
            <FloatingButtons>
              <ResetButton canvasRef={canvasRef} />
              <DownloadButton />
              <ShareButton />
            </FloatingButtons>
          )}
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

'use client';

import { DESKTOP_MEDIA_QUERY } from '@resizer/ui';
import styled from 'styled-components';
import { useEffect, useCallback, useRef } from 'react';
import type { RefObject } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { imageUrlAtom, imageSettingsAtom, selectedImageAtom } from '../atoms/imageAtoms';
import type { AspectRatio } from '../atoms/imageAtoms';
import {
  drawImageWithEffects,
  getCanvasDimensions,
  getCanvasDisplaySize,
  getPreviewScaleFactor,
  CANVAS_DISPLAY_SIZE,
  CANVAS_DISPLAY_SIZE_DESKTOP,
  CANVAS_DISPLAY_SIZE_4_5_WIDTH_DESKTOP,
  CANVAS_DISPLAY_SIZE_9_16_WIDTH_DESKTOP,
} from '@resizer/canvas';
import type { DrawableImage } from '@resizer/canvas';
import { useAspectRatio } from '../hooks/useAspectRatio';
import { useRedrawOnSettingsChange } from '../hooks/useRedrawOnSettingsChange';
import { loadEditableImage } from '../utils/imageSource';
import { toDrawOptions } from '../utils/drawOptions';

interface ImageCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isDesktop?: boolean;
}

export default function ImageCanvas({ canvasRef, isDesktop = false }: ImageCanvasProps) {
  const store = useStore();
  const imageUrl = useAtomValue(imageUrlAtom);
  // 촬영일은 업로드 뒤에 늦게 도착한다. 도착하면 폴라로이드 날짜를 다시 그려야 한다.
  const photoDate = useAtomValue(selectedImageAtom)?.photoDate;
  const { aspectRatio } = useAspectRatio();

  const imageRef = useRef<DrawableImage | null>(null);
  const loadedUrlRef = useRef<string | null>(null);
  // 로드가 끝났을 때 더 최신 요청이 시작됐는지 판별하는 토큰.
  // 최신 URL을 렌더 중에 ref로 복사하던 방식은 캐시 적중 시 .then()이
  // effect보다 먼저 실행돼 어긋날 수 있었다. 요청 시작 시점에 번호를 매긴다.
  const loadRequestIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 프리뷰는 브라우저와 무관하게 축소 해상도로 렌더한다 (모바일 0.4, 데스크톱 0.6).
  // 다운로드는 renderCanvasImage에서 항상 2000px 풀 해상도로 별도 렌더한다.
  const SCALE_FACTOR = getPreviewScaleFactor(isDesktop);

  const redrawImage = useCallback(
    (ctx: CanvasRenderingContext2D, img: DrawableImage | null) => {
      const settings = store.get(imageSettingsAtom);
      const size = getCanvasDimensions(settings.canvasAspectRatio, true, isDesktop);

      if (img) {
        drawImageWithEffects(
          ctx,
          img,
          toDrawOptions(settings, store.get(selectedImageAtom), size, SCALE_FACTOR),
        );
      } else {
        // Fill background with solid color (no image loaded)
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, size.width, size.height);
      }
    },
    [isDesktop, SCALE_FACTOR, store]
  );

  const drawImageOnCanvas = useCallback(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { canvasAspectRatio } = store.get(imageSettingsAtom);
    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(
      canvasAspectRatio,
      true,
      isDesktop
    );
    const { width: displayWidth, height: displayHeight } = getCanvasDisplaySize(canvasAspectRatio, isDesktop);

    // Set canvas actual size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set display size (scaled down with CSS)
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Enable high quality image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 이미 로드된 이미지면 깜빡임 없이 바로 다시 그린다
    if (imageRef.current && loadedUrlRef.current === imageUrl) {
      redrawImage(ctx, imageRef.current);
      return;
    }

    // 축소·디코드된 소스를 공유 캐시에서 받는다(같은 URL은 한 번만 디코드된다)
    const requestId = ++loadRequestIdRef.current;
    loadEditableImage(imageUrl).then((image) => {
      // 로드 중에 더 최신 요청이 시작됐으면 버린다
      if (requestId !== loadRequestIdRef.current) return;
      imageRef.current = image;
      loadedUrlRef.current = imageUrl;
      redrawImage(ctx, image);
    });
  }, [imageUrl, canvasRef, redrawImage, isDesktop, store]);

  // Initialize canvas on mount (skip when image is already loaded to avoid double-clear flicker)
  useEffect(() => {
    if (canvasRef.current && !imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(
          aspectRatio,
          true,
          isDesktop
        );
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        ctx.fillStyle = store.get(imageSettingsAtom).backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    }
  }, [canvasRef, aspectRatio, isDesktop, store]);

  // 설정이 바뀌면 프레임당 한 번 다시 그린다. 컨테이너 배경도 리렌더 없이 맞춘다.
  useRedrawOnSettingsChange(
    useCallback(() => {
      if (containerRef.current) {
        containerRef.current.style.backgroundColor = store.get(imageSettingsAtom).backgroundColor;
      }
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) redrawImage(ctx, imageRef.current);
    }, [store, canvasRef, redrawImage]),
  );

  // Track the current image URL to detect changes
  const lastImageUrlRef = useRef<string | null>(null);

  // Draw image when imageUrl or aspectRatio changes
  useEffect(() => {
    if (imageUrl) {
      // Only clear cache if the URL itself changed
      if (lastImageUrlRef.current !== imageUrl) {
        imageRef.current = null;
        loadedUrlRef.current = null;
        lastImageUrlRef.current = imageUrl;
      }
      drawImageOnCanvas();
    } else {
      // Clear image reference when imageUrl is null (reset)
      imageRef.current = null;
      loadedUrlRef.current = null;
      lastImageUrlRef.current = null;
      // Clear canvas and update display size
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const { width, height } = getCanvasDimensions(aspectRatio, true, isDesktop);
          const { width: displayWidth, height: displayHeight } = getCanvasDisplaySize(aspectRatio, isDesktop);
          canvas.width = width;
          canvas.height = height;
          canvas.style.width = `${displayWidth}px`;
          canvas.style.height = `${displayHeight}px`;
          ctx.fillStyle = store.get(imageSettingsAtom).backgroundColor;
          ctx.fillRect(0, 0, width, height);
        }
      }
    }
  }, [imageUrl, aspectRatio, drawImageOnCanvas, canvasRef, isDesktop, store]);

  // 선택된 사진의 촬영일이 늦게 도착하면 다시 그린다. 위 effect가 사진 교체를
  // 먼저 처리하므로 여기서는 이미 이 사진이 로드된 경우만 본다.
  useEffect(() => {
    if (!imageRef.current || loadedUrlRef.current !== imageUrl) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) redrawImage(ctx, imageRef.current);
  }, [photoDate, imageUrl, canvasRef, redrawImage]);

  // Initialize container background color on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.backgroundColor = store.get(imageSettingsAtom).backgroundColor;
    }
  }, [store]);

  return (
    <CanvasContainer
      ref={containerRef}
      $aspectRatio={aspectRatio as AspectRatio}
    >
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
}

const CanvasContainer = styled.div<{
  $aspectRatio: AspectRatio;
}>`
  width: ${props => props.$aspectRatio === '4:5'
    ? '256px'
    : props.$aspectRatio === '9:16'
      ? '180px'
      : `${CANVAS_DISPLAY_SIZE}px`};
  height: ${CANVAS_DISPLAY_SIZE}px;
  background-color: white; /* Initial value, updated imperatively via ref */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  ${props => props.$aspectRatio === '1:1' ? 'will-change: transform;' : ''}

  @media ${DESKTOP_MEDIA_QUERY} {
    width: ${props => props.$aspectRatio === '4:5'
      ? `${CANVAS_DISPLAY_SIZE_4_5_WIDTH_DESKTOP}px`
      : props.$aspectRatio === '9:16'
        ? `${CANVAS_DISPLAY_SIZE_9_16_WIDTH_DESKTOP}px`
        : `${CANVAS_DISPLAY_SIZE_DESKTOP}px`};
    height: ${CANVAS_DISPLAY_SIZE_DESKTOP}px;
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
`;

'use client';

import { useRafThrottle } from '@resizer/ui';
import styled from 'styled-components';
import { useEffect, useCallback, useRef } from 'react';
import type { RefObject } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { imageUrlAtom, imageSettingsAtom } from '../atoms/imageAtoms';
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
import type { ImagePosition, DrawableImage } from '@resizer/canvas';
import { useAspectRatio } from '../hooks/useAspectRatio';
import { loadEditableImage } from '../utils/imageSource';

interface ImageCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isDesktop?: boolean;
}

export default function ImageCanvas({ canvasRef, isDesktop = false }: ImageCanvasProps) {
  const store = useStore();
  const imageUrl = useAtomValue(imageUrlAtom);
  const { aspectRatio } = useAspectRatio();

  // Refs to access current values in callbacks without re-triggering effects
  const settingsRef = useRef(store.get(imageSettingsAtom));
  const imageRef = useRef<DrawableImage | null>(null);
  const loadedUrlRef = useRef<string | null>(null);
  const imageUrlRef = useRef<string | null>(null);
  // 로드가 끝났을 때 선택이 이미 바뀌었는지 판별하기 위해 최신 값을 유지한다
  imageUrlRef.current = imageUrl;
  const imagePositionRef = useRef<ImagePosition | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { throttle } = useRafThrottle();

  // 프리뷰는 브라우저와 무관하게 축소 해상도로 렌더한다 (모바일 0.4, 데스크톱 0.6).
  // 다운로드는 renderCanvasImage에서 항상 2000px 풀 해상도로 별도 렌더한다.
  const SCALE_FACTOR = getPreviewScaleFactor(isDesktop);

  const redrawImage = useCallback(
    (ctx: CanvasRenderingContext2D, img: DrawableImage | null) => {
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(
        settingsRef.current.canvasAspectRatio,
        true,
        isDesktop
      );
      const settings = settingsRef.current;
      const effectivePadding = settings.padding * SCALE_FACTOR;
      const imageAreaWidth = canvasWidth - effectivePadding * 2;
      const imageAreaHeight = canvasHeight - effectivePadding * 2;

      if (img) {
        imagePositionRef.current = drawImageWithEffects(ctx, img, {
          actualCanvasWidth: canvasWidth,
          actualCanvasHeight: canvasHeight,
          imageAreaWidth,
          imageAreaHeight,
          padding: effectivePadding,
          bgColor: settings.backgroundColor,
          useGlassBlur: settings.glassBlurEnabled,
          blurIntensity: settings.blurIntensity * SCALE_FACTOR,
          overlayOpacity: settings.overlayOpacity,
          useShadow: settings.shadowEnabled,
          shadowIntensity: settings.shadowIntensity * SCALE_FACTOR,
          shadowOffset: settings.shadowOffset * SCALE_FACTOR,
          frameType: settings.frameType,
          scaleFactor: SCALE_FACTOR,
          polaroidDate: settings.polaroidDate,
        });
      } else {
        // Fill background with solid color (no image loaded)
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    },
    [isDesktop, SCALE_FACTOR]
  );

  const drawImageOnCanvas = useCallback(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(
      settingsRef.current.canvasAspectRatio,
      true,
      isDesktop
    );
    const { width: displayWidth, height: displayHeight } = getCanvasDisplaySize(settingsRef.current.canvasAspectRatio, isDesktop);

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
    loadEditableImage(imageUrl).then((image) => {
      // 로드 중에 선택이 바뀌었으면 버린다
      if (imageUrlRef.current !== imageUrl) return;
      imageRef.current = image;
      loadedUrlRef.current = imageUrl;
      redrawImage(ctx, image);
    });
  }, [imageUrl, canvasRef, redrawImage, isDesktop]);

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

        ctx.fillStyle = settingsRef.current.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    }
  }, [canvasRef, aspectRatio, isDesktop]);

  // 설정 변경은 rAF로 스로틀해 프레임당 최대 한 번만 다시 그린다
  useEffect(() => {
    const performRender = () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          redrawImage(ctx, imageRef.current);
        }
      }
    };

    const unsubscribe = store.sub(imageSettingsAtom, () => {
      // Update refs
      const newSettings = store.get(imageSettingsAtom);
      settingsRef.current = newSettings;

      // Update container background color imperatively (no re-render)
      if (containerRef.current) {
        containerRef.current.style.backgroundColor = newSettings.backgroundColor;
      }

      throttle(performRender);
    });

    return () => {
      unsubscribe();
    };
  }, [store, canvasRef, redrawImage, throttle]);

  // Track the current image URL to detect changes
  const lastImageUrlRef = useRef<string | null>(null);

  // Draw image when imageUrl or aspectRatio changes
  useEffect(() => {
    if (imageUrl) {
      // Only clear cache if the URL itself changed
      if (lastImageUrlRef.current !== imageUrl) {
        imageRef.current = null;
        imagePositionRef.current = null;
        loadedUrlRef.current = null;
        lastImageUrlRef.current = imageUrl;
      }
      drawImageOnCanvas();
    } else {
      // Clear image reference when imageUrl is null (reset)
      imageRef.current = null;
      imagePositionRef.current = null;
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
          ctx.fillStyle = settingsRef.current.backgroundColor;
          ctx.fillRect(0, 0, width, height);
        }
      }
    }
  }, [imageUrl, aspectRatio, drawImageOnCanvas, canvasRef, isDesktop]);

  // Initialize container background color on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.backgroundColor = settingsRef.current.backgroundColor;
    }
  }, []);

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

  @media (min-width: 768px) {
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

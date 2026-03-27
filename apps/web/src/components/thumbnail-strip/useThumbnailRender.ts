'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { canvasAspectRatioAtom, imageSettingsAtom } from '@/atoms/imageAtoms';
import {
  drawImageWithEffects,
  getCanvasDimensions,
  getThumbnailCanvasSize,
} from '@/utils/canvas';
import { THUMBNAIL_HEIGHT, THUMBNAIL_RENDER_SCALE } from './constants';

interface UseThumbnailRenderOptions {
  objectUrl: string;
  isSafari: boolean;
}

export const useThumbnailRender = ({
  objectUrl,
  isSafari,
}: UseThumbnailRenderOptions) => {
  const store = useStore();
  const aspectRatio = useAtomValue(canvasAspectRatioAtom);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const settingsRef = useRef(store.get(imageSettingsAtom));
  const rafIdRef = useRef<number | null>(null);
  const pendingRenderRef = useRef(false);

  const renderThumbnail = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = getThumbnailCanvasSize(
      aspectRatio,
      THUMBNAIL_HEIGHT,
      THUMBNAIL_RENDER_SCALE,
    );
    const fullResCanvas = getCanvasDimensions(aspectRatio, false);
    const scaleFactor = size.height / fullResCanvas.height;
    const settings = settingsRef.current;
    const padding = settings.padding * scaleFactor;

    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.width = `${size.displayWidth}px`;
    canvas.style.height = `${size.displayHeight}px`;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    drawImageWithEffects(ctx, imageRef.current, {
      actualCanvasWidth: size.width,
      actualCanvasHeight: size.height,
      imageAreaWidth: size.width - padding * 2,
      imageAreaHeight: size.height - padding * 2,
      padding,
      bgColor: settings.backgroundColor,
      useGlassBlur: settings.glassBlurEnabled,
      blurIntensity: settings.blurIntensity * scaleFactor,
      overlayOpacity: settings.overlayOpacity,
      useShadow: settings.shadowEnabled,
      shadowIntensity: settings.shadowIntensity * scaleFactor,
      shadowOffset: settings.shadowOffset * scaleFactor,
      frameType: settings.frameType,
      scaleFactor,
      isSafari,
      polaroidDate: settings.polaroidDate,
    });
  }, [aspectRatio, isSafari]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      renderThumbnail();
    };
    img.src = objectUrl;

    return () => {
      imageRef.current = null;
    };
  }, [objectUrl, renderThumbnail]);

  useEffect(() => {
    const performRender = () => renderThumbnail();
    const unsubscribe = store.sub(imageSettingsAtom, () => {
      settingsRef.current = store.get(imageSettingsAtom);

      if (isSafari) {
        pendingRenderRef.current = true;

        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            if (pendingRenderRef.current) {
              pendingRenderRef.current = false;
              performRender();
            }
          });
        }

        return;
      }

      performRender();
    });

    return () => {
      unsubscribe();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isSafari, renderThumbnail, store]);

  useEffect(() => {
    renderThumbnail();
  }, [aspectRatio, renderThumbnail]);

  return canvasRef;
};

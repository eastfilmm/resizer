'use client';

import { useRafThrottle } from '@resizer/ui';
import type { DrawableImage } from '@resizer/canvas';
import { loadEditableImage } from '../../utils/imageSource';
import { useCallback, useEffect, useRef } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { canvasAspectRatioAtom, imageSettingsAtom } from '../../atoms/imageAtoms';
import {
  drawImageWithEffects,
  getCanvasDimensions,
  getThumbnailCanvasSize,
} from '@resizer/canvas';
import { THUMBNAIL_INNER_SIZE, THUMBNAIL_RENDER_SCALE } from './constants';
interface UseThumbnailRenderOptions {
  objectUrl: string;
}

export const useThumbnailRender = ({
  objectUrl,
}: UseThumbnailRenderOptions) => {
  const store = useStore();
  const aspectRatio = useAtomValue(canvasAspectRatioAtom);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<DrawableImage | null>(null);
  const settingsRef = useRef(store.get(imageSettingsAtom));
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { throttle } = useRafThrottle();

  const renderThumbnail = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = getThumbnailCanvasSize(
      aspectRatio,
      THUMBNAIL_INNER_SIZE,
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
      polaroidDate: settings.polaroidDate,
    });
  }, [aspectRatio]);

  useEffect(() => {
    let active = true;

    // 메인 캔버스와 같은 축소본을 공유한다. 썸네일마다 원본을 따로
    // 디코드하면 사진 한 장당 수십 MB가 썸네일 수만큼 늘어난다.
    loadEditableImage(objectUrl).then((image) => {
      if (!active) return;
      imageRef.current = image;
      renderThumbnail();
    });

    return () => {
      active = false;
      imageRef.current = null;
    };
  }, [objectUrl, renderThumbnail]);

  useEffect(() => {
    const DEBOUNCE_MS = 300;

    const performRender = () => {
      throttle(renderThumbnail);
    };

    const unsubscribe = store.sub(imageSettingsAtom, () => {
      settingsRef.current = store.get(imageSettingsAtom);

      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        performRender();
      }, DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [throttle, renderThumbnail, store]);

  useEffect(() => {
    renderThumbnail();
  }, [aspectRatio, renderThumbnail]);

  return canvasRef;
};

'use client';

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
import { toDrawOptions } from '../../utils/drawOptions';
import { useRedrawOnSettingsChange } from '../../hooks/useRedrawOnSettingsChange';
import { THUMBNAIL_INNER_SIZE, THUMBNAIL_RENDER_SCALE } from './constants';

// 썸네일은 급하지 않다. 슬라이더를 끌 동안은 메인 캔버스에 프레임을 양보한다.
const DEBOUNCE_MS = 300;

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

    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.width = `${size.displayWidth}px`;
    canvas.style.height = `${size.displayHeight}px`;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    drawImageWithEffects(
      ctx,
      imageRef.current,
      toDrawOptions(store.get(imageSettingsAtom), size, scaleFactor),
    );
  }, [aspectRatio, store]);

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

  useRedrawOnSettingsChange(renderThumbnail, { debounceMs: DEBOUNCE_MS });

  useEffect(() => {
    renderThumbnail();
  }, [aspectRatio, renderThumbnail]);

  return canvasRef;
};

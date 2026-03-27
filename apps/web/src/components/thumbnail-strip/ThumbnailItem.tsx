'use client';

import { memo } from 'react';
import type { UploadedImage } from '@/atoms/imageAtoms';
import { ThumbnailButton, ThumbnailCanvas } from './ThumbnailStrip.styles';
import { useThumbnailRender } from './useThumbnailRender';

interface ThumbnailItemProps {
  image: UploadedImage;
  isSelected: boolean;
  isSafari: boolean;
  onSelect: (id: string) => void;
}

export const ThumbnailItem = memo(
  ({ image, isSelected, isSafari, onSelect }: ThumbnailItemProps) => {
    const canvasRef = useThumbnailRender({
      objectUrl: image.objectUrl,
      isSafari,
    });

    return (
      <ThumbnailButton
        type="button"
        $isSelected={isSelected}
        onClick={() => onSelect(image.id)}
        title={image.fileName}
      >
        <ThumbnailCanvas ref={canvasRef} />
      </ThumbnailButton>
    );
  },
);

ThumbnailItem.displayName = 'ThumbnailItem';

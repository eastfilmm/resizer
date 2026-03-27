'use client';

import { useAtom, useAtomValue } from 'jotai';
import {
  selectedImageIdAtom,
  uploadedImagesAtom,
} from '@/atoms/imageAtoms';
import {
  Container,
  CountLabel,
  HintText,
  MetaRow,
  ThumbnailList,
} from './thumbnail-strip/ThumbnailStrip.styles';
import { ThumbnailItem } from './thumbnail-strip/ThumbnailItem';

interface ThumbnailStripProps {
  isSafari?: boolean;
}

export const ThumbnailStrip = ({ isSafari = false }: ThumbnailStripProps) => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const [selectedImageId, setSelectedImageId] = useAtom(selectedImageIdAtom);
  const activeImageId = selectedImageId ?? uploadedImages[0]?.id ?? null;

  if (uploadedImages.length === 0) {
    return null;
  }

  return (
    <Container>
      <MetaRow>
        <CountLabel>{uploadedImages.length} photos selected</CountLabel>
        <HintText>All photos share the same settings</HintText>
      </MetaRow>

      <ThumbnailList>
        {uploadedImages.map((image) => (
          <ThumbnailItem
            key={image.id}
            image={image}
            isSelected={activeImageId === image.id}
            isSafari={isSafari}
            onSelect={setSelectedImageId}
          />
        ))}
      </ThumbnailList>
    </Container>
  );
};

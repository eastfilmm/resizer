'use client';

import { useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  MAX_UPLOADED_IMAGES,
  selectedImageIdAtom,
  uploadedImagesAtom,
} from '@/atoms/imageAtoms';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  Container,
  CountLabel,
  HintText,
  MetaRow,
  ThumbnailList,
  AddButton,
} from './thumbnail-strip/ThumbnailStrip.styles';
import { ThumbnailItem } from './thumbnail-strip/ThumbnailItem';

interface ThumbnailStripProps {
  isSafari?: boolean;
}

export const ThumbnailStrip = ({ isSafari = false }: ThumbnailStripProps) => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const [selectedImageId, setSelectedImageId] = useAtom(selectedImageIdAtom);
  const activeImageId = selectedImageId ?? uploadedImages[0]?.id ?? null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFiles = useImageUpload();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    handleFiles(files);
    event.target.value = '';
  };

  const showAddButton = uploadedImages.length < MAX_UPLOADED_IMAGES;

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
        {showAddButton && (
          <AddButton type="button" onClick={() => fileInputRef.current?.click()}>
            +
          </AddButton>
        )}
      </ThumbnailList>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Container>
  );
};

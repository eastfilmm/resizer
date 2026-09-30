'use client';

import { IconButton, ButtonIcon, UploadIcon } from '@resizer/ui';
import styled from 'styled-components';
import type { RefObject } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  MAX_UPLOADED_IMAGES,
  selectedImageIdAtom,
  uploadedImagesAtom,
  type UploadedImage,
} from '../atoms/imageAtoms';
import { createUploadedImage } from '../utils/imageUtils';
import { usePhotoDates } from '../hooks/usePhotoDates';

interface ImageUploaderProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const ImageUploader = ({ fileInputRef }: ImageUploaderProps) => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const setUploadedImages = useSetAtom(uploadedImagesAtom);
  const setSelectedImageId = useSetAtom(selectedImageIdAtom);
  const readPhotoDates = usePhotoDates();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, MAX_UPLOADED_IMAGES);
    const nextImages: UploadedImage[] = files.map(createUploadedImage);

    uploadedImages.forEach((image) => URL.revokeObjectURL(image.objectUrl));
    setUploadedImages(nextImages);
    setSelectedImageId(nextImages[0]?.id ?? null);
    readPhotoDates(nextImages, files);

    if (fileInputRef.current && nextImages.length === 0) {
      fileInputRef.current.value = '';
    }

    event.target.value = '';
  };

  return (
    <>
      <FileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        id="image-upload"
      />
      
      <IconButton $variant="blue" onClick={() => fileInputRef.current?.click()}>
        <ButtonIcon as={UploadIcon} role="img" aria-label="Upload" />
      </IconButton>
    </>
  );
}

const FileInput = styled.input`
  display: none;
`;

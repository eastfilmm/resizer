'use client';

import styled from 'styled-components';
import { RefObject } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  MAX_UPLOADED_IMAGES,
  selectedImageIdAtom,
  uploadedImagesAtom,
  type UploadedImage,
} from '@/atoms/imageAtoms';
import { IconButton, ButtonIcon } from '@/components/styled/Button';
import { createImageId } from '@/utils/imageUtils';

interface ImageUploaderProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const ImageUploader = ({ fileInputRef }: ImageUploaderProps) => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const setUploadedImages = useSetAtom(uploadedImagesAtom);
  const setSelectedImageId = useSetAtom(selectedImageIdAtom);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/'));
    const nextImages: UploadedImage[] = files.slice(0, MAX_UPLOADED_IMAGES).map((file) => ({
      id: createImageId(),
      fileName: file.name,
      objectUrl: URL.createObjectURL(file),
    }));

    uploadedImages.forEach((image) => URL.revokeObjectURL(image.objectUrl));
    setUploadedImages(nextImages);
    setSelectedImageId(nextImages[0]?.id ?? null);

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
        <ButtonIcon src="/upload.svg" alt="Upload" />
      </IconButton>
    </>
  );
}

const FileInput = styled.input`
  display: none;
`;

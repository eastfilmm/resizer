'use client';

import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  MAX_UPLOADED_IMAGES,
  selectedImageIdAtom,
  uploadedImagesAtom,
  type UploadedImage,
} from '@/atoms/imageAtoms';

const createImageId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const useImageUpload = () => {
  const uploadedImages = useAtomValue(uploadedImagesAtom);
  const setUploadedImages = useSetAtom(uploadedImagesAtom);
  const setSelectedImageId = useSetAtom(selectedImageIdAtom);

  const handleFiles = useCallback(
    (files: File[]) => {
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));
      if (imageFiles.length === 0) return;

      const newImages: UploadedImage[] = imageFiles
        .slice(0, MAX_UPLOADED_IMAGES)
        .map((file) => ({
          id: createImageId(),
          fileName: file.name,
          objectUrl: URL.createObjectURL(file),
        }));

      const total = uploadedImages.length + newImages.length;

      if (total <= MAX_UPLOADED_IMAGES) {
        // append
        const merged = [...uploadedImages, ...newImages];
        setUploadedImages(merged);
        setSelectedImageId(newImages[0]?.id ?? null);
      } else {
        // 전체 교체
        uploadedImages.forEach((image) => URL.revokeObjectURL(image.objectUrl));
        setUploadedImages(newImages);
        setSelectedImageId(newImages[0]?.id ?? null);
      }
    },
    [uploadedImages, setUploadedImages, setSelectedImageId],
  );

  return handleFiles;
};

'use client';

import { useCallback } from 'react';
import { useStore } from 'jotai';
import {
  activeNavPanelAtom,
  MAX_UPLOADED_IMAGES,
  selectedImageIdAtom,
  uploadedImagesAtom,
} from '../atoms/imageAtoms';
import { createUploadedImage } from '../utils/imageUtils';
import { releaseEditableImage } from '../utils/imageSource';
import { usePhotoDates } from './usePhotoDates';

export const useImageUpload = () => {
  const store = useStore();
  const readPhotoDates = usePhotoDates();

  const handleFiles = useCallback(
    (files: File[]) => {
      const imageFiles = files
        .filter((file) => file.type.startsWith('image/'))
        .slice(0, MAX_UPLOADED_IMAGES);
      if (imageFiles.length === 0) return;

      const newImages = imageFiles.map(createUploadedImage);
      const uploadedImages = store.get(uploadedImagesAtom);
      const total = uploadedImages.length + newImages.length;

      if (total <= MAX_UPLOADED_IMAGES) {
        // append
        store.set(uploadedImagesAtom, [...uploadedImages, ...newImages]);
      } else {
        // 전체 교체
        uploadedImages.forEach((image) => {
          URL.revokeObjectURL(image.objectUrl);
          releaseEditableImage(image.objectUrl);
        });
        store.set(uploadedImagesAtom, newImages);
      }
      store.set(selectedImageIdAtom, newImages[0]?.id ?? null);
      // 올리자마자 첫 단계(비율·여백)부터 고를 수 있게 Layout 패널을 연다
      store.set(activeNavPanelAtom, 'layout');

      readPhotoDates(newImages, imageFiles);
    },
    [store, readPhotoDates],
  );

  return handleFiles;
};

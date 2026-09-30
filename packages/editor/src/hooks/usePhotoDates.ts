'use client';

import { useCallback } from 'react';
import { useStore } from 'jotai';
import { uploadedImagesAtom, type UploadedImage } from '../atoms/imageAtoms';
import { readPhotoDate } from '../utils/photoDate';

/**
 * 업로드한 사진의 촬영일을 뒤에서 읽어 채운다.
 *
 * 사진은 먼저 목록에 올려 바로 보이게 하고, 날짜는 읽히는 대로 해당 사진에만
 * 붙인다. 읽는 사이 사진이 지워졌거나 교체됐으면 그냥 버린다.
 */
export const usePhotoDates = () => {
  const store = useStore();

  return useCallback(
    (images: UploadedImage[], files: File[]) => {
      images.forEach((image, index) => {
        const file = files[index];
        if (!file) return;

        void readPhotoDate(file).then((photoDate) => {
          if (!photoDate) return;
          store.set(uploadedImagesAtom, (prev) =>
            prev.map((item) => (item.id === image.id ? { ...item, photoDate } : item)),
          );
        });
      });
    },
    [store],
  );
};

import type { ImageSettings, UploadedImage } from '../atoms/imageAtoms';

export const createImageId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

/** 업로드 파일을 편집기 이미지로 만든다. 촬영일은 usePhotoDates가 나중에 채운다. */
export const createUploadedImage = (file: File): UploadedImage => ({
  id: createImageId(),
  fileName: file.name,
  objectUrl: URL.createObjectURL(file),
});

/** 이 사진에 찍을 폴라로이드 날짜. 직접 입력한 값이 없으면 사진의 촬영일을 쓴다. */
export const resolvePolaroidDate = (
  settings: Pick<ImageSettings, 'polaroidDate'>,
  image: Pick<UploadedImage, 'photoDate'> | null | undefined,
): string => settings.polaroidDate ?? image?.photoDate ?? '';

import { atom } from 'jotai';
import { focusAtom } from 'jotai-optics';

// 네비게이션 활성 패널 타입
export type NavPanelType = 'layout' | 'frame' | 'background' | 'glassblur' | 'shadow' | null;

// 현재 활성화된 네비게이션 패널
export const activeNavPanelAtom = atom<NavPanelType>('layout');

export interface UploadedImage {
  id: string;
  fileName: string;
  objectUrl: string;
}

export const MAX_UPLOADED_IMAGES = 5;

export const uploadedImagesAtom = atom<UploadedImage[]>([]);
export const selectedImageIdAtom = atom<string | null>(null);
export const selectedImageAtom = atom((get) => {
  const selectedImageId = get(selectedImageIdAtom);
  const uploadedImages = get(uploadedImagesAtom);

  if (!selectedImageId) {
    return uploadedImages[0] ?? null;
  }

  return uploadedImages.find((image) => image.id === selectedImageId) ?? uploadedImages[0] ?? null;
});

// 선택된 이미지 URL을 기존 단일 프리뷰 흐름에서 그대로 사용할 수 있도록 유지합니다.
export const imageUrlAtom = atom((get) => get(selectedImageAtom)?.objectUrl ?? null);

export type AspectRatio = '1:1' | '4:5' | '9:16';
export type BackgroundColor = 'white' | 'black';
export type FrameType = 'none' | 'polaroid' | 'thin' | 'mediumFilm';

export interface ImageSettings {
  backgroundColor: BackgroundColor;
  glassBlurEnabled: boolean;
  blurIntensity: number;
  overlayOpacity: number;
  padding: number;
  shadowEnabled: boolean;
  shadowIntensity: number;
  shadowOffset: number;
  canvasAspectRatio: AspectRatio;
  frameType: FrameType;
  polaroidDate: string;
}

export const DEFAULT_IMAGE_SETTINGS: ImageSettings = {
  backgroundColor: 'white',
  glassBlurEnabled: false,
  blurIntensity: 30,
  overlayOpacity: 0.3,
  padding: 0,
  shadowEnabled: false,
  shadowIntensity: 30,
  shadowOffset: 20,
  canvasAspectRatio: '1:1',
  frameType: 'none',
  polaroidDate: '',
};

export const imageSettingsAtom = atom<ImageSettings>(DEFAULT_IMAGE_SETTINGS);

export const backgroundColorAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('backgroundColor'));
export const glassBlurAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('glassBlurEnabled'));
export const blurIntensityAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('blurIntensity'));
export const overlayOpacityAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('overlayOpacity'));
export const paddingAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('padding'));
export const shadowEnabledAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('shadowEnabled'));
export const shadowIntensityAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('shadowIntensity'));
export const shadowOffsetAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('shadowOffset'));
export const canvasAspectRatioAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('canvasAspectRatio'));
export const frameTypeAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('frameType'));
export const polaroidDateAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('polaroidDate'));

export const prevBackgroundColorAtom = atom<BackgroundColor | null>(null);

export const canResetAtom = atom((get) => {
  const hasImage = get(uploadedImagesAtom).length > 0;
  const currentSettings = get(imageSettingsAtom);

  const hasFilterChanges = JSON.stringify(currentSettings) !== JSON.stringify(DEFAULT_IMAGE_SETTINGS);

  return hasImage || hasFilterChanges;
});

import { atom } from 'jotai';
import type { AspectRatio, BackgroundColor, FrameType } from '@resizer/canvas';
import { focusAtom } from 'jotai-optics';

// 네비게이션 활성 패널 타입
export type NavPanelType = 'layout' | 'frame' | 'background' | 'glassblur' | 'shadow' | null;

// 현재 활성화된 네비게이션 패널
export const activeNavPanelAtom = atom<NavPanelType>('layout');

export interface UploadedImage {
  id: string;
  fileName: string;
  objectUrl: string;
  /** EXIF 촬영일(YYYY.MM.DD). 업로드 시 한 번 읽어 둔다. 없으면 undefined. */
  photoDate?: string;
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

// 캔버스 렌더러가 원본을 갖는다. 기존 `@/atoms/imageAtoms` 임포트를 깨지 않도록 재노출한다.
export type { AspectRatio, BackgroundColor, FrameType } from '@resizer/canvas';

export interface ImageSettings {
  backgroundColor: BackgroundColor;
  /** 배경색에 흰색을 섞는 정도(0~100). 0이면 원색 그대로. 기본 50(부드러운 톤에서 시작). */
  backgroundSoftness: number;
  glassBlurEnabled: boolean;
  blurIntensity: number;
  overlayOpacity: number;
  padding: number;
  shadowEnabled: boolean;
  shadowIntensity: number;
  shadowOffset: number;
  canvasAspectRatio: AspectRatio;
  frameType: FrameType;
  /**
   * 폴라로이드 날짜. null이면 사진마다 자기 촬영일(UploadedImage.photoDate)을 쓰고,
   * 사용자가 입력하면 그 값을 모든 사진에 쓴다. 빈 문자열은 날짜를 지운 상태.
   */
  polaroidDate: string | null;
}

export const DEFAULT_IMAGE_SETTINGS: ImageSettings = {
  backgroundColor: 'white',
  backgroundSoftness: 50,
  glassBlurEnabled: false,
  blurIntensity: 30,
  overlayOpacity: 0.3,
  padding: 0,
  shadowEnabled: false,
  shadowIntensity: 30,
  shadowOffset: 20,
  canvasAspectRatio: '1:1',
  frameType: 'none',
  polaroidDate: null,
};

export const imageSettingsAtom = atom<ImageSettings>(DEFAULT_IMAGE_SETTINGS);

export const backgroundColorAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('backgroundColor'));
export const backgroundSoftnessAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('backgroundSoftness'));
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

import { atom } from 'jotai';
import { focusAtom } from 'jotai-optics';

// 네비게이션 활성 패널 타입
export type NavPanelType = 'layout' | 'frame' | 'background' | 'glassblur' | 'shadow' | null;

// 현재 활성화된 네비게이션 패널
export const activeNavPanelAtom = atom<NavPanelType>('layout');

// 이미지 Blob URL
export const imageUrlAtom = atom<string | null>(null);

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
  const hasImage = get(imageUrlAtom) !== null;
  const currentSettings = get(imageSettingsAtom);

  const hasFilterChanges = JSON.stringify(currentSettings) !== JSON.stringify(DEFAULT_IMAGE_SETTINGS);

  return hasImage || hasFilterChanges;
});

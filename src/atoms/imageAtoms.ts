import { atom } from 'jotai';
import { focusAtom } from 'jotai-optics';

// 네비게이션 활성 패널 타입
export type NavPanelType = 'layout' | 'frame' | 'background' | 'glassblur' | 'shadow' | null;

// 현재 활성화된 네비게이션 패널
export const activeNavPanelAtom = atom<NavPanelType>(null);

// 이미지 Blob URL
export const imageUrlAtom = atom<string | null>(null);

export interface ImageSettings {
  backgroundColor: 'white' | 'black';
  glassBlurEnabled: boolean;
  blurIntensity: number;
  overlayOpacity: number;
  padding: number;
  shadowEnabled: boolean;
  shadowIntensity: number;
  shadowOffset: number;
  canvasAspectRatio: '1:1' | '4:5' | '9:16';
  polaroidMode: boolean;
  thinFrameMode: boolean;
  mediumFilmFrameMode: boolean;
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
  polaroidMode: false,
  thinFrameMode: false,
  mediumFilmFrameMode: false,
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
export const polaroidModeAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('polaroidMode'));
export const thinFrameModeAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('thinFrameMode'));
export const mediumFilmFrameModeAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('mediumFilmFrameMode'));
export const polaroidDateAtom = focusAtom(imageSettingsAtom, (optic) => optic.prop('polaroidDate'));

export const canResetAtom = atom((get) => {
  const hasImage = get(imageUrlAtom) !== null;
  const currentSettings = get(imageSettingsAtom);
  
  const hasFilterChanges = JSON.stringify(currentSettings) !== JSON.stringify(DEFAULT_IMAGE_SETTINGS);
  
  return hasImage || hasFilterChanges;
});

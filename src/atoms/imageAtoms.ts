import { atom } from 'jotai';

// 네비게이션 활성 패널 타입
export type NavPanelType = 'layout' | 'frame' | 'background' | 'glassblur' | 'shadow' | null;

// 현재 활성화된 네비게이션 패널
export const activeNavPanelAtom = atom<NavPanelType>(null);

// 이미지 Blob URL
export const imageUrlAtom = atom<string | null>(null);

// 캔버스 배경색 ('white' | 'black')
export const backgroundColorAtom = atom<'white' | 'black'>('white');

// Glass Blur 효과 활성화 여부
export const glassBlurAtom = atom<boolean>(false);

// Glass Blur 강도 (1-100%, 내부적으로 px로 변환하여 사용)
export const blurIntensityAtom = atom<number>(30);

// 색상 오버레이 투명도 (0-100%, 0.0-1.0)
export const overlayOpacityAtom = atom<number>(0.3);

// 캔버스 패딩 (0-200px 범위, 캔버스 기준 2000px)
export const paddingAtom = atom<number>(0);


// Shadow 효과 활성화 여부
export const shadowEnabledAtom = atom<boolean>(false);

// Shadow 강도 (blur radius, 1-100px)
export const shadowIntensityAtom = atom<number>(30);

// Shadow 오프셋 (이미지 오른쪽/아래 방향, 1-50px)
export const shadowOffsetAtom = atom<number>(20);

// 캔버스 가로세로 비율 ('1:1' | '4:5' | '9:16')
export const canvasAspectRatioAtom = atom<'1:1' | '4:5' | '9:16'>('1:1');

// 폴라로이드 프레임 모드 활성화 여부
export const polaroidModeAtom = atom<boolean>(false);

// Thin Frame 모드 활성화 여부 (얇은 검정색 프레임)
export const thinFrameModeAtom = atom<boolean>(false);

// Medium Film Frame 모드 활성화 여부 (중형 필름 프레임)
export const mediumFilmFrameModeAtom = atom<boolean>(false);

// Polaroid date text
export const polaroidDateAtom = atom<string>('');

// Reset 가능 여부 (이미지가 있거나 필터가 초기값과 다를 때)
export const canResetAtom = atom((get) => {
  const hasImage = get(imageUrlAtom) !== null;
  const hasFilterChanges =
    get(backgroundColorAtom) !== 'white' ||
    get(paddingAtom) !== 0 ||
    get(glassBlurAtom) !== false ||
    get(blurIntensityAtom) !== 30 ||
    get(overlayOpacityAtom) !== 0.3 ||
    get(shadowEnabledAtom) !== false ||
    get(shadowIntensityAtom) !== 30 ||
    get(shadowOffsetAtom) !== 20 ||
    get(polaroidModeAtom) !== false ||
    get(thinFrameModeAtom) !== false ||
    get(mediumFilmFrameModeAtom) !== false ||
    get(polaroidDateAtom) !== '';

  return hasImage || hasFilterChanges;
});

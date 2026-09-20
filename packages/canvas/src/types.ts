/**
 * 캔버스 렌더링의 도메인 타입.
 *
 * 앱의 atom 정의(`imageAtoms`)가 아니라 여기가 원본이다. 두 앱(web/ait)이 같은
 * 렌더러를 쓰는 이상 비율·배경색·프레임 종류는 앱이 아니라 렌더러의 어휘다.
 */
export type AspectRatio = '1:1' | '4:5' | '9:16';
export type BackgroundColor = 'white' | 'black';
export type FrameType = 'none' | 'polaroid' | 'thin' | 'mediumFilm';

export interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DrawImageOptions {
  actualCanvasWidth: number;
  actualCanvasHeight: number;
  imageAreaWidth: number;
  imageAreaHeight: number;
  padding: number;
  bgColor: string;
  useGlassBlur: boolean;
  blurIntensity: number;
  overlayOpacity: number;
  useShadow: boolean;
  shadowIntensity: number;
  shadowOffset: number;
  frameType: FrameType;
  /**
   * 블러를 JS(StackBlur)로 계산할지 여부. 기본값은 네이티브 `ctx.filter`다.
   * 어떤 환경이 어느 쪽인지는 렌더러가 아니라 호출하는 앱이 판단한다.
   */
  useStackBlur?: boolean;
  scaleFactor?: number;
  polaroidDate?: string;
}

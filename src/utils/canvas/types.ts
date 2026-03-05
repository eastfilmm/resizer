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
  usePolaroid: boolean;
  useThinFrame: boolean;
  useMediumFilmFrame: boolean;
  isSafari?: boolean;
  scaleFactor?: number;
  polaroidDate?: string;
}

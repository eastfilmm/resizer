// 이미지 편집기. 앱(web/ait)은 셸만 갖고 여기서 화면을 조립한다.
// 플랫폼별로 다른 저장·공유 동작은 PlatformProvider로 주입받는다.

export * from './platform';

// 상태
export * from './atoms/imageAtoms';

// 화면 조각
export { default as ImageCanvas } from './components/ImageCanvas';
export { NavigationBar } from './components/NavigationBar';
export { ThumbnailStrip } from './components/ThumbnailStrip';
export { ImageUploader } from './components/ImageUploader';
export { ResetButton } from './components/ResetButton';
export { DownloadButton } from './components/DownloadButton';
export { ShareButton } from './components/ShareButton';

// 훅
export { useAspectRatio } from './hooks/useAspectRatio';
export { useImageUpload } from './hooks/useImageUpload';
export { useResetState } from './hooks/useResetState';

// 렌더 유틸 (다운로드 등 앱에서 직접 쓸 수 있도록)
export { renderImageToCanvas, renderImageToBlob, canvasToBlob } from './utils/renderCanvasImage';

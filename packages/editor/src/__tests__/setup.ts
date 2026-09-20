import '@testing-library/jest-dom/vitest';

// jsdom용 Canvas 2D 목은 렌더러 패키지가 소유한다 (두 앱이 같은 목을 쓴다).
// 이 재노출은 모듈을 평가시키므로 getContext 패치도 함께 적용된다.
export { MockCanvasRenderingContext2D, MockImage } from '@resizer/canvas/test-setup';

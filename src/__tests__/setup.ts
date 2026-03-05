import '@testing-library/jest-dom/vitest';

/**
 * Canvas 2D Context Mock
 * jsdom doesn't implement Canvas 2D API, so we provide a minimal mock.
 */

class MockCanvasRenderingContext2D {
  // State tracking
  fillStyle: string = '';
  strokeStyle: string = '';
  font: string = '';
  textAlign: string = 'start';
  textBaseline: string = 'alphabetic';
  globalAlpha: number = 1.0;
  filter: string = 'none';
  imageSmoothingEnabled: boolean = true;
  imageSmoothingQuality: string = 'low';
  shadowColor: string = 'transparent';
  shadowBlur: number = 0;
  shadowOffsetX: number = 0;
  shadowOffsetY: number = 0;

  // Call tracking for assertions
  calls: { method: string; args: unknown[] }[] = [];

  private _track(method: string, args: unknown[]) {
    this.calls.push({ method, args: [...args] });
  }

  clearRect(...args: unknown[]) { this._track('clearRect', args); }
  fillRect(...args: unknown[]) { this._track('fillRect', args); }
  strokeRect(...args: unknown[]) { this._track('strokeRect', args); }
  fillText(...args: unknown[]) { this._track('fillText', args); }
  drawImage(...args: unknown[]) { this._track('drawImage', args); }
  beginPath() { this._track('beginPath', []); }
  closePath() { this._track('closePath', []); }
  moveTo(...args: unknown[]) { this._track('moveTo', args); }
  lineTo(...args: unknown[]) { this._track('lineTo', args); }
  quadraticCurveTo(...args: unknown[]) { this._track('quadraticCurveTo', args); }
  fill() { this._track('fill', []); }
  stroke() { this._track('stroke', []); }
  save() { this._track('save', []); }
  restore() { this._track('restore', []); }
  translate(...args: unknown[]) { this._track('translate', args); }
  rotate(...args: unknown[]) { this._track('rotate', args); }
  scale(...args: unknown[]) { this._track('scale', args); }
  roundRect(...args: unknown[]) { this._track('roundRect', args); }

  getImageData(sx: number, sy: number, sw: number, sh: number) {
    this._track('getImageData', [sx, sy, sw, sh]);
    return {
      data: new Uint8ClampedArray(sw * sh * 4),
      width: sw,
      height: sh,
    };
  }

  putImageData(...args: unknown[]) { this._track('putImageData', args); }
}

// Patch HTMLCanvasElement.prototype.getContext to return our mock
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (
  contextId: string,
  ...args: unknown[]
) {
  if (contextId === '2d') {
    if (!(this as any).__mockCtx) {
      (this as any).__mockCtx = new MockCanvasRenderingContext2D();
    }
    return (this as any).__mockCtx;
  }
  return originalGetContext.call(this, contextId, ...args) as any;
};

// Mock Image for tests that load images
class MockImage {
  width: number = 100;
  height: number = 100;
  src: string = '';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor() {
    // Auto-trigger onload after src is set (sync in test environment)
    const self = this;
    Object.defineProperty(this, 'src', {
      get() { return self._src; },
      set(value: string) {
        self._src = value;
        if (value && self.onload) {
          setTimeout(() => self.onload?.(), 0);
        }
      },
      configurable: true,
    });
  }
  private _src: string = '';
}

// Export for direct use in tests
export { MockCanvasRenderingContext2D, MockImage };

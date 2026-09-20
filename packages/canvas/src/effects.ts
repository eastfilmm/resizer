import { canvasRGB } from 'stackblur-canvas';

/**
 * 블러용 스크래치 캔버스.
 *
 * 매 호출마다 new canvas를 만들면 2000px 기준 한 프레임에 약 40MB를 할당하게 되고,
 * 드래그 중에는 이게 초당 수십 번 반복돼 GC가 폭주한다. 모듈 스코프에 두고 재사용한다.
 * drawGlassBlurBackground는 동기적으로 끝나고 재진입하지 않으므로 공유해도 안전하다.
 */
const scratch: { temp: HTMLCanvasElement | null; blur: HTMLCanvasElement | null } = {
  temp: null,
  blur: null,
};

function getScratchCanvas(key: 'temp' | 'blur', width: number, height: number): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;

  let canvas = scratch[key];
  if (!canvas) {
    canvas = document.createElement('canvas');
    scratch[key] = canvas;
  }
  // 크기 대입은 캔버스를 초기화하므로 달라졌을 때만 수행한다.
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return canvas;
}

export function drawGlassBlurBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  intensity: number,
  overlayColor: string,
  opacity: number,
  useStackBlur: boolean = false
): void {
  // Crop source image to match canvas aspect ratio (center crop, no distortion)
  const canvasRatio = canvasWidth / canvasHeight;
  const imgRatio = img.width / img.height;

  let cropW: number, cropH: number, sx: number, sy: number;
  if (imgRatio > canvasRatio) {
    // Image is wider than canvas ratio - crop sides
    cropH = img.height;
    cropW = img.height * canvasRatio;
    sx = (img.width - cropW) / 2;
    sy = 0;
  } else {
    // Image is taller than canvas ratio - crop top/bottom
    cropW = img.width;
    cropH = img.width / canvasRatio;
    sx = 0;
    sy = (img.height - cropH) / 2;
  }

  const margin = Math.ceil(intensity * 3);
  const expandedWidth = canvasWidth + margin * 2;
  const expandedHeight = canvasHeight + margin * 2;

  const tempCanvas = getScratchCanvas('temp', expandedWidth, expandedHeight);
  if (!tempCanvas) return;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // 재사용 캔버스이므로 이전 프레임 잔상을 지우고 시작한다.
  tempCtx.clearRect(0, 0, expandedWidth, expandedHeight);
  tempCtx.drawImage(img, sx, sy, cropW, cropH, margin, margin, canvasWidth, canvasHeight);

  // Edge clamp
  tempCtx.drawImage(tempCanvas, margin, margin, canvasWidth, 1, margin, 0, canvasWidth, margin);
  tempCtx.drawImage(
    tempCanvas,
    margin,
    margin + canvasHeight - 1,
    canvasWidth,
    1,
    margin,
    margin + canvasHeight,
    canvasWidth,
    margin
  );
  tempCtx.drawImage(tempCanvas, margin, 0, 1, expandedHeight, 0, 0, margin, expandedHeight);
  tempCtx.drawImage(
    tempCanvas,
    margin + canvasWidth - 1,
    0,
    1,
    expandedHeight,
    margin + canvasWidth,
    0,
    margin,
    expandedHeight
  );

  if (useStackBlur) {
    canvasRGB(tempCanvas, 0, 0, expandedWidth, expandedHeight, Math.round(intensity));
    ctx.drawImage(tempCanvas, margin, margin, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
  } else {
    const blurCanvas = getScratchCanvas('blur', expandedWidth, expandedHeight);
    if (!blurCanvas) return;
    const blurCtx = blurCanvas.getContext('2d');
    if (!blurCtx) return;

    // 블러는 가장자리를 반투명하게 만들어 잔상이 비쳐 보이므로 반드시 지운다.
    blurCtx.clearRect(0, 0, expandedWidth, expandedHeight);
    blurCtx.filter = `blur(${intensity}px)`;
    blurCtx.drawImage(tempCanvas, 0, 0);
    blurCtx.filter = 'none';

    ctx.drawImage(blurCanvas, margin, margin, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
  }

  ctx.globalAlpha = opacity;
  ctx.fillStyle = overlayColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.globalAlpha = 1.0;
}

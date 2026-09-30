import { describe, expect, it } from 'vitest';
import { DEFAULT_IMAGE_SETTINGS, type ImageSettings } from '../../atoms/imageAtoms';
import { toDrawOptions } from '../../utils/drawOptions';

const settings: ImageSettings = {
  ...DEFAULT_IMAGE_SETTINGS,
  padding: 100,
  blurIntensity: 50,
  shadowIntensity: 40,
  shadowOffset: 20,
  overlayOpacity: 0.3,
};
const canvas = { width: 1000, height: 800 };

describe('toDrawOptions', () => {
  it('풀 해상도(scale 1)에서는 설정값을 그대로 넘긴다', () => {
    const options = toDrawOptions(settings, null, canvas, 1);

    expect(options).toMatchObject({
      actualCanvasWidth: 1000,
      actualCanvasHeight: 800,
      padding: 100,
      imageAreaWidth: 800,
      imageAreaHeight: 600,
      blurIntensity: 50,
      shadowIntensity: 40,
      shadowOffset: 20,
      scaleFactor: 1,
    });
  });

  it('작은 캔버스에서는 픽셀 값만 배율만큼 줄인다', () => {
    const options = toDrawOptions(settings, null, canvas, 0.4);

    expect(options.padding).toBe(40);
    expect(options.imageAreaWidth).toBe(1000 - 80);
    expect(options.blurIntensity).toBe(20);
    expect(options.shadowIntensity).toBe(16);
    expect(options.shadowOffset).toBe(8);
    expect(options.scaleFactor).toBe(0.4);
    // 비율 값은 배율과 무관하다
    expect(options.overlayOpacity).toBe(0.3);
  });

  it('폴라로이드 날짜는 사진별 촬영일로 푼다', () => {
    expect(toDrawOptions(settings, { photoDate: '2023.07.14' }, canvas, 1).polaroidDate).toBe('2023.07.14');
    expect(
      toDrawOptions({ ...settings, polaroidDate: '1999.12.31' }, { photoDate: '2023.07.14' }, canvas, 1)
        .polaroidDate,
    ).toBe('1999.12.31');
  });
});

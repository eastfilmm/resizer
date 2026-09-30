import { describe, expect, it } from 'vitest';
import { DEFAULT_IMAGE_SETTINGS, type ImageSettings } from '../../atoms/imageAtoms';
import { FRAME_DEFAULT_PADDING, toggleFrame } from '../../hooks/useFrameToggle';

const state = (settings: Partial<ImageSettings> = {}, prevBackgroundColor: ImageSettings['backgroundColor'] | null = null) => ({
  settings: { ...DEFAULT_IMAGE_SETTINGS, ...settings },
  prevBackgroundColor,
});

describe('toggleFrame', () => {
  it('프레임을 켜면 기본 여백을 준다', () => {
    const next = toggleFrame(state(), 'thin');

    expect(next.settings.frameType).toBe('thin');
    expect(next.settings.padding).toBe(FRAME_DEFAULT_PADDING);
  });

  it('켜진 프레임을 다시 누르면 끄고 여백을 없앤다', () => {
    const next = toggleFrame(state({ frameType: 'polaroid', padding: 80 }), 'polaroid');

    expect(next.settings.frameType).toBe('none');
    expect(next.settings.padding).toBe(0);
  });

  describe('Thin/Film 배경', () => {
    it('배경을 흰색으로 고정하고 원래 색을 기억한다', () => {
      const next = toggleFrame(state({ backgroundColor: 'black' }), 'thin');

      expect(next.settings.backgroundColor).toBe('white');
      expect(next.prevBackgroundColor).toBe('black');
    });

    it('끌 때 기억한 색으로 되돌린다', () => {
      const next = toggleFrame(state({ frameType: 'thin', backgroundColor: 'white' }, 'black'), 'thin');

      expect(next.settings.backgroundColor).toBe('black');
      expect(next.prevBackgroundColor).toBeNull();
    });

    it('Thin → Film으로 바꿔도 처음 색을 잃지 않는다', () => {
      const next = toggleFrame(state({ frameType: 'thin', backgroundColor: 'white' }, 'black'), 'mediumFilm');

      expect(next.prevBackgroundColor).toBe('black');
    });

    it('Thin → Polaroid로 바꾸면 기억한 색으로 되돌린다', () => {
      const next = toggleFrame(state({ frameType: 'thin', backgroundColor: 'white' }, 'black'), 'polaroid');

      expect(next.settings.backgroundColor).toBe('black');
      expect(next.prevBackgroundColor).toBeNull();
    });
  });

  describe('Polaroid 날짜', () => {
    it('켤 때 날짜를 건드리지 않는다 (입력이 없으면 사진별 촬영일을 따른다)', () => {
      expect(toggleFrame(state(), 'polaroid').settings.polaroidDate).toBeNull();
      expect(toggleFrame(state({ polaroidDate: '1999.12.31' }), 'polaroid').settings.polaroidDate).toBe(
        '1999.12.31',
      );
    });

    it('다른 프레임으로 바꾸면 입력값을 버리고 촬영일로 돌아간다', () => {
      const next = toggleFrame(state({ frameType: 'polaroid', polaroidDate: '1999.12.31' }), 'thin');

      expect(next.settings.polaroidDate).toBeNull();
    });
  });
});

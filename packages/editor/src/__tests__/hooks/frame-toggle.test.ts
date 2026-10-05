import { describe, expect, it } from 'vitest';
import { DEFAULT_IMAGE_SETTINGS, type ImageSettings } from '../../atoms/imageAtoms';
import { FRAME_DEFAULT_PADDING, selectFrame, setFrameEnabled, toggleFrame } from '../../hooks/useFrameToggle';

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

  it('프레임을 켜면 lastFrameType에 기억한다', () => {
    expect(toggleFrame(state(), 'mediumFilm').settings.lastFrameType).toBe('mediumFilm');
    // 끌 때는 기억을 지우지 않는다
    const off = toggleFrame(state({ frameType: 'thin', lastFrameType: 'thin' }), 'thin');
    expect(off.settings.lastFrameType).toBe('thin');
  });
});

describe('selectFrame (프레임 버튼)', () => {
  it('다른 프레임을 누르면 그 프레임으로 바꾼다', () => {
    expect(selectFrame(state({ frameType: 'thin' }), 'polaroid').settings.frameType).toBe('polaroid');
  });

  it('꺼진 상태에서 누르면 그 프레임으로 켠다', () => {
    expect(selectFrame(state(), 'thin').settings.frameType).toBe('thin');
  });

  it('켜진 프레임을 다시 눌러도 끄지 않는다', () => {
    const current = state({ frameType: 'polaroid', padding: 80 });
    expect(selectFrame(current, 'polaroid')).toBe(current);
  });
});

describe('setFrameEnabled (스위치)', () => {
  it('켜면 마지막에 쓴 프레임으로 켠다 (처음엔 Polaroid)', () => {
    expect(DEFAULT_IMAGE_SETTINGS.lastFrameType).toBe('polaroid');
    expect(setFrameEnabled(state(), true).settings.frameType).toBe('polaroid');
    expect(setFrameEnabled(state({ lastFrameType: 'mediumFilm' }), true).settings.frameType).toBe(
      'mediumFilm',
    );
  });

  it('끄면 지금 프레임을 해제하고 Thin/Film이 고정했던 배경을 되돌린다', () => {
    const next = setFrameEnabled(
      state({ frameType: 'thin', backgroundColor: 'white', padding: 80 }, 'blue'),
      false,
    );

    expect(next.settings.frameType).toBe('none');
    expect(next.settings.padding).toBe(0);
    expect(next.settings.backgroundColor).toBe('blue');
  });

  it('이미 그 상태면 아무것도 바꾸지 않는다', () => {
    const off = state();
    expect(setFrameEnabled(off, false)).toBe(off);
    const on = state({ frameType: 'thin' });
    expect(setFrameEnabled(on, true)).toBe(on);
  });
});


import { describe, expect, it } from 'vitest';
import { DEFAULT_IMAGE_SETTINGS, type ImageSettings } from '../../atoms/imageAtoms';
import { selectFrame, setFrameEnabled, toggleFrame } from '../../hooks/useFrameToggle';

const settings = (overrides: Partial<ImageSettings> = {}): ImageSettings => ({
  ...DEFAULT_IMAGE_SETTINGS,
  ...overrides,
});

describe('toggleFrame', () => {
  it('프레임을 켜고 꺼도 사용자가 맞춘 여백은 그대로다', () => {
    const on = toggleFrame(settings({ padding: 30 }), 'thin');
    expect(on.frameType).toBe('thin');
    expect(on.padding).toBe(30);

    const off = toggleFrame(on, 'thin');
    expect(off.frameType).toBe('none');
    expect(off.padding).toBe(30);
  });

  it.each(['polaroid', 'thin', 'mediumFilm'] as const)(
    '%s 프레임을 켜고 꺼도 배경색은 그대로다',
    (type) => {
      const on = toggleFrame(settings({ backgroundColor: 'blue' }), type);
      expect(on.backgroundColor).toBe('blue');

      expect(toggleFrame(on, type).backgroundColor).toBe('blue');
    },
  );

  it('프레임 사이를 바꿔도 배경색은 그대로다', () => {
    const thin = toggleFrame(settings({ backgroundColor: 'violet' }), 'thin');
    expect(toggleFrame(thin, 'polaroid').backgroundColor).toBe('violet');
  });

  it('프레임을 켜면 lastFrameType에 기억한다', () => {
    expect(toggleFrame(settings(), 'mediumFilm').lastFrameType).toBe('mediumFilm');
    // 끌 때는 기억을 지우지 않는다
    const off = toggleFrame(settings({ frameType: 'thin', lastFrameType: 'thin' }), 'thin');
    expect(off.lastFrameType).toBe('thin');
  });

  describe('Polaroid 날짜', () => {
    it('켤 때 날짜를 건드리지 않는다 (입력이 없으면 사진별 촬영일을 따른다)', () => {
      expect(toggleFrame(settings(), 'polaroid').polaroidDate).toBeNull();
      expect(toggleFrame(settings({ polaroidDate: '1999.12.31' }), 'polaroid').polaroidDate).toBe(
        '1999.12.31',
      );
    });

    it('다른 프레임으로 바꾸면 입력값을 버리고 촬영일로 돌아간다', () => {
      const next = toggleFrame(settings({ frameType: 'polaroid', polaroidDate: '1999.12.31' }), 'thin');

      expect(next.polaroidDate).toBeNull();
    });
  });
});

describe('selectFrame (프레임 버튼)', () => {
  it('다른 프레임을 누르면 그 프레임으로 바꾼다', () => {
    expect(selectFrame(settings({ frameType: 'thin' }), 'polaroid').frameType).toBe('polaroid');
  });

  it('꺼진 상태에서 누르면 그 프레임으로 켠다', () => {
    expect(selectFrame(settings(), 'thin').frameType).toBe('thin');
  });

  it('켜진 프레임을 다시 눌러도 끄지 않는다', () => {
    const current = settings({ frameType: 'polaroid' });
    expect(selectFrame(current, 'polaroid')).toBe(current);
  });
});

describe('setFrameEnabled (스위치)', () => {
  it('켜면 마지막에 쓴 프레임으로 켠다 (처음엔 Polaroid)', () => {
    expect(DEFAULT_IMAGE_SETTINGS.lastFrameType).toBe('polaroid');
    expect(setFrameEnabled(settings(), true).frameType).toBe('polaroid');
    expect(setFrameEnabled(settings({ lastFrameType: 'mediumFilm' }), true).frameType).toBe(
      'mediumFilm',
    );
  });

  it('끄면 지금 프레임을 해제한다', () => {
    expect(setFrameEnabled(settings({ frameType: 'thin' }), false).frameType).toBe('none');
  });

  it('이미 그 상태면 아무것도 바꾸지 않는다', () => {
    const off = settings();
    expect(setFrameEnabled(off, false)).toBe(off);
    const on = settings({ frameType: 'thin' });
    expect(setFrameEnabled(on, true)).toBe(on);
  });
});

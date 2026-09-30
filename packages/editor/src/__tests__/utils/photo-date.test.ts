import { describe, expect, it } from 'vitest';
import { parsePhotoDate } from '../../utils/photoDate';
import { resolvePolaroidDate } from '../../utils/imageUtils';
import { buildJpeg } from '../exifFixture';

describe('parsePhotoDate', () => {
  it('reads DateTimeOriginal as YYYY.MM.DD', () => {
    const buffer = buildJpeg({ exif: [{ tag: 0x9003, value: '2023:07:14 18:30:00' }] });
    expect(parsePhotoDate(buffer)).toBe('2023.07.14');
  });

  it('prefers DateTimeOriginal over the file modification date', () => {
    const buffer = buildJpeg({
      ifd0: [{ tag: 0x0132, value: '2025:01:01 00:00:00' }],
      exif: [{ tag: 0x9003, value: '2023:07:14 18:30:00' }],
    });
    expect(parsePhotoDate(buffer)).toBe('2023.07.14');
  });

  it('falls back to DateTimeDigitized, then DateTime', () => {
    expect(parsePhotoDate(buildJpeg({ exif: [{ tag: 0x9004, value: '2022:02:03 10:00:00' }] }))).toBe(
      '2022.02.03',
    );
    expect(parsePhotoDate(buildJpeg({ ifd0: [{ tag: 0x0132, value: '2021:12:31 23:59:59' }] }))).toBe(
      '2021.12.31',
    );
  });

  it('handles big-endian (Motorola) byte order', () => {
    const buffer = buildJpeg({ little: false, exif: [{ tag: 0x9003, value: '2020:05:06 07:08:09' }] });
    expect(parsePhotoDate(buffer)).toBe('2020.05.06');
  });

  it('ignores zero-filled dates', () => {
    const buffer = buildJpeg({ exif: [{ tag: 0x9003, value: '0000:00:00 00:00:00' }] });
    expect(parsePhotoDate(buffer)).toBeNull();
  });

  it('returns null when there is no EXIF', () => {
    expect(parsePhotoDate(new Uint8Array([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43]).buffer)).toBeNull();
    expect(parsePhotoDate(new ArrayBuffer(0))).toBeNull();
  });
});

describe('resolvePolaroidDate', () => {
  it('입력이 없으면 사진마다 자기 촬영일을 쓴다', () => {
    const settings = { polaroidDate: null };

    expect(resolvePolaroidDate(settings, { photoDate: '2023.07.14' })).toBe('2023.07.14');
    expect(resolvePolaroidDate(settings, { photoDate: '2024.02.01' })).toBe('2024.02.01');
    expect(resolvePolaroidDate(settings, {})).toBe('');
    expect(resolvePolaroidDate(settings, null)).toBe('');
  });

  it('직접 입력한 값은 모든 사진에 같이 쓴다', () => {
    const settings = { polaroidDate: '1999.12.31' };

    expect(resolvePolaroidDate(settings, { photoDate: '2023.07.14' })).toBe('1999.12.31');
    expect(resolvePolaroidDate(settings, {})).toBe('1999.12.31');
  });

  it('입력을 지우면 촬영일이 있어도 날짜를 찍지 않는다', () => {
    expect(resolvePolaroidDate({ polaroidDate: '' }, { photoDate: '2023.07.14' })).toBe('');
  });
});

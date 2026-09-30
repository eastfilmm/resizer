/**
 * 업로드한 사진의 EXIF에서 촬영일을 읽어 폴라로이드 날짜 형식(YYYY.MM.DD)으로 돌려준다.
 *
 * 의존성 없이 TIFF 구조만 따라간다. JPEG는 APP1 세그먼트가 파일 앞쪽에 있어서
 * 앞부분만 읽으면 충분하다. EXIF가 없거나 깨졌으면 null — 호출하는 쪽은 그냥
 * 빈 칸으로 둔다.
 */

// 촬영일 태그 우선순위: 원본 촬영 → 디지털화 → 파일 수정일
const TAG_EXIF_IFD_POINTER = 0x8769;
const TAG_DATE_TIME_ORIGINAL = 0x9003;
const TAG_DATE_TIME_DIGITIZED = 0x9004;
const TAG_DATE_TIME = 0x0132;

const TYPE_ASCII = 2;

// JPEG APP1은 최대 64KB이고 보통 파일 맨 앞에 온다.
const HEAD_BYTES = 128 * 1024;

const EXIF_MARKER = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00]; // "Exif\0\0"

const findTiffStart = (bytes: Uint8Array): number => {
  outer: for (let i = 0; i + EXIF_MARKER.length + 8 <= bytes.length; i++) {
    for (let j = 0; j < EXIF_MARKER.length; j++) {
      if (bytes[i + j] !== EXIF_MARKER[j]) continue outer;
    }
    return i + EXIF_MARKER.length;
  }
  return -1;
};

type IfdEntries = Map<number, { type: number; count: number; valueOffset: number }>;

const readIfd = (view: DataView, tiff: number, ifdOffset: number, little: boolean): IfdEntries => {
  const entries: IfdEntries = new Map();
  const start = tiff + ifdOffset;
  if (start + 2 > view.byteLength) return entries;

  const count = view.getUint16(start, little);
  for (let i = 0; i < count; i++) {
    const entry = start + 2 + i * 12;
    if (entry + 12 > view.byteLength) break;
    entries.set(view.getUint16(entry, little), {
      type: view.getUint16(entry + 2, little),
      count: view.getUint32(entry + 4, little),
      valueOffset: entry + 8,
    });
  }
  return entries;
};

const readAscii = (
  view: DataView,
  tiff: number,
  entry: { type: number; count: number; valueOffset: number } | undefined,
  little: boolean,
): string | null => {
  if (!entry || entry.type !== TYPE_ASCII) return null;
  // 4바이트 이하면 값이 엔트리 안에, 넘으면 오프셋이 들어 있다.
  const start = entry.count <= 4 ? entry.valueOffset : tiff + view.getUint32(entry.valueOffset, little);
  if (start + entry.count > view.byteLength) return null;

  let text = '';
  for (let i = 0; i < entry.count; i++) {
    const code = view.getUint8(start + i);
    if (code === 0) break;
    text += String.fromCharCode(code);
  }
  return text;
};

/** "YYYY:MM:DD HH:MM:SS" → "YYYY.MM.DD". 비어 있거나 0으로 채워진 값은 버린다. */
const formatExifDate = (value: string | null): string | null => {
  const match = value?.match(/^(\d{4}):(\d{2}):(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  if (Number(year) === 0 || Number(month) === 0 || Number(day) === 0) return null;
  return `${year}.${month}.${day}`;
};

export const parsePhotoDate = (buffer: ArrayBuffer): string | null => {
  const bytes = new Uint8Array(buffer);
  const tiff = findTiffStart(bytes);
  if (tiff < 0) return null;

  const view = new DataView(buffer);
  const byteOrder = view.getUint16(tiff);
  const little = byteOrder === 0x4949; // "II"
  if (!little && byteOrder !== 0x4d4d) return null; // "MM"
  if (view.getUint16(tiff + 2, little) !== 42) return null;

  const ifd0 = readIfd(view, tiff, view.getUint32(tiff + 4, little), little);

  const exifPointer = ifd0.get(TAG_EXIF_IFD_POINTER);
  if (exifPointer) {
    const exifIfd = readIfd(view, tiff, view.getUint32(exifPointer.valueOffset, little), little);
    const date =
      formatExifDate(readAscii(view, tiff, exifIfd.get(TAG_DATE_TIME_ORIGINAL), little)) ??
      formatExifDate(readAscii(view, tiff, exifIfd.get(TAG_DATE_TIME_DIGITIZED), little));
    if (date) return date;
  }

  return formatExifDate(readAscii(view, tiff, ifd0.get(TAG_DATE_TIME), little));
};

/** 업로드한 파일에서 촬영일을 읽는다. 어떤 이유로든 실패하면 null. */
export const readPhotoDate = async (file: Blob): Promise<string | null> => {
  try {
    return parsePhotoDate(await file.slice(0, HEAD_BYTES).arrayBuffer());
  } catch {
    return null;
  }
};

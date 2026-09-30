/** 테스트용 최소 EXIF JPEG를 만든다. */

interface Tag {
  tag: number;
  value: string;
}

/**
 * 최소한의 EXIF를 가진 JPEG 앞부분을 만든다.
 * IFD0에 DateTime(선택)과 ExifIFD 포인터(선택), ExifIFD에 촬영일 태그들을 넣는다.
 */
export const buildJpeg = ({
  ifd0 = [],
  exif = [],
  little = true,
}: {
  ifd0?: Tag[];
  exif?: Tag[];
  little?: boolean;
}): ArrayBuffer => {
  const ifd0Count = ifd0.length + (exif.length ? 1 : 0);
  const ifd0Size = 2 + ifd0Count * 12 + 4;
  const exifSize = exif.length ? 2 + exif.length * 12 + 4 : 0;
  const ifd0Offset = 8;
  const exifOffset = ifd0Offset + ifd0Size;
  let dataOffset = exifOffset + exifSize;

  const tiff = new DataView(new ArrayBuffer(512));
  tiff.setUint16(0, little ? 0x4949 : 0x4d4d);
  tiff.setUint16(2, 42, little);
  tiff.setUint32(4, ifd0Offset, little);

  const writeIfd = (offset: number, tags: Tag[], exifPointer?: number) => {
    const count = tags.length + (exifPointer !== undefined ? 1 : 0);
    tiff.setUint16(offset, count, little);
    let entry = offset + 2;
    for (const { tag, value } of tags) {
      const bytes = [...value].map((c) => c.charCodeAt(0)).concat(0);
      tiff.setUint16(entry, tag, little);
      tiff.setUint16(entry + 2, 2, little);
      tiff.setUint32(entry + 4, bytes.length, little);
      tiff.setUint32(entry + 8, dataOffset, little);
      bytes.forEach((b, i) => tiff.setUint8(dataOffset + i, b));
      dataOffset += bytes.length;
      entry += 12;
    }
    if (exifPointer !== undefined) {
      tiff.setUint16(entry, 0x8769, little);
      tiff.setUint16(entry + 2, 4, little);
      tiff.setUint32(entry + 4, 1, little);
      tiff.setUint32(entry + 8, exifPointer, little);
    }
  };

  writeIfd(ifd0Offset, ifd0, exif.length ? exifOffset : undefined);
  if (exif.length) writeIfd(exifOffset, exif);

  const tiffBytes = new Uint8Array(tiff.buffer, 0, dataOffset);
  // SOI + APP1 마커/길이 + "Exif\0\0" + TIFF
  const head = [0xff, 0xd8, 0xff, 0xe1, 0x00, 0x00, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00];
  const out = new Uint8Array(head.length + tiffBytes.length);
  out.set(head);
  out.set(tiffBytes, head.length);
  return out.buffer;
};

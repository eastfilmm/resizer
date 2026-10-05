import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';
import { activeNavPanelAtom, uploadedImagesAtom } from '../../atoms/imageAtoms';
import { useImageUpload } from '../../hooks/useImageUpload';
import { buildJpeg } from '../exifFixture';

const plain = (name: string) => new File([new Uint8Array([0xff, 0xd8])], name, { type: 'image/jpeg' });
const withDate = (name: string, date: string) =>
  new File([buildJpeg({ exif: [{ tag: 0x9003, value: date }] })], name, { type: 'image/jpeg' });

let urlCount = 0;
beforeEach(() => {
  urlCount = 0;
  vi.stubGlobal('URL', { ...URL, createObjectURL: () => `blob:${++urlCount}`, revokeObjectURL: () => {} });
});
afterEach(() => vi.unstubAllGlobals());

const setup = () => {
  const store = createStore();
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  const { result } = renderHook(() => useImageUpload(), { wrapper });
  return { store, upload: (files: File[]) => act(() => result.current(files)) };
};

describe('useImageUpload', () => {
  it('촬영일을 기다리지 않고 사진을 바로 목록에 올린다', () => {
    const { store, upload } = setup();

    upload([withDate('a.jpg', '2023:07:14 18:30:00')]);

    const [image] = store.get(uploadedImagesAtom);
    expect(image.fileName).toBe('a.jpg');
    expect(image.photoDate).toBeUndefined();
  });

  it('촬영일은 읽히는 대로 해당 사진에만 채운다', async () => {
    const { store, upload } = setup();

    upload([withDate('a.jpg', '2023:07:14 18:30:00'), plain('b.jpg'), withDate('c.jpg', '2024:02:01 09:00:00')]);

    await waitFor(() => expect(store.get(uploadedImagesAtom)[2].photoDate).toBe('2024.02.01'));
    expect(store.get(uploadedImagesAtom).map((img) => img.photoDate)).toEqual([
      '2023.07.14',
      undefined,
      '2024.02.01',
    ]);
  });

  it('연달아 올려도 먼저 올린 사진이 목록에서 빠지지 않는다', () => {
    const { store, upload } = setup();

    upload([plain('a.jpg')]);
    upload([plain('b.jpg')]);

    expect(store.get(uploadedImagesAtom).map((img) => img.fileName)).toEqual(['a.jpg', 'b.jpg']);
  });

  it('촬영일을 읽는 사이 사진이 교체되면 날짜를 버린다', async () => {
    const { store, upload } = setup();

    upload([withDate('old.jpg', '2023:07:14 18:30:00')]);
    act(() => store.set(uploadedImagesAtom, []));

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(store.get(uploadedImagesAtom)).toEqual([]);
  });

  it('사진을 올리면 Layout 패널을 연다', () => {
    const { store, upload } = setup();
    store.set(activeNavPanelAtom, null);

    upload([plain('a.jpg')]);

    expect(store.get(activeNavPanelAtom)).toBe('layout');
  });

  it('이미지가 아닌 파일만 고르면 패널을 건드리지 않는다', () => {
    const { store, upload } = setup();
    store.set(activeNavPanelAtom, 'shadow');

    upload([new File(['x'], 'notes.txt', { type: 'text/plain' })]);

    expect(store.get(activeNavPanelAtom)).toBe('shadow');
  });
});


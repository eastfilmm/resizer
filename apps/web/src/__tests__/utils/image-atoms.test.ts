import { describe, expect, it } from 'vitest';
import { createStore } from 'jotai';
import {
  canResetAtom,
  imageSettingsAtom,
  imageUrlAtom,
  selectedImageAtom,
  selectedImageIdAtom,
  uploadedImagesAtom,
  type UploadedImage,
} from '@/atoms/imageAtoms';

const uploadedImages: UploadedImage[] = [
  { id: 'image-1', fileName: 'one.jpg', objectUrl: 'blob:one' },
  { id: 'image-2', fileName: 'two.jpg', objectUrl: 'blob:two' },
];

describe('imageAtoms', () => {
  it('uses the first uploaded image when nothing is selected', () => {
    const store = createStore();
    store.set(uploadedImagesAtom, uploadedImages);

    expect(store.get(selectedImageAtom)).toEqual(uploadedImages[0]);
    expect(store.get(imageUrlAtom)).toBe('blob:one');
  });

  it('returns the selected uploaded image when selectedImageId is set', () => {
    const store = createStore();
    store.set(uploadedImagesAtom, uploadedImages);
    store.set(selectedImageIdAtom, 'image-2');

    expect(store.get(selectedImageAtom)).toEqual(uploadedImages[1]);
    expect(store.get(imageUrlAtom)).toBe('blob:two');
  });

  it('falls back to the first image when the selected id is missing', () => {
    const store = createStore();
    store.set(uploadedImagesAtom, uploadedImages);
    store.set(selectedImageIdAtom, 'missing');

    expect(store.get(selectedImageAtom)).toEqual(uploadedImages[0]);
  });

  it('canResetAtom becomes true when images are uploaded', () => {
    const store = createStore();
    expect(store.get(canResetAtom)).toBe(false);

    store.set(uploadedImagesAtom, uploadedImages);
    expect(store.get(canResetAtom)).toBe(true);
  });

  it('canResetAtom becomes true when settings change without images', () => {
    const store = createStore();
    expect(store.get(canResetAtom)).toBe(false);

    store.set(imageSettingsAtom, {
      ...store.get(imageSettingsAtom),
      padding: 24,
    });

    expect(store.get(canResetAtom)).toBe(true);
  });
});

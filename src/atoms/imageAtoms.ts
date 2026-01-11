import { atom } from 'jotai';

// 이미지 Blob URL
export const imageUrlAtom = atom<string | null>(null);

// 캔버스 배경색 ('white' | 'black')
export const backgroundColorAtom = atom<'white' | 'black'>('white');

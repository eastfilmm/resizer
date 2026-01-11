'use client';

import styled from 'styled-components';
import { RefObject } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { imageUrlAtom } from '@/atoms/imageAtoms';

interface ImageUploaderProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export default function ImageUploader({ fileInputRef }: ImageUploaderProps) {
  const imageUrl = useAtomValue(imageUrlAtom);
  const setImageUrl = useSetAtom(imageUrlAtom);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <>
      <FileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        id="image-upload"
      />
      
      <SelectButton onClick={() => fileInputRef.current?.click()}>
        {imageUrl ? 'Select Another Image' : 'Select Image'}
      </SelectButton>
    </>
  );
}

const FileInput = styled.input`
  display: none;
`;

const SelectButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  touch-action: manipulation;
  width: 100%;
  max-width: 320px;
  height: 40px;
  &:hover {
    background-color: #0056b3;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

'use client';

import styled from 'styled-components';
import { RefObject } from 'react';
import { useSetAtom } from 'jotai';
import { imageUrlAtom } from '@/atoms/imageAtoms';
import { IconButton, ButtonIcon } from '@/components/styled/Button';

interface ImageUploaderProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const ImageUploader = ({ fileInputRef }: ImageUploaderProps) => {
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
      
      <IconButton $variant="blue" onClick={() => fileInputRef.current?.click()}>
        <ButtonIcon src="/upload.svg" alt="Upload" />
      </IconButton>
    </>
  );
}

const FileInput = styled.input`
  display: none;
`;

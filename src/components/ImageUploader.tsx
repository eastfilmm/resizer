'use client';

import styled from 'styled-components';
import { RefObject } from 'react';


interface ImageUploaderProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasSelectedImage: boolean;
}

export default function ImageUploader({ 
  fileInputRef, 
  onImageSelect, 
  hasSelectedImage 
}: ImageUploaderProps) {
  return (
    <>
      <FileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageSelect}
        id="image-upload"
      />
      
      <SelectButton onClick={() => fileInputRef.current?.click()}>
        {hasSelectedImage ? 'Select Another Image' : 'Select Image'}
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
  padding: 16px 32px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  touch-action: manipulation;
  width: 100%;
  max-width: 300px;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

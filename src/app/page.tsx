'use client';

import { useState, useRef } from 'react';
import { Container, Main, Title } from '@/components/styled/Layout';
import ImageUploader from '@/components/ImageUploader';
import ImageCanvas from '@/components/ImageCanvas';
import ActionButtons from '@/components/ActionButtons';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Keep canvas unchanged (don't clear)
  };

  return (
    <Container>
      <Main>
        <Title>Image Resizer</Title>
        
        <ImageUploader
          fileInputRef={fileInputRef}
          onImageSelect={handleImageSelect}
          hasSelectedImage={!!selectedImage}
        />

        <ImageCanvas
          canvasRef={canvasRef}
          imageUrl={imageUrl}
        />

        <ActionButtons
          canvasRef={canvasRef}
          onReset={handleReset}
        />
      </Main>
    </Container>
  );
}

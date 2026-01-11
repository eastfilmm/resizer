'use client';

import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { paddingAtom } from '@/atoms/imageAtoms';

export default function CanvasPaddingSelector() {
  const padding = useAtomValue(paddingAtom);
  const setPadding = useSetAtom(paddingAtom);

  const handlePaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPadding(Number(e.target.value));
  };

  return (
    <Container>
      <SliderContainer>
        <SliderLabel>Padding: {padding}px</SliderLabel>
        <Slider
          type="range"
          min="0"
          max="200"
          value={padding}
          onChange={handlePaddingChange}
        />
      </SliderContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  gap: 8px;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const SliderLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
  min-width: 100px;
`;

const Slider = styled.input`
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #ddd;
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    background: #0056b3;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

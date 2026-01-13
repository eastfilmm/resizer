'use client';

import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { shadowEnabledAtom, shadowIntensityAtom, shadowOffsetAtom } from '@/atoms/imageAtoms';

export default function ShadowSelector() {
  const shadowEnabled = useAtomValue(shadowEnabledAtom);
  const setShadowEnabled = useSetAtom(shadowEnabledAtom);
  const shadowIntensity = useAtomValue(shadowIntensityAtom);
  const setShadowIntensity = useSetAtom(shadowIntensityAtom);
  const shadowOffset = useAtomValue(shadowOffsetAtom);
  const setShadowOffset = useSetAtom(shadowOffsetAtom);

  const toggleShadow = () => {
    setShadowEnabled(!shadowEnabled);
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShadowIntensity(Number(e.target.value));
  };

  const handleOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShadowOffset(Number(e.target.value));
  };

  return (
    <Container>
      <SelectorContainer>
        <Label>Shadow</Label>
        <ToggleSwitch 
          $isActive={shadowEnabled} 
          onClick={toggleShadow}
        />
      </SelectorContainer>
      {shadowEnabled && (
        <>
          <SliderContainer>
            <SliderLabel>Blur: {shadowIntensity}px</SliderLabel>
            <Slider
              type="range"
              min="1"
              max="100"
              value={shadowIntensity}
              onChange={handleIntensityChange}
            />
          </SliderContainer>
          <SliderContainer>
            <SliderLabel>Offset: {shadowOffset}px</SliderLabel>
            <Slider
              type="range"
              min="1"
              max="50"
              value={shadowOffset}
              onChange={handleOffsetChange}
            />
          </SliderContainer>
        </>
      )}
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

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Label = styled.label`
  font-size: 1rem;
`;

const ToggleSwitch = styled.div<{ $isActive: boolean }>`
  position: relative;
  width: 48px;
  height: 24px;
  background-color: ${props => props.$isActive ? '#007bff' : '#6c757d'};
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.$isActive ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: scale(0.95);
  }
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
  min-width: 80px;
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

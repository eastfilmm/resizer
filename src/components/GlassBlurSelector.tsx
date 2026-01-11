'use client';

import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { glassBlurAtom, blurIntensityAtom, overlayOpacityAtom } from '@/atoms/imageAtoms';

export default function GlassBlurSelector() {
  const glassBlur = useAtomValue(glassBlurAtom);
  const setGlassBlur = useSetAtom(glassBlurAtom);
  const blurIntensity = useAtomValue(blurIntensityAtom);
  const setBlurIntensity = useSetAtom(blurIntensityAtom);
  const overlayOpacity = useAtomValue(overlayOpacityAtom);
  const setOverlayOpacity = useSetAtom(overlayOpacityAtom);

  const toggleGlassBlur = () => {
    setGlassBlur(!glassBlur);
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlurIntensity(Number(e.target.value));
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOverlayOpacity(Number(e.target.value) / 100);
  };

  return (
    <Container>
      <SelectorContainer>
        <Label>Glass Blur</Label>
        <ToggleSwitch 
          $isActive={glassBlur} 
          onClick={toggleGlassBlur}
        />
      </SelectorContainer>
      {glassBlur && (
        <>
          <SliderContainer>
            <SliderLabel>Blur: {blurIntensity}%</SliderLabel>
            <Slider
              type="range"
              min="1"
              max="100"
              value={blurIntensity}
              onChange={handleIntensityChange}
            />
          </SliderContainer>
          <SliderContainer>
            <SliderLabel>Tint: {Math.round(overlayOpacity * 100)}%</SliderLabel>
            <Slider
              type="range"
              min="0"
              max="100"
              value={Math.round(overlayOpacity * 100)}
              onChange={handleOpacityChange}
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

'use client';

import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { glassBlurAtom, blurIntensityAtom, overlayOpacityAtom } from '@/atoms/imageAtoms';

export const GlassBlurPanel = () => {
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
      <Row>
        <Label>Glass Blur</Label>
        <ToggleSwitch $isActive={glassBlur} onClick={toggleGlassBlur} />
      </Row>
      
      <SliderSection>
        <SliderRow>
          <SliderLabel>Blur</SliderLabel>
          <SliderValue>{blurIntensity}%</SliderValue>
        </SliderRow>
        <Slider
          type="range"
          min="1"
          max="100"
          value={blurIntensity}
          onChange={handleIntensityChange}
          disabled={!glassBlur}
        />
      </SliderSection>

      <SliderSection>
        <SliderRow>
          <SliderLabel>Tint</SliderLabel>
          <SliderValue>{Math.round(overlayOpacity * 100)}%</SliderValue>
        </SliderRow>
        <Slider
          type="range"
          min="0"
          max="100"
          value={Math.round(overlayOpacity * 100)}
          onChange={handleOpacityChange}
          disabled={!glassBlur}
        />
      </SliderSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  max-width: 360px;
  width: 100%;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 0.875rem;
  color: #666;
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

const SliderSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const SliderRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const SliderLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const SliderValue = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const Slider = styled.input`
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #ddd;
  border-radius: 2px;
  outline: none;
  
  &:disabled {
    opacity: 0.5;
  }
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    background: #0056b3;
  }
  
  &:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

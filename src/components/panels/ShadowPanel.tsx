'use client';

import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { shadowEnabledAtom, shadowIntensityAtom, shadowOffsetAtom } from '@/atoms/imageAtoms';

export const ShadowPanel = () => {
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
      <Row>
        <Label>Shadow</Label>
        <ToggleSwitch $isActive={shadowEnabled} onClick={toggleShadow} />
      </Row>
      
      <SliderSection>
        <SliderRow>
          <SliderLabel>Blur</SliderLabel>
          <SliderValue>{shadowIntensity}px</SliderValue>
        </SliderRow>
        <Slider
          type="range"
          min="1"
          max="100"
          value={shadowIntensity}
          onChange={handleIntensityChange}
          disabled={!shadowEnabled}
        />
      </SliderSection>

      <SliderSection>
        <SliderRow>
          <SliderLabel>Offset</SliderLabel>
          <SliderValue>{shadowOffset}px</SliderValue>
        </SliderRow>
        <Slider
          type="range"
          min="1"
          max="50"
          value={shadowOffset}
          onChange={handleOffsetChange}
          disabled={!shadowEnabled}
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

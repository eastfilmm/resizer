'use client';

import styled from 'styled-components';

// Panel Container
export const PanelContainer = styled.div<{ $direction?: 'column' | 'row' }>`
  display: flex;
  flex-direction: ${props => props.$direction || 'column'};
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  max-width: 360px;
  width: 100%;
`;

// Row for label + toggle
export const PanelRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PanelLabelWrapper = styled.div<{$textAlign: 'center' | 'left'| 'right'}>`
  text-align :${props => props.$textAlign || 'left'}; 
  max-width: 360px;
  width:100%;
  
`
// Label text
export const PanelLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

// Toggle Switch
export const ToggleSwitch = styled.div<{ $isActive: boolean }>`
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

// Slider Section Container
export const SliderSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

// Slider Label Row
export const SliderLabelRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

// Slider Label
export const SliderLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

// Slider Value
export const SliderValue = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

// Slider Input
export const Slider = styled.input`
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

// Text Input
export const TextInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 0.775rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    border-color: #007bff;
  }
  
  &:disabled {
    opacity: 0.5;
    background-color: #f5f5f5;
  }
  
  &::placeholder {
    color: #999;
  }
`;

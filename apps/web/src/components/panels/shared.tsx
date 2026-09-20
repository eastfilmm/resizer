'use client';

import styled from 'styled-components';
import {
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_GRAY_TEXT,
  COLOR_GRAY_BORDER,
  COLOR_GRAY_PLACEHOLDER,
  COLOR_GRAY_BG_DISABLED,
} from '@/constants/theme';

// Panel Container
export const PanelContainer = styled.div<{ $direction?: 'column' | 'row' }>`
  display: flex;
  flex-direction: ${(props) => props.$direction || 'column'};
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
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

export const PanelLabelWrapper = styled.div<{
  $textAlign: 'center' | 'left' | 'right';
}>`
  text-align: ${(props) => props.$textAlign || 'left'};
  max-width: 360px;
  width: 100%;
`;
// Label text
export const PanelLabel = styled.span<{ $isDimmed?: boolean }>`
  font-size: 0.875rem;
  color: ${(props) => (props.$isDimmed ? '#ffffff' : COLOR_GRAY_TEXT)};
  transition: color 0.2s ease;
`;

// Toggle Switch
export const ToggleSwitch = styled.div<{ $isActive: boolean }>`
  position: relative;
  width: 48px;
  height: 24px;
  background-color: ${(props) => (props.$isActive ? COLOR_PRIMARY : COLOR_GRAY_BORDER)};
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$isActive ? '26px' : '2px')};
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
export const SliderLabel = styled.span<{ $isDimmed?: boolean }>`
  font-size: 0.875rem;
  color: ${(props) => (props.$isDimmed ? '#ffffff' : COLOR_GRAY_TEXT)};
  transition: color 0.2s ease;
  min-width: 52px;
  flex-shrink: 0;
`;

// Slider Value
export const SliderValue = styled.span<{ $isDimmed?: boolean }>`
  font-size: 0.875rem;
  color: ${(props) => (props.$isDimmed ? '#ffffff' : COLOR_GRAY_TEXT)};
  transition: color 0.2s ease;
  min-width: 40px;
  text-align: right;
  flex-shrink: 0;
`;

// Text Input
export const TextInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 0.775rem;
  border: 1px solid ${COLOR_GRAY_BORDER};
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${COLOR_PRIMARY};
  }

  &:disabled {
    opacity: 0.5;
    background-color: ${COLOR_GRAY_BG_DISABLED};
  }

  &::placeholder {
    color: ${COLOR_GRAY_PLACEHOLDER};
  }
`;

export const TitleAndInputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SlidersWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

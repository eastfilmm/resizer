'use client';

import styled from 'styled-components';
import { memo, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { polaroidModeAtom } from '@/atoms/imageAtoms';
import {
  PanelContainer,
  PanelLabel,
  PanelLabelWrapper,
} from './shared';

export const PolaroidPanel = memo(() => {
  const polaroidMode = useAtomValue(polaroidModeAtom);
  const setPolaroidMode = useSetAtom(polaroidModeAtom);

  const handlePolaroidToggle = useCallback(() => {
    setPolaroidMode(!polaroidMode);
  }, [polaroidMode, setPolaroidMode]);

  return (
    <PanelContainer>
      {/* Polaroid Mode Section */}
      <PanelLabelWrapper $textAlign="left">
        <PanelLabel>Polaroid Frame</PanelLabel>
      </PanelLabelWrapper>
      <PolaroidButton
        $isActive={polaroidMode}
        onClick={handlePolaroidToggle}
        style={{ width: '100%' }}
      >
        <PolaroidIcon $isActive={polaroidMode} />
        Polaroid
      </PolaroidButton>
    </PanelContainer>
  );
});

PolaroidPanel.displayName = 'PolaroidPanel';

const PolaroidIcon = styled.div<{ $isActive: boolean }>`
  width: 18px;
  height: 16px;
  background: white;
  border: 2px solid ${props => props.$isActive ? '#007bff' : '#999'};
  border-radius: 2px;
  position: relative;
  padding-bottom: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    height: 8px;
    background: ${props => props.$isActive ? '#007bff' : '#ddd'};
    border-radius: 1px;
  }
`;

const PolaroidButton = styled.button<{ $isActive: boolean }>`
  height: 42px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid ${props => props.$isActive ? '#007bff' : '#ddd'};
  border-radius: 8px;
  background-color: ${props => props.$isActive ? '#e7f3ff' : 'white'};
  color: ${props => props.$isActive ? '#007bff' : '#666'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    background-color: ${props => props.$isActive ? '#e7f3ff' : '#f8f9fa'};
  }

  &:active {
    transform: scale(0.98);
  }
`;
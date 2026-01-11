'use client';

import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { backgroundColorAtom } from '@/atoms/imageAtoms';

export default function CanvasBackgroundSelector() {
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const setBackgroundColor = useSetAtom(backgroundColorAtom);

  const toggleBackgroundColor = () => {
    setBackgroundColor(backgroundColor === 'white' ? 'black' : 'white');
  };

  return (
    <SelectorContainer>
      <Label>Background Color</Label>
      <ToggleSwitch 
        $isActive={backgroundColor === 'black'} 
        onClick={toggleBackgroundColor}
      />
    </SelectorContainer>
  );
}

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;

const ToggleSwitch = styled.div<{ $isActive: boolean }>`
  position: relative;
  width: 48px;
  height: 24px;
  background-color: ${props => props.$isActive ? '#007bff' : '#ccc'};
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

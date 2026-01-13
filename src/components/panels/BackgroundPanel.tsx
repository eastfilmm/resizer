'use client';

import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { backgroundColorAtom } from '@/atoms/imageAtoms';

export const BackgroundPanel = () => {
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const setBackgroundColor = useSetAtom(backgroundColorAtom);

  const toggleBackgroundColor = () => {
    setBackgroundColor(backgroundColor === 'white' ? 'black' : 'white');
  };

  return (
    <Container>
        <Label>Background Color</Label>
        <ToggleSwitch 
          $isActive={backgroundColor === 'black'} 
          onClick={toggleBackgroundColor}
        />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  max-width: 360px;
  width: 100%;

`;

const Label = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const ToggleSwitch = styled.div<{ $isActive: boolean }>`
  position: relative;
  width: 48px;
  height: 24px;
  background-color: ${props => props.$isActive ? '#000000' : '#6c757d'};
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

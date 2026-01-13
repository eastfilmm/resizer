'use client';

import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { copyrightEnabledAtom, copyrightTextAtom } from '@/atoms/imageAtoms';

const COPYRIGHT_STORAGE_KEY = 'resizer-copyright-text';

export const CopyrightPanel = () => {
  const copyrightEnabled = useAtomValue(copyrightEnabledAtom);
  const setCopyrightEnabled = useSetAtom(copyrightEnabledAtom);
  const copyrightText = useAtomValue(copyrightTextAtom);
  const setCopyrightText = useSetAtom(copyrightTextAtom);

  // 로컬스토리지에서 저장된 값 불러오기
  useEffect(() => {
    const savedText = localStorage.getItem(COPYRIGHT_STORAGE_KEY);
    if (savedText) {
      setCopyrightText(savedText);
    }
  }, [setCopyrightText]);

  const toggleCopyright = () => {
    setCopyrightEnabled(!copyrightEnabled);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCopyrightText(e.target.value);
  };

  return (
    <Container>
      <Row>
        <Label>Copyright</Label>
        <ToggleSwitch $isActive={copyrightEnabled} onClick={toggleCopyright} />
      </Row>
      
      <Input
        type="text"
        placeholder="© Your Name"
        value={copyrightText}
        onChange={handleTextChange}
        disabled={!copyrightEnabled}
      />
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

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 0.875rem;
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

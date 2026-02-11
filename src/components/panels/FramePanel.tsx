'use client';

import styled from 'styled-components';
import { memo, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { polaroidModeAtom, thinFrameModeAtom, mediumFilmFrameModeAtom, paddingAtom, polaroidDateAtom } from '@/atoms/imageAtoms';
import {
  PanelContainer,
  PanelLabel,
  PanelLabelWrapper,
  TextInput,
} from './shared';

const FRAME_DEFAULT_PADDING = 80;

export const FramePanel = memo(() => {
  const polaroidMode = useAtomValue(polaroidModeAtom);
  const setPolaroidMode = useSetAtom(polaroidModeAtom);
  const thinFrameMode = useAtomValue(thinFrameModeAtom);
  const setThinFrameMode = useSetAtom(thinFrameModeAtom);
  const mediumFilmFrameMode = useAtomValue(mediumFilmFrameModeAtom);
  const setMediumFilmFrameMode = useSetAtom(mediumFilmFrameModeAtom);
  const setPadding = useSetAtom(paddingAtom);
  const polaroidDate = useAtomValue(polaroidDateAtom);
  const setPolaroidDate = useSetAtom(polaroidDateAtom);

  const handlePolaroidToggle = useCallback(() => {
    const newPolaroidMode = !polaroidMode;
    setPolaroidMode(newPolaroidMode);
    
    // Polaroid 켤 때: Thin Frame, Medium Film 끄고, padding 80px
    // Polaroid 끌 때: padding 0으로 초기화
    if (newPolaroidMode) {
      setThinFrameMode(false);
      setMediumFilmFrameMode(false);
      setPadding(FRAME_DEFAULT_PADDING);
    } else {
      setPadding(0);
    }
  }, [polaroidMode, setPolaroidMode, setThinFrameMode, setMediumFilmFrameMode, setPadding]);

  const handleThinFrameToggle = useCallback(() => {
    const newThinFrameMode = !thinFrameMode;
    setThinFrameMode(newThinFrameMode);
    
    // Thin Frame 켤 때: Polaroid, Medium Film 끄고, date 초기화, padding 80px
    // Thin Frame 끌 때: padding 0으로 초기화
    if (newThinFrameMode) {
      setPolaroidMode(false);
      setMediumFilmFrameMode(false);
      setPolaroidDate('');
      setPadding(FRAME_DEFAULT_PADDING);
    } else {
      setPadding(0);
    }
  }, [thinFrameMode, setThinFrameMode, setPolaroidMode, setMediumFilmFrameMode, setPolaroidDate, setPadding]);

  const handleMediumFilmFrameToggle = useCallback(() => {
    const newMediumFilmFrameMode = !mediumFilmFrameMode;
    setMediumFilmFrameMode(newMediumFilmFrameMode);
    
    // Medium Film 켤 때: Polaroid, Thin Frame 끄고, date 초기화, padding 80px
    // Medium Film 끌 때: padding 0으로 초기화
    if (newMediumFilmFrameMode) {
      setPolaroidMode(false);
      setThinFrameMode(false);
      setPolaroidDate('');
      setPadding(FRAME_DEFAULT_PADDING);
    } else {
      setPadding(0);
    }
  }, [mediumFilmFrameMode, setMediumFilmFrameMode, setPolaroidMode, setThinFrameMode, setPolaroidDate, setPadding]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPolaroidDate(e.target.value);
  }, [setPolaroidDate]);

  const handleDateClear = useCallback(() => {
    setPolaroidDate('');
  }, [setPolaroidDate]);

  return (
    <PanelContainer>
      {/* Frame Type Section */}
      <PanelLabelWrapper $textAlign="left">
        <PanelLabel>Frame Type</PanelLabel>
      </PanelLabelWrapper>
      <FrameOptions>
        <FrameButton
          $isActive={polaroidMode}
          onClick={handlePolaroidToggle}
        >
          <PolaroidIcon $isActive={polaroidMode} />
          Polaroid
        </FrameButton>
        <FrameButton
          $isActive={thinFrameMode}
          onClick={handleThinFrameToggle}
        >
          <ThinFrameIcon $isActive={thinFrameMode} />
          Thin
        </FrameButton>
        <FrameButton
          $isActive={mediumFilmFrameMode}
          onClick={handleMediumFilmFrameToggle}
        >
          <MediumFilmIcon $isActive={mediumFilmFrameMode} />
          Film
        </FrameButton>
      </FrameOptions>
      
      {/* Date Input Section */}
      <DateInputSection>
        <PanelLabelWrapper $textAlign="left">
          <PanelLabel>Date</PanelLabel>
        </PanelLabelWrapper>
        <DateInputWrapper>
          <DateInput
            type="text"
            value={polaroidDate}
            onChange={handleDateChange}
            placeholder="e.g. 2024.01.01"
            disabled={!polaroidMode}
          />
          {polaroidDate && polaroidMode && (
            <ClearButton onClick={handleDateClear} type="button">
              ×
            </ClearButton>
          )}
        </DateInputWrapper>
      </DateInputSection>
    </PanelContainer>
  );
});

FramePanel.displayName = 'FramePanel';

const FrameOptions = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const FrameButton = styled.button<{ $isActive: boolean }>`
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

const ThinFrameIcon = styled.div<{ $isActive: boolean }>`
  width: 18px;
  height: 16px;
  background: white;
  border: 2px solid ${props => props.$isActive ? '#007bff' : '#999'};
  border-radius: 1px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border: 1px solid ${props => props.$isActive ? '#007bff' : '#333'};
  }
`;

const MediumFilmIcon = styled.div<{ $isActive: boolean }>`
  width: 18px;
  height: 16px;
  background: #000;
  border: 2px solid ${props => props.$isActive ? '#007bff' : '#999'};
  border-radius: 1px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s ease;
  
  /* Top film info bar */
  &::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    height: 3px;
    background: #000;
    border-bottom: 1px solid ${props => props.$isActive ? '#ff6b00' : '#ff8c00'};
  }
  
  /* Image area */
  &::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background: white;
  }
`;

const DateInputSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateInputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const DateInput = styled(TextInput)`
  width: 100%;
  padding-right: 36px;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
  border: none;
  border-radius: 50%;
  color: #666;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ccc;
    color: #333;
  }
`;

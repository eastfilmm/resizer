'use client';

import styled from 'styled-components';
import { memo, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  frameTypeAtom,
  paddingAtom,
  polaroidDateAtom,
  backgroundColorAtom,
} from '@/atoms/imageAtoms';
import type { FrameType } from '@/atoms/imageAtoms';
import {
  PanelContainer,
  PanelLabel,
  PanelLabelWrapper,
  TextInput,
  TitleAndInputWrapper,
} from './shared';

const FRAME_DEFAULT_PADDING = 80;

export const FramePanel = memo(() => {
  const frameType = useAtomValue(frameTypeAtom);
  const setFrameType = useSetAtom(frameTypeAtom);
  const setPadding = useSetAtom(paddingAtom);
  const polaroidDate = useAtomValue(polaroidDateAtom);
  const setPolaroidDate = useSetAtom(polaroidDateAtom);
  const setBackgroundColor = useSetAtom(backgroundColorAtom);

  const handleFrameToggle = useCallback((type: FrameType) => {
    if (frameType === type) {
      // 이미 활성화된 프레임을 다시 누르면 끔
      setFrameType('none');
      setPadding(0);
    } else {
      // 새 프레임 활성화 (상호배제 자동)
      setFrameType(type);
      setPadding(FRAME_DEFAULT_PADDING);

      // Polaroid가 아닌 프레임은 date 초기화 & 배경 white 고정
      if (type !== 'polaroid') {
        setPolaroidDate('');
        setBackgroundColor('white');
      }
    }
  }, [frameType, setFrameType, setPadding, setPolaroidDate, setBackgroundColor]);

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPolaroidDate(e.target.value);
    },
    [setPolaroidDate],
  );

  const handleDateClear = useCallback(() => {
    setPolaroidDate('');
  }, [setPolaroidDate]);

  return (
    <PanelContainer>
      {/* Frame Type Section */}
      <TitleAndInputWrapper>
        <PanelLabelWrapper $textAlign="left">
          <PanelLabel>Frame</PanelLabel>
        </PanelLabelWrapper>
        <FrameOptions>
          <FrameButton $isActive={frameType === 'polaroid'} onClick={() => handleFrameToggle('polaroid')}>
            Polaroid
          </FrameButton>
          <FrameButton $isActive={frameType === 'thin'} onClick={() => handleFrameToggle('thin')}>
            Thin
          </FrameButton>
          <FrameButton $isActive={frameType === 'mediumFilm'} onClick={() => handleFrameToggle('mediumFilm')}>
            Film
          </FrameButton>
        </FrameOptions>
      </TitleAndInputWrapper>

      {/* Date Input Section */}
      <TitleAndInputWrapper>
        <PanelLabelWrapper $textAlign="left">
          <PanelLabel>Date</PanelLabel>
        </PanelLabelWrapper>
        <DateInputWrapper>
          <DateInput
            type="text"
            value={polaroidDate}
            onChange={handleDateChange}
            placeholder="e.g. 2024.01.01"
            disabled={frameType !== 'polaroid'}
          />
          {polaroidDate && frameType === 'polaroid' && (
            <ClearButton onClick={handleDateClear} type="button">
              ×
            </ClearButton>
          )}
        </DateInputWrapper>
      </TitleAndInputWrapper>
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
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid ${(props) => (props.$isActive ? '#007bff' : '#ddd')};
  border-radius: 8px;
  background-color: ${(props) => (props.$isActive ? '#e7f3ff' : 'white')};
  color: ${(props) => (props.$isActive ? '#007bff' : '#666')};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    background-color: ${(props) => (props.$isActive ? '#e7f3ff' : '#f8f9fa')};
  }

  &:active {
    transform: scale(0.98);
  }
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

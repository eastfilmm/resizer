'use client';

import styled from 'styled-components';
import { memo, useCallback } from 'react';
import { COLOR_PRIMARY, COLOR_PRIMARY_BG, COLOR_GRAY_TEXT, COLOR_GRAY_BORDER, COLOR_GRAY_BG } from '@/constants/theme';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  frameTypeAtom,
  paddingAtom,
  polaroidDateAtom,
  backgroundColorAtom,
  prevBackgroundColorAtom,
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
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const setBackgroundColor = useSetAtom(backgroundColorAtom);
  const prevBackgroundColor = useAtomValue(prevBackgroundColorAtom);
  const setPrevBackgroundColor = useSetAtom(prevBackgroundColorAtom);

  const handleFrameToggle = useCallback((type: FrameType) => {
    if (frameType === type) {
      // 이미 활성화된 프레임을 다시 누르면 끔
      setFrameType('none');
      setPadding(0);
      
      // 'thin'이나 'mediumFilm' 기능에서 해제될 때 이전 색상 복원
      if (type !== 'polaroid' && prevBackgroundColor) {
        setBackgroundColor(prevBackgroundColor);
        setPrevBackgroundColor(null);
      }
    } else {
      // 새 프레임 활성화 (상호배제 자동)
      setFrameType(type);
      setPadding(FRAME_DEFAULT_PADDING);

      // Polaroid가 아닌 프레임은 date 초기화 & 배경 white 고정
      if (type !== 'polaroid') {
        setPolaroidDate('');
        
        // 현재 배경색이 흰색이 아닐 때만 저장
        if (backgroundColor !== 'white') {
          setPrevBackgroundColor(backgroundColor);
        }
        setBackgroundColor('white');
      } else {
        // Polaroid 프레임을 선택할 때는 배경색을 강제하지 않으므로 변경하지 않음 (Thin/Film -> Polaroid 전환 시 복원)
        if (frameType !== 'none' && frameType !== 'polaroid' && prevBackgroundColor) {
          setBackgroundColor(prevBackgroundColor);
          setPrevBackgroundColor(null);
        }
      }
    }
  }, [
    frameType, 
    setFrameType, 
    setPadding, 
    setPolaroidDate, 
    backgroundColor,
    setBackgroundColor,
    prevBackgroundColor,
    setPrevBackgroundColor
  ]);

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

      {/* Date Input Section - visible only when polaroid is selected */}
      <DateSection $isOpen={frameType === 'polaroid'}>
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
            />
            {polaroidDate && (
              <ClearButton onClick={handleDateClear} type="button">
                ×
              </ClearButton>
            )}
          </DateInputWrapper>
        </TitleAndInputWrapper>
      </DateSection>
    </PanelContainer>
  );
});

FramePanel.displayName = 'FramePanel';

const DateSection = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  overflow: hidden;
  height: ${props => props.$isOpen ? '66px' : '0'};
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;
`;

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
  border: 1px solid ${(props) => (props.$isActive ? COLOR_PRIMARY : COLOR_GRAY_BORDER)};
  border-radius: 8px;
  background-color: ${(props) => (props.$isActive ? COLOR_PRIMARY_BG : 'white')};
  color: ${(props) => (props.$isActive ? COLOR_PRIMARY : COLOR_GRAY_TEXT)};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${COLOR_PRIMARY};
    background-color: ${(props) => (props.$isActive ? COLOR_PRIMARY_BG : COLOR_GRAY_BG)};
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
  background: ${COLOR_GRAY_BORDER};
  border: none;
  border-radius: 50%;
  color: ${COLOR_GRAY_TEXT};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ccc;
    color: #333;
  }
`;

'use client';

import { COLOR_PRIMARY, COLOR_PRIMARY_BG, COLOR_GRAY_TEXT, COLOR_GRAY_BORDER, COLOR_GRAY_BG, PanelContainer, PanelLabel, PanelLabelWrapper, TextInput, TitleAndInputWrapper, useClickClearedHover, Collapsible } from '@resizer/ui';
import styled from 'styled-components';
import { memo, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { frameTypeAtom, polaroidDateAtom, selectedImageAtom } from '../../atoms/imageAtoms';
import type { FrameType } from '../../atoms/imageAtoms';
import { useFrameToggle } from '../../hooks/useFrameToggle';
import { resolvePolaroidDate } from '../../utils/imageUtils';

export const FramePanel = memo(() => {
  const frameType = useAtomValue(frameTypeAtom);
  const inputDate = useAtomValue(polaroidDateAtom);
  const setPolaroidDate = useSetAtom(polaroidDateAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  // 직접 입력하지 않았으면 선택된 사진의 촬영일을 보여준다.
  const polaroidDate = resolvePolaroidDate({ polaroidDate: inputDate }, selectedImage);
  const toggleFrame = useFrameToggle();

  const { hoveredKey, hoverProps, containerProps, clearHover } =
    useClickClearedHover<FrameType>();

  const handleFrameToggle = useCallback(
    (type: FrameType) => {
      // 클릭으로 해제할 때 hover 잔상(파란 보더)이 남지 않도록 비운다.
      clearHover();
      toggleFrame(type);
    },
    [clearHover, toggleFrame],
  );

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
    <PanelContainer $direction="column" style={{ gap: 0 }}>
      {/* Frame Type Section */}
      <TitleAndInputWrapper>
        <PanelLabelWrapper $textAlign="left">
          <PanelLabel>Frame</PanelLabel>
        </PanelLabelWrapper>
        <FrameOptions {...containerProps}>
          <FrameButton
            $isActive={frameType === 'polaroid'}
            $isHovered={hoveredKey === 'polaroid'}
            {...hoverProps('polaroid')}
            onClick={() => handleFrameToggle('polaroid')}
          >
            Polaroid
          </FrameButton>
          <FrameButton
            $isActive={frameType === 'thin'}
            $isHovered={hoveredKey === 'thin'}
            {...hoverProps('thin')}
            onClick={() => handleFrameToggle('thin')}
          >
            Thin
          </FrameButton>
          <FrameButton
            $isActive={frameType === 'mediumFilm'}
            $isHovered={hoveredKey === 'mediumFilm'}
            {...hoverProps('mediumFilm')}
            onClick={() => handleFrameToggle('mediumFilm')}
          >
            Film
          </FrameButton>
        </FrameOptions>
      </TitleAndInputWrapper>

      {/* Date Input Section - visible only when polaroid is selected */}
      <Collapsible isOpen={frameType === 'polaroid'}>
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
      </Collapsible>
    </PanelContainer>
  );
});

FramePanel.displayName = 'FramePanel';

const FrameOptions = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const FrameButton = styled.button<{ $isActive: boolean; $isHovered: boolean }>`
  height: 42px;
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid
    ${(props) =>
      props.$isActive || props.$isHovered ? COLOR_PRIMARY : COLOR_GRAY_BORDER};
  border-radius: 8px;
  background-color: ${(props) =>
      props.$isActive
        ? COLOR_PRIMARY_BG
        : props.$isHovered
          ? COLOR_GRAY_BG
          : 'white'};
  color: ${(props) => (props.$isActive ? COLOR_PRIMARY : COLOR_GRAY_TEXT)};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;


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

'use client';

import { COLOR_PRIMARY, COLOR_PRIMARY_BG, COLOR_GRAY_TEXT, COLOR_GRAY_BORDER, COLOR_GRAY_BG, COLOR_GRAY_PLACEHOLDER, PanelContainer, PanelLabel, PanelLabelWrapper, PanelRow, TextInput, TitleAndInputWrapper, ToggleSwitch, useClickClearedHover, Collapsible } from '@resizer/ui';
import styled from 'styled-components';
import { memo, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { imageSettingsAtom, polaroidDateAtom, selectedImageAtom } from '../../atoms/imageAtoms';
import type { SelectableFrameType } from '../../atoms/imageAtoms';
import { useFrameToggle } from '../../hooks/useFrameToggle';
import { resolvePolaroidDate } from '../../utils/imageUtils';

const FRAME_OPTIONS: { type: SelectableFrameType; label: string }[] = [
  { type: 'polaroid', label: 'Polaroid' },
  { type: 'thin', label: 'Thin' },
  { type: 'mediumFilm', label: 'Film' },
];

export const FramePanel = memo(() => {
  const { frameType, lastFrameType } = useAtomValue(imageSettingsAtom);
  const isFrameOn = frameType !== 'none';
  const inputDate = useAtomValue(polaroidDateAtom);
  const setPolaroidDate = useSetAtom(polaroidDateAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  // 직접 입력하지 않았으면 선택된 사진의 촬영일을 보여준다.
  const polaroidDate = resolvePolaroidDate({ polaroidDate: inputDate }, selectedImage);
  const { selectFrame, setFrameEnabled } = useFrameToggle();

  const { hoveredKey, hoverProps, containerProps, clearHover } =
    useClickClearedHover<SelectableFrameType>();

  const handleFrameSelect = useCallback(
    (type: SelectableFrameType) => {
      // 클릭 직후 hover 잔상(파란 보더)이 남지 않도록 비운다.
      clearHover();
      // 꺼진 상태에서 누르면 그 프레임으로 켜진다 (슬라이더의 자동 ON과 같은 방식)
      selectFrame(type);
    },
    [clearHover, selectFrame],
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
        <PanelRow>
          <PanelLabel>Frame</PanelLabel>
          <ToggleSwitch
            role="switch"
            aria-label="Frame"
            aria-checked={isFrameOn}
            $isActive={isFrameOn}
            onClick={() => setFrameEnabled(!isFrameOn)}
          />
        </PanelRow>
        <FrameOptions {...containerProps}>
          {FRAME_OPTIONS.map(({ type, label }) => (
            <FrameButton
              key={type}
              $isActive={frameType === type}
              // 꺼져 있으면 스위치를 켤 때 쓸 프레임을 회색으로 표시해 둔다
              $isInactive={!isFrameOn && lastFrameType === type}
              $isHovered={hoveredKey === type}
              {...hoverProps(type)}
              onClick={() => handleFrameSelect(type)}
            >
              {label}
            </FrameButton>
          ))}
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

const FrameButton = styled.button<{
  $isActive: boolean;
  $isInactive: boolean;
  $isHovered: boolean;
}>`
  height: 42px;
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  /* 켜짐: 파랑 / 꺼졌지만 다시 켤 프레임: 회색 / 나머지: 기본 */
  border: 1px solid
    ${(props) =>
      props.$isActive || props.$isHovered
        ? COLOR_PRIMARY
        : props.$isInactive
          ? COLOR_GRAY_PLACEHOLDER
          : COLOR_GRAY_BORDER};
  border-radius: 8px;
  background-color: ${(props) =>
      props.$isActive
        ? COLOR_PRIMARY_BG
        : props.$isHovered || props.$isInactive
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

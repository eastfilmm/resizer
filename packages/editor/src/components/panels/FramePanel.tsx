'use client';

import { COLOR_PRIMARY, COLOR_PRIMARY_BG, COLOR_GRAY_TEXT, COLOR_GRAY_BORDER, COLOR_GRAY_BG, PanelContainer, PanelLabel, PanelLabelWrapper, TextInput, TitleAndInputWrapper, useClickClearedHover, PANEL_HEIGHT_MS, PANEL_EASING } from '@resizer/ui';
import styled from 'styled-components';
import { memo, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  frameTypeAtom,
  paddingAtom,
  polaroidDateAtom,
  backgroundColorAtom,
  prevBackgroundColorAtom,
} from '../../atoms/imageAtoms';
import type { FrameType } from '../../atoms/imageAtoms';
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

  const { hoveredKey, hoverProps, containerProps, clearHover } =
    useClickClearedHover<FrameType>();

  const handleFrameToggle = useCallback(
    (type: FrameType) => {
      // 클릭으로 해제할 때 hover 잔상(파란 보더)이 남지 않도록 비운다.
      clearHover();

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
          if (
            frameType !== 'none' &&
            frameType !== 'polaroid' &&
            prevBackgroundColor
          ) {
            setBackgroundColor(prevBackgroundColor);
            setPrevBackgroundColor(null);
          }
        }
      }
    },
    [
      clearHover,
      frameType,
      setFrameType,
      setPadding,
      setPolaroidDate,
      backgroundColor,
      setBackgroundColor,
      prevBackgroundColor,
      setPrevBackgroundColor,
    ],
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

/**
 * 날짜 입력란. 높이를 84px로 박아두면 iOS처럼 입력 필드가 몇 px 더 큰
 * 환경에서 하단이 잘린다. 바깥 패널과 같은 방식으로 내용이 높이를 정하게 한다.
 *
 * opacity는 height와 같은 속도로 맞춘다. 더 빨리 끝내면 컨테이너가 절반만
 * 열린 시점에 입력란이 이미 또렷해져 두 동작이 따로 노는 것처럼 보인다.
 */
const DateSection = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  display: grid;
  grid-template-rows: ${(props) => (props.$isOpen ? '1fr' : '0fr')};
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transition:
    grid-template-rows ${PANEL_HEIGHT_MS}ms ${PANEL_EASING},
    opacity ${PANEL_HEIGHT_MS}ms ${PANEL_EASING};

  > * {
    min-height: 0;
    overflow: hidden;
    padding-top: 16px;
  }
`;

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

'use client';

import styled from 'styled-components';
import { memo, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { paddingAtom, polaroidModeAtom } from '@/atoms/imageAtoms';
import { useAspectRatio } from '@/hooks/useAspectRatio';
import {
  PanelContainer,
  PanelLabel,
  PanelLabelWrapper,
  SliderSection,
  SliderLabelRow,
  SliderValue,
  Slider,
} from './shared';

const AspectRatioOptions = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const AspectRatioButton = styled.button<{ $isActive: boolean }>`
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

const RatioIcon = styled.div<{ $ratio: '1:1' | '4:5' | '9:16'; $isActive: boolean }>`
  width: ${props => props.$ratio === '1:1' ? '20px' : props.$ratio === '4:5' ? '16px' : '11px'};
  height: 20px;
  border: 2px solid ${props => props.$isActive ? '#007bff' : '#999'};
  border-radius: 3px;
  transition: border-color 0.2s ease;
`;

export const LayoutPanel = memo(() => {
  const padding = useAtomValue(paddingAtom);
  const setPadding = useSetAtom(paddingAtom);
  const { aspectRatio, updateAspectRatio } = useAspectRatio();
  const polaroidMode = useAtomValue(polaroidModeAtom);

  const handleAspectRatioChange = useCallback(
    (ratio: '1:1' | '4:5' | '9:16') => {
      if (aspectRatio !== ratio) {
        updateAspectRatio(ratio);
        setPadding(0); // 비율 변경 시 패딩 0으로 초기화
      }
    },
    [aspectRatio, updateAspectRatio, setPadding]
  );

  const handlePaddingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPadding(Number(e.target.value));
    },
    [setPadding]
  );

  return (
    <PanelContainer>
      {/* Aspect Ratio Section */}
      <PanelLabelWrapper $textAlign="left">
        <PanelLabel>Canvas Ratio</PanelLabel>
      </PanelLabelWrapper>
      <AspectRatioOptions>
        <AspectRatioButton
          $isActive={aspectRatio === '1:1'}
          onClick={() => handleAspectRatioChange('1:1')}
        >
          <RatioIcon $ratio="1:1" $isActive={aspectRatio === '1:1'} />
          1:1
        </AspectRatioButton>
        <AspectRatioButton
          $isActive={aspectRatio === '4:5'}
          onClick={() => handleAspectRatioChange('4:5')}
        >
          <RatioIcon $ratio="4:5" $isActive={aspectRatio === '4:5'} />
          4:5
        </AspectRatioButton>
        <AspectRatioButton
          $isActive={aspectRatio === '9:16'}
          onClick={() => handleAspectRatioChange('9:16')}
        >
          <RatioIcon $ratio="9:16" $isActive={aspectRatio === '9:16'} />
          9:16
        </AspectRatioButton>
      </AspectRatioOptions>

      {/* Padding Section */}
      <SliderSection>
        <SliderLabelRow>
          <PanelLabel $isDimmed={polaroidMode}>Padding</PanelLabel>
          <SliderValue style={{ width: '36px' }} $isDimmed={polaroidMode}>{padding}px</SliderValue>
        </SliderLabelRow>
        <Slider
          type="range"
          min="0"
          max="200"
          value={padding}
          onChange={handlePaddingChange}
          disabled={polaroidMode}
        />
      </SliderSection>
    </PanelContainer>
  );
});

LayoutPanel.displayName = 'LayoutPanel';

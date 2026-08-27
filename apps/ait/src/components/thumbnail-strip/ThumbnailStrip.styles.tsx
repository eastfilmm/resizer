import styled from 'styled-components';
import { THUMBNAIL_SLOT_SIZE } from './constants';
import { COLOR_PRIMARY, COLOR_GRAY_BG, COLOR_GRAY_PLACEHOLDER } from '@/constants/theme';

export const Container = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    max-width: 600px;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 11px;
  color: #5f6368;
`;

export const CountLabel = styled.span`
  font-weight: 600;
  color: #1f2933;
`;

export const HintText = styled.span`
  text-align: right;
`;

export const ThumbnailList = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
`;

export const ThumbnailButton = styled.button<{ $isSelected: boolean }>`
  border: 1px solid
    ${({ $isSelected }) => ($isSelected ? COLOR_PRIMARY : '#d8dde3')};
  background: ${({ $isSelected }) => ($isSelected ? '#eef6ff' : '#ffffff')};
  border-radius: 4px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
  width: ${THUMBNAIL_SLOT_SIZE}px;
  height: ${THUMBNAIL_SLOT_SIZE}px;
  flex: 0 0 ${THUMBNAIL_SLOT_SIZE}px;
  overflow: hidden;

  &:hover {
    border-color: ${COLOR_PRIMARY};
  }
`;

export const AddButton = styled.button`
  border: 1px dashed #d8dde3;
  background: ${COLOR_GRAY_BG};
  border-radius: 4px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  width: ${THUMBNAIL_SLOT_SIZE}px;
  height: ${THUMBNAIL_SLOT_SIZE}px;
  flex: 0 0 ${THUMBNAIL_SLOT_SIZE}px;
  font-size: 24px;
  color: ${COLOR_GRAY_PLACEHOLDER};

  &:hover {
    border-color: ${COLOR_PRIMARY};
    color: ${COLOR_PRIMARY};
    background: #eef6ff;
  }
`;

export const ThumbnailCanvas = styled.canvas`
  display: block;
  background: #ffffff;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
`;

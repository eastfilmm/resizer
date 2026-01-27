'use client';

import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

export const PanelContainer = styled.div<{ $height: number }>`
  background-color: #ffffff;
  overflow: hidden;
  height: ${props => props.$height}px;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${props => props.$height > 0 ? '0 -2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
`;

export const PanelContentWrapper = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.15s ease;
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
`;

export const NavContainer = styled.div`
  height: 74px;
  background-color: #e0e0e0;
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
`;

export const SliderBackground = styled.div<{ $activeIndex: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20%;
  background-color: #ffffff;
  transition: left 0.3s ease, opacity 0.3s ease;
  left: ${props => props.$activeIndex >= 0 ? `${props.$activeIndex * 20}%` : '0'};
  opacity: ${props => props.$activeIndex >= 0 ? 1 : 0};
  pointer-events: none;
  border-radius: 0 0 4px 4px;
`;

export const NavButtonsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`;

export const NavButtonStyled = styled.button<{ $isActive: boolean; $isEnabled: boolean; $isClickable: boolean }>`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  position: relative;
  gap: 4px;
  pointer-events: ${props => props.$isClickable ? 'auto' : 'none'};

  &::after {
    content: '';
    position: absolute;
    bottom: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => props.$isEnabled ? '#007bff' : 'transparent'};
    transition: background-color 0.2s ease;
  }

  &:hover {
    background-color: ${props => (props.$isActive || !props.$isClickable) ? 'transparent' : 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    background-color: ${props => (props.$isActive || !props.$isClickable) ? 'transparent' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

export const ButtonLabel = styled.span<{ $isActive: boolean; $isDimmed: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: ${props => {
    if (props.$isDimmed) return '#ffffff';
    return props.$isActive ? '#007bff' : '#666666';
  }};
  white-space: nowrap;
  transition: color 0.3s ease;
`;

export const NavIcon = styled.img<{ $isActive: boolean; $isDimmed: boolean }>`
  width: 24px;
  height: 24px;
  transition: filter 0.3s ease, opacity 0.3s ease;
  opacity: ${props => {
    if (props.$isDimmed) return 1;
    return props.$isActive ? 1 : 0.6;
  }};
  filter: ${props => {
    if (props.$isDimmed) return 'brightness(0) invert(1)'; // Make it white
    return props.$isActive
      ? 'invert(32%) sepia(98%) saturate(1234%) hue-rotate(200deg) brightness(97%) contrast(101%)'
      : 'none';
  }};
`;

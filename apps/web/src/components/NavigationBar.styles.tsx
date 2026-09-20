'use client';

import {
  COLOR_PRIMARY,
  COLOR_GRAY_TEXT,
  PANEL_HEIGHT_MS,
  PANEL_FADE_MS,
  NAV_INDICATOR_MS,
  PANEL_EASING,
} from '@resizer/ui';
import styled from 'styled-components';
export const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

/**
 * 패널 높이는 내용이 정한다.
 *
 * 예전에는 PANEL_HEIGHTS에 패널별 높이를 px로 박아두고 내용 높이와 손으로
 * 맞췄는데, 여유가 6~10px밖에 없어서 플랫폼마다 폰트·입력 필드 렌더링이
 * 조금만 달라져도 내용이 잘렸다(iOS에서 날짜 입력란 하단이 날아가던 문제).
 *
 * grid-template-rows를 0fr <-> 1fr로 전환하면 하드코딩 없이 auto 높이
 * 애니메이션이 된다. 내용이 얼마나 필요하든 브라우저가 계산하므로 넘칠 수 없다.
 */
export const PanelContainer = styled.div<{ $isOpen: boolean }>`
  background: #ffffff;
  display: grid;
  grid-template-rows: ${props => (props.$isOpen ? '1fr' : '0fr')};
  transition: grid-template-rows ${PANEL_HEIGHT_MS}ms ${PANEL_EASING};
  box-shadow: ${props => props.$isOpen ? '0 -2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
`;

export const PanelContentWrapper = styled.div<{ $isVisible: boolean }>`
  /* grid 항목은 기본 min-height가 auto라 0fr로 줄어들지 않는다. */
  min-height: 0;
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity ${PANEL_FADE_MS}ms ease;
  will-change: opacity;
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
`;

export const NavContainer = styled.div`
  height: 64px;
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
  left: 0;
  transition: transform ${NAV_INDICATOR_MS}ms ease, opacity ${NAV_INDICATOR_MS}ms ease;
  transform: translateX(${props => (props.$activeIndex >= 0 ? props.$activeIndex : 0) * 100}%);
  opacity: ${props => props.$activeIndex >= 0 ? 1 : 0};
  pointer-events: none;
`;

export const NavButtonsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`;

export const NavButtonStyled = styled.button<{ $isActive: boolean; $isEnabled: boolean; $isClickable: boolean; $isHovered: boolean }>`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  /* CSS :hover 대신 포인터 이벤트로 관리한다. :hover는 브라우저가 소유해서
     포인터가 움직여야만 재평가되는데, 재클릭으로 패널을 닫으면 $isActive만
     풀리고 포인터는 그대로라 회색 잔상이 남는다. */
  background-color: ${props =>
    props.$isHovered && !props.$isActive && props.$isClickable
      ? 'rgba(0, 0, 0, 0.05)'
      : 'transparent'};
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
    bottom: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => props.$isEnabled ? COLOR_PRIMARY : 'transparent'};
    transition: background-color 0.2s ease;
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
    return props.$isActive ? COLOR_PRIMARY : COLOR_GRAY_TEXT;
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

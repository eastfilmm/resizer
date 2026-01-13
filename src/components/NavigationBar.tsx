'use client';

import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAtom, useAtomValue } from 'jotai';
import { 
  activeNavPanelAtom, 
  NavPanelType,
  paddingEnabledAtom,
  backgroundColorAtom,
  glassBlurAtom,
  shadowEnabledAtom,
  copyrightEnabledAtom
} from '@/atoms/imageAtoms';
import { PaddingPanel } from './panels/PaddingPanel';
import { BackgroundPanel } from './panels/BackgroundPanel';
import { GlassBlurPanel } from './panels/GlassBlurPanel';
import { CopyrightPanel } from './panels/CopyrightPanel';
import { ShadowPanel } from './panels/ShadowPanel';


type NavItem = {
  id: NavPanelType;
  label: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'padding', label: 'Padding', icon: '/padding.svg' },
  { id: 'background', label: 'Background', icon: '/background.svg' },
  { id: 'glassblur', label: 'Glass Blur', icon: '/glassBlur.svg' },
  { id: 'shadow', label: 'Shadow', icon: '/shadow.svg' },
  { id: 'copyright', label: 'Copyright', icon: '/copyright.svg' },
];

// Panel heights for each nav item
const PANEL_HEIGHTS: Record<Exclude<NavPanelType, null>, number> = {
  padding: 120,
  background: 80,
  glassblur: 160,
  shadow: 160,
  copyright: 120,
};

const NavButton = memo(({ 
  item, 
  isActive, 
  isEnabled,
  onClick 
}: { 
  item: NavItem; 
  isActive: boolean;
  isEnabled: boolean;
  onClick: () => void;
}) => (
  <NavButtonStyled $isActive={isActive} $isEnabled={isEnabled} onClick={onClick}>
    <NavIcon 
      src={item.icon} 
      alt={item.label} 
      $isActive={isActive}
    />
    <ButtonLabel $isActive={isActive}>{item.label}</ButtonLabel>
  </NavButtonStyled>
));
NavButton.displayName = 'NavButton';

const PanelContent = memo(({ activePanel }: { activePanel: NavPanelType }) => {
  switch (activePanel) {
    case 'padding':
      return <PaddingPanel />;
    case 'background':
      return <BackgroundPanel />;
    case 'glassblur':
      return <GlassBlurPanel />;
    case 'shadow':
      return <ShadowPanel />;
    case 'copyright':
      return <CopyrightPanel />;
    default:
      return null;
  }
});
PanelContent.displayName = 'PanelContent';

export const NavigationBar = () => {
  const [activePanel, setActivePanel] = useAtom(activeNavPanelAtom);
  const paddingEnabled = useAtomValue(paddingEnabledAtom);
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const glassBlur = useAtomValue(glassBlurAtom);
  const shadowEnabled = useAtomValue(shadowEnabledAtom);
  const copyrightEnabled = useAtomValue(copyrightEnabledAtom);

  // State for smooth panel transitions
  const [displayedPanel, setDisplayedPanel] = useState<NavPanelType>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);

  // Handle panel transition with fade out -> height change -> fade in
  useEffect(() => {
    if (activePanel === null) {
      // Closing: fade out first, then collapse
      setIsContentVisible(false);
      const timer = setTimeout(() => {
        setDisplayedPanel(null);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Opening or switching panels
      if (displayedPanel === null) {
        // Opening from closed: set panel, then fade in after height animation
        setDisplayedPanel(activePanel);
        const timer = setTimeout(() => {
          setIsContentVisible(true);
        }, 200);
        return () => clearTimeout(timer);
      } else if (activePanel !== displayedPanel) {
        // Switching panels: fade out -> change panel -> fade in
        setIsContentVisible(false);
        const timer = setTimeout(() => {
          setDisplayedPanel(activePanel);
          setTimeout(() => {
            setIsContentVisible(true);
          }, 100);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        // Same panel reopened (edge case): ensure content is visible
        if (!isContentVisible) {
          setIsContentVisible(true);
        }
      }
    }
  }, [activePanel, displayedPanel, isContentVisible]);

  const getIsEnabled = useCallback((id: NavPanelType): boolean => {
    switch (id) {
      case 'padding':
        return paddingEnabled;
      case 'background':
        return backgroundColor !== 'white';
      case 'glassblur':
        return glassBlur;
      case 'shadow':
        return shadowEnabled;
      case 'copyright':
        return copyrightEnabled;
      default:
        return false;
    }
  }, [paddingEnabled, backgroundColor, glassBlur, shadowEnabled, copyrightEnabled]);

  const handleNavClick = useCallback((id: NavPanelType) => {
    setActivePanel(prev => prev === id ? null : id);
  }, [setActivePanel]);

  // Calculate active index for slider position
  const activeIndex = useMemo(() => {
    if (activePanel === null) return -1;
    return NAV_ITEMS.findIndex(item => item.id === activePanel);
  }, [activePanel]);

  // Calculate panel height based on activePanel (for smooth height transitions)
  const panelHeight = useMemo(() => {
    if (activePanel === null) return 0;
    return PANEL_HEIGHTS[activePanel];
  }, [activePanel]);

  return (
    <Container>
      {/* Panel */}
      <PanelContainer $height={panelHeight}>
        <PanelContentWrapper $isVisible={isContentVisible}>
          <PanelContent activePanel={displayedPanel} />
        </PanelContentWrapper>
      </PanelContainer>

      {/* Navigation Bar */}
      <NavContainer>
        {/* Sliding white background */}
        <SliderBackground $activeIndex={activeIndex} />
        
        <NavButtonsWrapper>
          {NAV_ITEMS.map(item => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activePanel === item.id}
              isEnabled={getIsEnabled(item.id)}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </NavButtonsWrapper>
      </NavContainer>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const PanelContainer = styled.div<{ $height: number }>`
  background-color: #ffffff;
  overflow: hidden;
  height: ${props => props.$height}px;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${props => props.$height > 0 ? '0 -2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const PanelContentWrapper = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.15s ease;
`;

const NavContainer = styled.div`
  height: 74px;
  background-color: #e0e0e0;
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
`;

const SliderBackground = styled.div<{ $activeIndex: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20%;
  background-color: #ffffff;
  transition: left 0.3s ease, opacity 0.3s ease;
  left: ${props => props.$activeIndex >= 0 ? `${props.$activeIndex * 20}%` : '0'};
  opacity: ${props => props.$activeIndex >= 0 ? 1 : 0};
  pointer-events: none;
  border-radius: 0 0 8px 8px;
`;

const NavButtonsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`;

const NavButtonStyled = styled.button<{ $isActive: boolean; $isEnabled: boolean }>`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  position: relative;
  gap: 4px;

  /* Enabled indicator dot */
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
    background-color: ${props => props.$isActive ? 'transparent' : 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    background-color: ${props => props.$isActive ? 'transparent' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const ButtonLabel = styled.span<{ $isActive: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.$isActive ? '#007bff' : '#666666'};
  white-space: nowrap;
  transition: color 0.3s ease;
`;

const NavIcon = styled.img<{ $isActive: boolean }>`
  width: 24px;
  height: 24px;
  transition: filter 0.3s ease, opacity 0.3s ease;
  opacity: ${props => props.$isActive ? 1 : 0.6};
  /* CSS filter to change black SVG to blue (#007bff) when active */
  filter: ${props => props.$isActive 
    ? 'invert(32%) sepia(98%) saturate(1234%) hue-rotate(200deg) brightness(97%) contrast(101%)' 
    : 'none'};
`;

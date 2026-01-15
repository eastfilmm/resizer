'use client';

import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { 
  activeNavPanelAtom, 
  NavPanelType,
  paddingEnabledAtom,
  backgroundColorAtom,
  glassBlurAtom,
  shadowEnabledAtom,
  copyrightEnabledAtom,
  canvasAspectRatioAtom
} from '@/atoms/imageAtoms';
import { LayoutPanel } from './panels/LayoutPanel';
import { BackgroundPanel } from './panels/BackgroundPanel';
import { GlassBlurPanel } from './panels/GlassBlurPanel';
import { CopyrightPanel } from './panels/CopyrightPanel';
import { ShadowPanel } from './panels/ShadowPanel';
import {
  Container,
  PanelContainer,
  PanelContentWrapper,
  NavContainer,
  SliderBackground,
  NavButtonsWrapper,
  NavButtonStyled,
  ButtonLabel,
  NavIcon,
} from './NavigationBar.styles';

type NavItem = {
  id: Exclude<NavPanelType, null>;
  label: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'layout', label: 'Layout', icon: '/layout.svg' },
  { id: 'background', label: 'Background', icon: '/background.svg' },
  { id: 'glassblur', label: 'Glass Blur', icon: '/glassBlur.svg' },
  { id: 'shadow', label: 'Shadow', icon: '/shadow.svg' },
  { id: 'copyright', label: 'Copyright', icon: '/copyright.svg' },
];

const PANEL_HEIGHTS: Record<Exclude<NavPanelType, null>, number> = {
  layout: 200,
  background: 80,
  glassblur: 160,
  shadow: 160,
  copyright: 160,
};

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  isEnabled: boolean;
  onClick: (id: Exclude<NavPanelType, null>) => void;
}

const NavButton = memo(({ item, isActive, isEnabled, onClick }: NavButtonProps) => {
  const handleClick = useCallback(() => {
    onClick(item.id);
  }, [onClick, item.id]);

  return (
    <NavButtonStyled $isActive={isActive} $isEnabled={isEnabled} onClick={handleClick}>
      <NavIcon src={item.icon} alt={item.label} $isActive={isActive} />
      <ButtonLabel $isActive={isActive}>{item.label}</ButtonLabel>
    </NavButtonStyled>
  );
});
NavButton.displayName = 'NavButton';

const PanelContent = memo(({ activePanel }: { activePanel: NavPanelType }) => {
  const content = useMemo(() => {
    switch (activePanel) {
      case 'layout':
        return <LayoutPanel />;
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
  }, [activePanel]);

  return <>{content}</>;
});
PanelContent.displayName = 'PanelContent';

export const NavigationBar = () => {
  const [activePanel, setActivePanel] = useAtom(activeNavPanelAtom);
  const paddingEnabled = useAtomValue(paddingEnabledAtom);
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const glassBlur = useAtomValue(glassBlurAtom);
  const shadowEnabled = useAtomValue(shadowEnabledAtom);
  const copyrightEnabled = useAtomValue(copyrightEnabledAtom);
  const aspectRatio = useAtomValue(canvasAspectRatioAtom);

  const [displayedPanel, setDisplayedPanel] = useState<NavPanelType>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cleanup timer helper
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  // Handle panel transition with fade out -> height change -> fade in
  useEffect(() => {
    clearTimer();

    if (activePanel === null) {
      // Closing: fade out first, then collapse
      setIsContentVisible(false);
      timerRef.current = setTimeout(() => {
        setDisplayedPanel(null);
      }, 100);
    } else {
      // Opening or switching panels
      if (displayedPanel === null) {
        // Opening from closed: set panel, then fade in after height animation
        setDisplayedPanel(activePanel);
        timerRef.current = setTimeout(() => {
          setIsContentVisible(true);
        }, 200);
      } else if (activePanel !== displayedPanel) {
        // Switching panels: fade out -> change panel -> fade in
        setIsContentVisible(false);
        timerRef.current = setTimeout(() => {
          setDisplayedPanel(activePanel);
          setTimeout(() => {
            setIsContentVisible(true);
          }, 100);
        }, 100);
      } else {
        // Same panel reopened (edge case): ensure content is visible
        if (!isContentVisible) {
          setIsContentVisible(true);
        }
      }
    }
  }, [activePanel, displayedPanel, isContentVisible, clearTimer]);

  // Memoize enabled states
  const enabledStates = useMemo(() => ({
    layout: paddingEnabled || aspectRatio !== '1:1',
    background: backgroundColor !== 'white',
    glassblur: glassBlur,
    shadow: shadowEnabled,
    copyright: copyrightEnabled,
  }), [paddingEnabled, aspectRatio, backgroundColor, glassBlur, shadowEnabled, copyrightEnabled]);

  const handleNavClick = useCallback((id: NavPanelType) => {
    setActivePanel(prev => prev === id ? null : id);
  }, [setActivePanel]);

  // Close panel when clicking outside (except navigation bar)
  useEffect(() => {
    if (activePanel === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePanel(null);
      }
    };

    // Add listener on next tick to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePanel, setActivePanel]);

  const activeIndex = useMemo(() => {
    if (activePanel === null) return -1;
    return NAV_ITEMS.findIndex(item => item.id === activePanel);
  }, [activePanel]);

  const panelHeight = activePanel ? PANEL_HEIGHTS[activePanel] : 0;

  return (
    <Container ref={containerRef}>
      <PanelContainer $height={panelHeight}>
        <PanelContentWrapper $isVisible={isContentVisible}>
          <PanelContent activePanel={displayedPanel} />
        </PanelContentWrapper>
      </PanelContainer>

      <NavContainer>
        <SliderBackground $activeIndex={activeIndex} />
        <NavButtonsWrapper>
          {NAV_ITEMS.map(item => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activePanel === item.id}
              isEnabled={enabledStates[item.id]}
              onClick={handleNavClick}
            />
          ))}
        </NavButtonsWrapper>
      </NavContainer>
    </Container>
  );
};

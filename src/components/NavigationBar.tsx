'use client';

import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  activeNavPanelAtom,
  NavPanelType,
  backgroundColorAtom,
  glassBlurAtom,
  shadowEnabledAtom,
  canvasAspectRatioAtom,
  polaroidModeAtom,
  paddingAtom
} from '@/atoms/imageAtoms';
import { LayoutPanel } from './panels/LayoutPanel';
import { PolaroidPanel } from './panels/PolaroidPanel';
import { BackgroundPanel } from './panels/BackgroundPanel';
import { GlassBlurPanel } from './panels/GlassBlurPanel';
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
  { id: 'polaroid', label: 'Polaroid', icon: '/polaroid.svg' },
  { id: 'background', label: 'Background', icon: '/background.svg' },
  { id: 'glassblur', label: 'Glass Blur', icon: '/glassBlur.svg' },
  { id: 'shadow', label: 'Shadow', icon: '/shadow.svg' },
];

const PANEL_HEIGHTS: Record<Exclude<NavPanelType, null>, number> = {
  layout: 160,
  polaroid: 120,
  background: 72,
  glassblur: 160,
  shadow: 160,
};

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  isEnabled: boolean;
  isDimmed: boolean;
  isClickable: boolean;
  onClick: (id: Exclude<NavPanelType, null>) => void;
}

const NavButton = memo(({ item, isActive, isEnabled, isDimmed, isClickable, onClick }: NavButtonProps) => {
  const handleClick = useCallback(() => {
    if (!isClickable) return;
    onClick(item.id);
  }, [onClick, item.id, isClickable]);

  return (
    <NavButtonStyled
      $isActive={isActive}
      $isEnabled={isEnabled}
      $isClickable={isClickable}
      onClick={handleClick}
      disabled={!isClickable}
    >
      <NavIcon src={item.icon} alt={item.label} $isActive={isActive} $isDimmed={isDimmed} />
      <ButtonLabel $isActive={isActive} $isDimmed={isDimmed}>{item.label}</ButtonLabel>
    </NavButtonStyled>
  );
});
NavButton.displayName = 'NavButton';

const PanelContent = memo(({ activePanel }: { activePanel: NavPanelType }) => {
  const content = useMemo(() => {
    switch (activePanel) {
      case 'layout':
        return <LayoutPanel />;
      case 'polaroid':
        return <PolaroidPanel />;
      case 'background':
        return <BackgroundPanel />;
      case 'glassblur':
        return <GlassBlurPanel />;
      case 'shadow':
        return <ShadowPanel />;
      default:
        return null;
    }
  }, [activePanel]);

  return <>{content}</>;
});
PanelContent.displayName = 'PanelContent';

export const NavigationBar = () => {
  const [activePanel, setActivePanel] = useAtom(activeNavPanelAtom);
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const glassBlur = useAtomValue(glassBlurAtom);
  const shadowEnabled = useAtomValue(shadowEnabledAtom);
  const padding = useAtomValue(paddingAtom);
  const aspectRatio = useAtomValue(canvasAspectRatioAtom);
  const polaroidMode = useAtomValue(polaroidModeAtom);

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
      }, 150); // Match opacity transition
    } else {
      // Opening or switching panels
      if (displayedPanel === null) {
        // Opening from closed: set panel immediately, then fade in
        setDisplayedPanel(activePanel);
        timerRef.current = setTimeout(() => {
          setIsContentVisible(true);
        }, 50); // Small delay to ensure height transition started
      } else if (activePanel !== displayedPanel) {
        // Switching panels: fade out -> change panel -> fade in
        setIsContentVisible(false);
        timerRef.current = setTimeout(() => {
          setDisplayedPanel(activePanel);
          setIsContentVisible(true);
        }, 150); // Wait for fade out then switch and fade in at once
      } else {
        // Same panel: ensure it's visible
        setIsContentVisible(true);
      }
    }
  }, [activePanel, clearTimer]); // Remove displayedPanel/isContentVisible from deps to prevent loops

  // Memoize active states (when the blue dot should appear)
  const activeStates = useMemo(() => ({
    layout: aspectRatio !== '1:1' || padding > 0,
    polaroid: polaroidMode,
    background: backgroundColor !== 'white',
    glassblur: glassBlur,
    shadow: shadowEnabled,
  }), [aspectRatio, backgroundColor, glassBlur, shadowEnabled, padding, polaroidMode]);

  const handleNavClick = useCallback((id: Exclude<NavPanelType, null>) => {
    // In Polaroid mode, only 'layout', 'polaroid' and 'background' are functional.
    // glassblur and shadow are disabled in Polaroid mode.
    if (polaroidMode && id !== 'layout' && id !== 'polaroid' && id !== 'background') {
      return;
    }
    setActivePanel(prev => prev === id ? null : id);
  }, [setActivePanel, polaroidMode]);

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
              isEnabled={activeStates[item.id]}
              isDimmed={polaroidMode && item.id !== 'layout' && item.id !== 'polaroid' && item.id !== 'background'}
              isClickable={!polaroidMode || item.id === 'layout' || item.id === 'polaroid' || item.id === 'background'}
              onClick={handleNavClick}
            />
          ))}
        </NavButtonsWrapper>
      </NavContainer>
    </Container>
  );
};

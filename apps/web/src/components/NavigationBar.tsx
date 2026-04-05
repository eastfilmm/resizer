'use client';

import { memo, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAtom, useAtomValue } from 'jotai';
import { useClickOutside } from '@/hooks/useClickOutside';
import { usePanelTransition } from '@/hooks/usePanelTransition';
import {
  activeNavPanelAtom,
  NavPanelType,
  backgroundColorAtom,
  glassBlurAtom,
  shadowEnabledAtom,
  canvasAspectRatioAtom,
  frameTypeAtom,
  paddingAtom,
} from '@/atoms/imageAtoms';
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

const panelLoading = () => null;

const LayoutPanel = dynamic(
  () => import('./panels/LayoutPanel').then((mod) => mod.LayoutPanel),
  { loading: panelLoading },
);
const FramePanel = dynamic(
  () => import('./panels/FramePanel').then((mod) => mod.FramePanel),
  { loading: panelLoading },
);
const BackgroundPanel = dynamic(
  () => import('./panels/BackgroundPanel').then((mod) => mod.BackgroundPanel),
  { loading: panelLoading },
);
const GlassBlurPanel = dynamic(
  () => import('./panels/GlassBlurPanel').then((mod) => mod.GlassBlurPanel),
  { loading: panelLoading },
);
const ShadowPanel = dynamic(
  () => import('./panels/ShadowPanel').then((mod) => mod.ShadowPanel),
  { loading: panelLoading },
);

function isPanelAllowedInFrameMode(
  panelId: string,
  frameType: string,
): boolean {
  if (frameType === 'none') return true;
  if (frameType === 'polaroid') {
    return (
      panelId === 'layout' || panelId === 'frame' || panelId === 'background'
    );
  }
  return panelId === 'layout' || panelId === 'frame';
}

type NavItem = {
  id: Exclude<NavPanelType, null>;
  label: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'layout', label: 'Layout', icon: '/layout.svg' },
  { id: 'frame', label: 'Frame', icon: '/polaroid.svg' },
  { id: 'background', label: 'Background', icon: '/background.svg' },
  { id: 'glassblur', label: 'Glass Blur', icon: '/glassBlur.svg' },
  { id: 'shadow', label: 'Shadow', icon: '/shadow.svg' },
];

const PANEL_HEIGHTS: Record<Exclude<NavPanelType, null>, number> = {
  layout: 132,
  frame: 180,
  background: 56,
  glassblur: 132,
  shadow: 132,
};

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  isEnabled: boolean;
  isDimmed: boolean;
  isClickable: boolean;
  onClick: (id: Exclude<NavPanelType, null>) => void;
}

const NavButton = memo(
  ({
    item,
    isActive,
    isEnabled,
    isDimmed,
    isClickable,
    onClick,
  }: NavButtonProps) => {
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
        <NavIcon
          src={item.icon}
          alt={item.label}
          $isActive={isActive}
          $isDimmed={isDimmed}
        />
        <ButtonLabel $isActive={isActive} $isDimmed={isDimmed}>
          {item.label}
        </ButtonLabel>
      </NavButtonStyled>
    );
  },
);
NavButton.displayName = 'NavButton';

const PanelContent = memo(({ activePanel }: { activePanel: NavPanelType }) => {
  const content = useMemo(() => {
    switch (activePanel) {
      case 'layout':
        return <LayoutPanel />;
      case 'frame':
        return <FramePanel />;
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
  const frameType = useAtomValue(frameTypeAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const { displayedPanel, isContentVisible } = usePanelTransition(activePanel);

  // Memoize active states (when the blue dot should appear)
  const activeStates = useMemo(
    () => ({
      layout: aspectRatio !== '1:1' || padding > 0,
      frame: frameType !== 'none',
      background:
        backgroundColor !== 'white' &&
        isPanelAllowedInFrameMode('background', frameType),
      glassblur: glassBlur && isPanelAllowedInFrameMode('glassblur', frameType),
      shadow: shadowEnabled && isPanelAllowedInFrameMode('shadow', frameType),
    }),
    [
      aspectRatio,
      backgroundColor,
      glassBlur,
      shadowEnabled,
      padding,
      frameType,
    ],
  );

  const handleNavClick = useCallback(
    (id: Exclude<NavPanelType, null>) => {
      if (!isPanelAllowedInFrameMode(id, frameType)) return;
      setActivePanel((prev) => (prev === id ? null : id));
    },
    [setActivePanel, frameType],
  );

  useClickOutside(
    containerRef,
    useCallback(() => setActivePanel(null), [setActivePanel]),
    activePanel !== null,
  );

  const activeIndex = useMemo(() => {
    if (activePanel === null) return -1;
    return NAV_ITEMS.findIndex((item) => item.id === activePanel);
  }, [activePanel]);

  const framePanelHeight = frameType === 'polaroid' ? 180 : 100;
  const panelHeight = activePanel
    ? activePanel === 'frame'
      ? framePanelHeight
      : PANEL_HEIGHTS[activePanel]
    : 0;

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
          {NAV_ITEMS.map((item) => {
            const isClickable = isPanelAllowedInFrameMode(item.id, frameType);
            const isDimmed = !isClickable;

            return (
              <NavButton
                key={item.id}
                item={item}
                isActive={activePanel === item.id}
                isEnabled={activeStates[item.id]}
                isDimmed={isDimmed}
                isClickable={isClickable}
                onClick={handleNavClick}
              />
            );
          })}
        </NavButtonsWrapper>
      </NavContainer>
    </Container>
  );
};

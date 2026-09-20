'use client';

import {
  useClickOutside,
  FocusReveal,
  useClickClearedHover,
  LayoutIcon,
  PolaroidIcon,
  BackgroundIcon,
  GlassBlurIcon,
  ShadowIcon,
} from '@resizer/ui';
import { memo, useCallback, useMemo, useRef } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { LayoutPanel } from './panels/LayoutPanel';
import { FramePanel } from './panels/FramePanel';
import { BackgroundPanel } from './panels/BackgroundPanel';
import { GlassBlurPanel } from './panels/GlassBlurPanel';
import { ShadowPanel } from './panels/ShadowPanel';
import { useAtom, useAtomValue } from 'jotai';
import { usePanelTransition } from '../hooks/usePanelTransition';
import {
  activeNavPanelAtom,
  backgroundColorAtom,
  glassBlurAtom,
  shadowEnabledAtom,
  canvasAspectRatioAtom,
  frameTypeAtom,
  paddingAtom,
} from '../atoms/imageAtoms';
import type { NavPanelType } from '../atoms/imageAtoms';
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
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'layout', label: 'Layout', icon: LayoutIcon },
  { id: 'frame', label: 'Frame', icon: PolaroidIcon },
  { id: 'background', label: 'Background', icon: BackgroundIcon },
  { id: 'glassblur', label: 'Glass Blur', icon: GlassBlurIcon },
  { id: 'shadow', label: 'Shadow', icon: ShadowIcon },
];

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  isEnabled: boolean;
  isDimmed: boolean;
  isClickable: boolean;
  isHovered: boolean;
  onClick: (id: Exclude<NavPanelType, null>) => void;
  hoverProps: {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  };
}

const NavButton = memo(
  ({
    item,
    isActive,
    isEnabled,
    isDimmed,
    isClickable,
    isHovered,
    onClick,
    hoverProps,
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
        $isHovered={isHovered}
        onClick={handleClick}
        {...(isClickable ? hoverProps : {})}
        disabled={!isClickable}
      >
        <NavIcon
          as={item.icon}
          role="img"
          aria-label={item.label}
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

  const { hoveredKey, hoverProps, containerProps, clearHover } =
    useClickClearedHover<Exclude<NavPanelType, null>>();

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
      // 클릭으로 닫을 때 hover 잔상이 남지 않도록 비운다.
      // 다시 칠해지려면 포인터가 실제로 움직여야 한다.
      clearHover();
      setActivePanel((prev) => (prev === id ? null : id));
    },
    [setActivePanel, frameType, clearHover],
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

  return (
    <Container ref={containerRef}>
      <FocusReveal.Root>
        <PanelContainer $isOpen={activePanel !== null}>
          <PanelContentWrapper $isVisible={isContentVisible}>
            <PanelContent activePanel={displayedPanel} />
          </PanelContentWrapper>
        </PanelContainer>
      </FocusReveal.Root>

      <NavContainer {...containerProps}>
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
                isHovered={hoveredKey === item.id}
                onClick={handleNavClick}
                hoverProps={hoverProps(item.id)}
              />
            );
          })}
        </NavButtonsWrapper>
      </NavContainer>
    </Container>
  );
};

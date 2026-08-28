import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';

/**
 * FocusReveal — 컴파운드 컴포넌트
 *
 * `Root`로 감싼 영역 안에서 `Trigger`(예: 슬라이더)를 조작하는 동안,
 * Trigger와 그 상위 경로/하위를 제외한 나머지 모든 요소가 투명해집니다.
 * 조작 중 캔버스 등 결과에 집중할 수 있게 UI를 걷어내는 용도.
 *
 * @example
 * <FocusReveal.Root>
 *   <PanelLabel />                 // 조작 중 투명
 *   <FocusReveal.Trigger>
 *     <Slider ... />               // 유지 (인터랙션 그대로)
 *   </FocusReveal.Trigger>
 *   <OtherControls />              // 조작 중 투명
 * </FocusReveal.Root>
 *
 * CSS opacity 클램핑 특성상 "상위는 투명, 하위는 불투명"이 불가능하므로,
 * Trigger의 상위 경로는 유지됩니다. 페이드 경계를 좁히려면 Root를 더 안쪽에 두세요.
 */

interface FocusRevealContextValue {
  active: boolean;
  activate: () => void;
  deactivate: () => void;
}

const FocusRevealContext = createContext<FocusRevealContextValue | null>(null);

const useFocusRevealContext = (): FocusRevealContextValue => {
  const ctx = useContext(FocusRevealContext);
  if (!ctx) {
    throw new Error('FocusReveal.Trigger는 FocusReveal.Root 안에서만 사용할 수 있어요.');
  }
  return ctx;
};

interface RootProps {
  children: ReactNode;
  /** 비활성(투명 처리) 요소의 투명도. 0 = 완전 투명(기본값) */
  dimOpacity?: number;
  /** 페이드 트랜지션 시간(ms). 기본 180 */
  transitionMs?: number;
  className?: string;
}

const Root = ({ children, dimOpacity = 0, transitionMs = 180, className }: RootProps) => {
  const [active, setActive] = useState(false);
  const activate = useCallback(() => setActive(true), []);
  const deactivate = useCallback(() => setActive(false), []);

  const styleVars = {
    '--focus-dim-opacity': String(dimOpacity),
    '--focus-transition': `${transitionMs}ms`,
  } as CSSProperties;

  return (
    <FocusRevealContext.Provider value={{ active, activate, deactivate }}>
      <RootBox
        className={className}
        data-focus-root=""
        data-active={active ? '' : undefined}
        style={styleVars}
      >
        {children}
      </RootBox>
    </FocusRevealContext.Provider>
  );
};

const RootBox = styled.div`
  & * {
    transition: opacity var(--focus-transition, 180ms) ease;
  }

  /* 활성 시: 트리거 자신 / 트리거의 상위 경로 / 트리거의 하위를 제외한 모든 요소를 투명 처리 */
  &[data-active]
    *:not([data-focus-trigger]):not(:has([data-focus-trigger])):not([data-focus-trigger] *) {
    opacity: var(--focus-dim-opacity, 0);
    pointer-events: none;
  }
`;

interface TriggerProps {
  children: ReactNode;
  className?: string;
}

const Trigger = ({ children, className }: TriggerProps) => {
  const { activate, deactivate } = useFocusRevealContext();
  const endRef = useRef<(() => void) | null>(null);

  const handlePointerDown = useCallback(() => {
    activate();
    const end = () => {
      deactivate();
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      endRef.current = null;
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    endRef.current = end;
  }, [activate, deactivate]);

  // 언마운트 시 리스너 정리
  useEffect(() => () => endRef.current?.(), []);

  return (
    <TriggerBox className={className} data-focus-trigger="" onPointerDown={handlePointerDown}>
      {children}
    </TriggerBox>
  );
};

// 레이아웃에 영향을 주지 않도록 박스를 생성하지 않음 (이벤트는 버블링으로 수신)
const TriggerBox = styled.div`
  display: contents;
`;

export const FocusReveal = {
  Root,
  Trigger,
};

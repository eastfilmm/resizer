import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
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
  /** false면 Trigger를 조작해도 투명 처리가 동작하지 않음. 기본 true */
  enabled?: boolean;
  /** 비활성(투명 처리) 요소의 투명도. 0 = 완전 투명(기본값) */
  dimOpacity?: number;
  /** 페이드 트랜지션 시간(ms). 기본 180 */
  transitionMs?: number;
  className?: string;
}

const Root = ({ children, enabled = true, dimOpacity = 0, transitionMs = 180, className }: RootProps) => {
  const [active, setActive] = useState(false);
  const activate = useCallback(() => {
    if (enabled) setActive(true);
  }, [enabled]);
  const deactivate = useCallback(() => setActive(false), []);

  // enabled가 꺼지면 활성 상태를 즉시 해제
  useEffect(() => {
    if (!enabled) setActive(false);
  }, [enabled]);

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
  display: contents;

  & * {
    transition:
      opacity var(--focus-transition, 180ms) ease,
      background-color var(--focus-transition, 180ms) ease,
      box-shadow var(--focus-transition, 180ms) ease;
  }

  /* 활성 트리거 자신 / 상위 경로 / 하위를 제외한 나머지 → 완전 투명 */
  &[data-active]
    *:not([data-focus-active-trigger]):not(:has([data-focus-active-trigger])):not([data-focus-active-trigger] *) {
    opacity: var(--focus-dim-opacity, 0);
    pointer-events: none;
  }

  /* 활성 트리거의 상위 경로 → 배경/그림자만 제거(opacity는 유지해 슬라이더가 보이도록) */
  &[data-active] :has([data-focus-active-trigger]) {
    background: transparent !important;
    box-shadow: none !important;
  }
`;

interface TriggerProps {
  children: ReactNode;
  className?: string;
}

const Trigger = ({ children, className }: TriggerProps) => {
  const { activate, deactivate } = useFocusRevealContext();
  const [pressed, setPressed] = useState(false);
  const endRef = useRef<(() => void) | null>(null);

  // 단순 탭/클릭과 슬라이딩을 구분: 일정 거리 이상 이동해야 활성화
  const DRAG_THRESHOLD = 4; // px

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      // 비활성(disabled) 컨트롤은 트리거하지 않음 (기능 off 상태)
      // 네이티브 input[disabled]와 Base UI의 [data-disabled] 모두 대응
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-disabled], :disabled')) return;

      const startX = e.clientX;
      const startY = e.clientY;
      let activated = false;

      const onMove = (ev: PointerEvent) => {
        if (activated) return;
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > DRAG_THRESHOLD) {
          activated = true;
          setPressed(true);
          activate();
        }
      };
      const end = () => {
        if (activated) {
          setPressed(false);
          deactivate();
        }
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', end);
        window.removeEventListener('pointercancel', end);
        endRef.current = null;
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
      endRef.current = end;
    },
    [activate, deactivate],
  );

  // 언마운트 시 리스너 정리
  useEffect(() => () => endRef.current?.(), []);

  return (
    <TriggerBox
      className={className}
      data-focus-trigger=""
      data-focus-active-trigger={pressed ? '' : undefined}
      onPointerDown={handlePointerDown}
    >
      {children}
    </TriggerBox>
  );
};

// 레이아웃에 영향을 주지 않도록 박스를 생성하지 않음 (이벤트는 버블링으로 수신)
const TriggerBox = styled.div`
  display: contents;
`;

interface ScopeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Scope로 감싼 그룹은, 그 안의 Trigger가 활성화되면 그룹 전체가 표시 상태로 유지됩니다.
 * (예: 슬라이더 + 값 숫자를 한 그룹으로 묶으면 드래그 중에도 값이 함께 보임)
 */
const Scope = ({ children, className }: ScopeProps) => (
  <ScopeBox className={className} data-focus-scope="">
    {children}
  </ScopeBox>
);

const ScopeBox = styled.div`
  display: contents;
`;

export const FocusReveal = {
  Root,
  Trigger,
  Scope,
};

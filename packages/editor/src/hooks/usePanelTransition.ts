import { useState, useEffect } from 'react';
import { PANEL_FADE_MS, PANEL_FADE_IN_DELAY_MS } from '@resizer/ui';
import type { NavPanelType } from '../atoms/imageAtoms';

/** 패널 전환 중 예약해 둔 다음 단계 */
type PendingTransition =
    | { kind: 'close' }
    | { kind: 'open' }
    | { kind: 'switch'; to: NavPanelType }
    | null;

/**
 * 패널을 페이드아웃 → 높이 전환 → 페이드인 순서로 바꾼다.
 *
 * 즉시 반영할 상태는 렌더 중에 조정하고(React 권장 패턴), 지연이 필요한
 * 단계만 effect에서 타이머로 처리한다. effect 본문에서 setState를 호출하면
 * 연쇄 렌더가 생기고, displayedPanel을 의존성에 넣으면 타이머가 만든 변경으로
 * effect가 재실행되며 전환이 스스로를 취소한다.
 */
export function usePanelTransition(activePanel: NavPanelType) {
    const [displayedPanel, setDisplayedPanel] = useState<NavPanelType>(null);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [prevActivePanel, setPrevActivePanel] = useState<NavPanelType>(null);
    const [pending, setPending] = useState<PendingTransition>(null);

    // activePanel이 바뀐 렌더에서만 조정한다.
    if (activePanel !== prevActivePanel) {
        setPrevActivePanel(activePanel);

        if (activePanel === null) {
            // 닫기: 먼저 페이드아웃하고, 그 다음 높이를 접는다.
            setIsContentVisible(false);
            setPending({ kind: 'close' });
        } else if (displayedPanel === null) {
            // 닫힘 → 열기: 패널을 먼저 붙이고 높이 전환이 시작된 뒤 페이드인.
            setDisplayedPanel(activePanel);
            setPending({ kind: 'open' });
        } else if (activePanel !== displayedPanel) {
            // 전환: 페이드아웃 → 교체 + 페이드인.
            setIsContentVisible(false);
            setPending({ kind: 'switch', to: activePanel });
        } else {
            // 같은 패널: 보이는 상태만 확실히 한다.
            setIsContentVisible(true);
            setPending(null);
        }
    }

    useEffect(() => {
        if (!pending) return;

        let timer: ReturnType<typeof setTimeout>;
        if (pending.kind === 'close') {
            timer = setTimeout(() => setDisplayedPanel(null), PANEL_FADE_MS);
        } else if (pending.kind === 'open') {
            timer = setTimeout(() => setIsContentVisible(true), PANEL_FADE_IN_DELAY_MS);
        } else {
            const next = pending.to;
            timer = setTimeout(() => {
                setDisplayedPanel(next);
                setIsContentVisible(true);
            }, PANEL_FADE_MS);
        }

        return () => clearTimeout(timer);
    }, [pending]);

    return { displayedPanel, isContentVisible };
}

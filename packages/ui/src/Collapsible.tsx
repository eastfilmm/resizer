'use client';

import styled from 'styled-components';
import { useState } from 'react';
import type { ReactNode, TransitionEvent } from 'react';
import { PANEL_EASING, PANEL_HEIGHT_MS } from './motion';

interface CollapsibleProps {
  isOpen: boolean;
  children: ReactNode;
}

/**
 * 패널 안에서 아래로 펼쳐지는 영역. 높이를 박지 않고 내용이 높이를 정한다.
 *
 * 높이를 고정하면 iOS처럼 입력 필드가 몇 px 더 큰 환경에서 하단이 잘린다.
 * opacity는 height와 같은 속도로 맞춘다. 더 빨리 끝내면 컨테이너가 절반만
 * 열린 시점에 내용이 이미 또렷해져 두 동작이 따로 노는 것처럼 보인다.
 * 닫혀 있을 때는 inert라서 안 보이는 버튼에 탭 포커스가 가지 않는다.
 *
 * 위쪽 간격(padding)은 높이가 줄어드는 Clip이 아니라 그 안의 Content에 둔다.
 * Clip에 두면 높이가 0까지 줄어도 padding은 남아 닫힌 상태에서 빈칸이 생긴다.
 *
 * 내용을 잘라내는 건 접히거나 펼쳐지는 동안뿐이다. 다 펼쳐진 뒤에도 잘라내면
 * 슬라이더 값 뱃지처럼 영역 위로 삐져나와야 하는 요소가 잘린다.
 */
export const Collapsible = ({ isOpen, children }: CollapsibleProps) => {
  // 처음부터 열려 있으면 이미 펼쳐진 상태다. 열고 닫힐 때마다 전환이 끝날 때까지 다시 자른다.
  const [isSettled, setIsSettled] = useState(isOpen);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    setIsSettled(false);
  }

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && isOpen) setIsSettled(true);
  };

  return (
    <Root $isOpen={isOpen} inert={!isOpen} onTransitionEnd={handleTransitionEnd}>
      <Clip $isClipped={!(isOpen && isSettled)}>
        <Content>{children}</Content>
      </Clip>
    </Root>
  );
};

const Root = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  display: grid;
  grid-template-rows: ${(props) => (props.$isOpen ? '1fr' : '0fr')};
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transition:
    grid-template-rows ${PANEL_HEIGHT_MS}ms ${PANEL_EASING},
    opacity ${PANEL_HEIGHT_MS}ms ${PANEL_EASING};
`;

const Clip = styled.div<{ $isClipped: boolean }>`
  min-height: 0;
  overflow: ${(props) => (props.$isClipped ? 'hidden' : 'visible')};
`;

const Content = styled.div`
  padding-top: 16px;
`;

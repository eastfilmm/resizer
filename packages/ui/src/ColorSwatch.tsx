'use client';

import styled from 'styled-components';
import { COLOR_GRAY_BORDER, COLOR_PRIMARY } from './theme';

/**
 * 색 칸을 틈 없이 한 줄로 이어 붙인 띠. 바깥 테두리와 모서리는 띠가 갖는다.
 * 흰 칸도 경계가 보이도록 다른 버튼과 같은 연회색 테두리를 둔다.
 */
export const SwatchStrip = styled.div`
  display: flex;
  width: 100%;
  /* 테두리까지 포함해 32px. 선택 보더는 칸 안쪽(inset)에 그려서 높이를 늘리지 않는다 */
  box-sizing: border-box;
  height: 32px;
  border: 1px solid ${COLOR_GRAY_BORDER};
  border-radius: 8px;
  overflow: hidden;
`;

/**
 * 띠 안의 색 한 칸. 남는 폭을 다른 칸과 똑같이 나눠 갖는다.
 *
 * 선택 보더는 칸 안쪽에 덧그린다(::after, inset). border를 쓰면 칸이 그만큼
 * 커지거나 내용이 줄어 옆 칸이 밀린다. 파란 칸 위에서도 보이도록 안쪽에 1px
 * 흰 줄을 한 겹 더 두른다.
 *
 * 색은 클래스가 아니라 인라인 style로 넣는다. styled-components는 보간 값이
 * 달라질 때마다 CSS 규칙을 새로 만들어 넣으므로, 색이 자주 바뀌면 규칙이
 * 쌓이고 스타일 재계산이 잦아진다.
 */
export const ColorSwatch = styled.button.attrs<{ $color: string }>((props) => ({
  type: 'button',
  style: { backgroundColor: props.$color },
}))<{
  $color: string;
  $isSelected?: boolean;
}>`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: none;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    box-shadow: ${(props) =>
      props.$isSelected ? `inset 0 0 0 2px ${COLOR_PRIMARY}, inset 0 0 0 3px white` : 'none'};
    transition: box-shadow 0.2s ease;
  }

  /* 띠의 둥근 모서리를 선택 보더도 따라가게 한다 */
  &:first-child::after {
    border-radius: 7px 0 0 7px;
  }
  &:last-child::after {
    border-radius: 0 7px 7px 0;
  }

  &:focus-visible {
    outline: none;
  }
  &:focus-visible::after {
    box-shadow: inset 0 0 0 2px ${COLOR_PRIMARY};
  }
`;

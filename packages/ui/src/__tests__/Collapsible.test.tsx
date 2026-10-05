import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Collapsible } from '../Collapsible';

/**
 * 접히고 펼쳐지는 동안에만 내용을 잘라낸다. 다 펼쳐진 뒤에도 잘라내면
 * 영역 위로 삐져나오는 슬라이더 값 뱃지가 잘린다.
 */
const setup = (isOpen: boolean) => {
  const view = render(
    <Collapsible isOpen={isOpen}>
      <span>content</span>
    </Collapsible>,
  );
  const root = () => view.container.firstElementChild as HTMLElement;
  const clip = () => root().firstElementChild as HTMLElement;
  const rerender = (next: boolean) =>
    view.rerender(
      <Collapsible isOpen={next}>
        <span>content</span>
      </Collapsible>,
    );
  return { root, clip, rerender };
};

describe('Collapsible', () => {
  it('처음부터 열려 있으면 잘라내지 않는다', () => {
    const { clip } = setup(true);

    expect(getComputedStyle(clip()).overflow).toBe('visible');
  });

  it('닫혀 있으면 잘라내고 inert다', () => {
    const { root, clip } = setup(false);

    expect(getComputedStyle(clip()).overflow).toBe('hidden');
    expect(root()).toHaveAttribute('inert');
  });

  it('펼쳐지는 동안은 잘라내고, 전환이 끝나면 푼다', () => {
    const { root, clip, rerender } = setup(false);

    rerender(true);
    expect(root()).not.toHaveAttribute('inert');
    expect(getComputedStyle(clip()).overflow).toBe('hidden');

    fireEvent.transitionEnd(root());
    expect(getComputedStyle(clip()).overflow).toBe('visible');
  });

  it('안쪽 요소의 전환 끝 이벤트로는 풀지 않는다', () => {
    const { root, clip, rerender } = setup(false);
    rerender(true);

    fireEvent.transitionEnd(screen.getByText('content'));

    expect(root()).not.toHaveAttribute('inert');
    expect(getComputedStyle(clip()).overflow).toBe('hidden');
  });

  it('접기 시작하면 바로 다시 잘라낸다', () => {
    const { root, clip, rerender } = setup(true);

    rerender(false);

    expect(getComputedStyle(clip()).overflow).toBe('hidden');
    expect(root()).toHaveAttribute('inert');
  });
});

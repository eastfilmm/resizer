import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore, Provider } from 'jotai';
import { BackgroundPanel } from '../../components/panels/BackgroundPanel';
import { FocusReveal } from '@resizer/ui';
import {
  backgroundColorAtom,
  backgroundSoftnessAtom,
  DEFAULT_IMAGE_SETTINGS,
} from '../../atoms/imageAtoms';
import { act } from '@testing-library/react';

const setup = () => {
  const store = createStore();
  render(
    // 실제로는 NavigationBar가 패널을 FocusReveal.Root로 감싼다
    <Provider store={store}>
      <FocusReveal.Root>
        <BackgroundPanel />
      </FocusReveal.Root>
    </Provider>,
  );
  return { store };
};

const checked = () =>
  screen.getAllByRole('radio').filter((swatch) => swatch.getAttribute('aria-checked') === 'true');

describe('BackgroundPanel', () => {
  it('무지개 7색과 흰·검을 처음부터 한 줄로 보여준다', () => {
    setup();

    expect(screen.getAllByRole('radio').map((swatch) => swatch.getAttribute('aria-label'))).toEqual([
      'Red',
      'Orange',
      'Yellow',
      'Green',
      'Blue',
      'Indigo',
      'Violet',
      'White',
      'Black',
    ]);
  });

  it('기본은 흰색이 선택돼 있다', () => {
    setup();

    expect(DEFAULT_IMAGE_SETTINGS.backgroundColor).toBe('white');
    expect(checked().map((swatch) => swatch.getAttribute('aria-label'))).toEqual(['White']);
  });

  it('색을 누르면 배경색이 바뀌고 그 칸만 선택된다', async () => {
    const { store } = setup();

    await userEvent.click(screen.getByRole('radio', { name: 'Blue' }));

    expect(store.get(backgroundColorAtom)).toBe('blue');
    expect(checked().map((swatch) => swatch.getAttribute('aria-label'))).toEqual(['Blue']);
  });

  it('Soft는 배경에만 적용하고 띠는 원색으로 둔다', () => {
    const { store } = setup();
    expect(DEFAULT_IMAGE_SETTINGS.backgroundSoftness).toBe(50);

    act(() => store.set(backgroundSoftnessAtom, 100));

    const red = screen.getByRole('radio', { name: 'Red' });
    expect(red.style.backgroundColor).toBe('rgb(229, 57, 53)'); // #E53935
  });

  it('검정을 고르면 Soft를 접고, 다른 색으로 돌아오면 값 그대로 다시 연다', async () => {
    const { store } = setup();
    const softRow = () => screen.getByRole('slider', { hidden: true }).closest('[inert]');
    act(() => store.set(backgroundSoftnessAtom, 30));
    expect(softRow()).toBeNull();

    await userEvent.click(screen.getByRole('radio', { name: 'Black' }));
    expect(softRow()).not.toBeNull();

    await userEvent.click(screen.getByRole('radio', { name: 'Red' }));
    expect(softRow()).toBeNull();
    expect(store.get(backgroundSoftnessAtom)).toBe(30);
  });
});


import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore, Provider } from 'jotai';
import { BackgroundPanel } from '../../components/panels/BackgroundPanel';
import { backgroundColorAtom, DEFAULT_IMAGE_SETTINGS } from '../../atoms/imageAtoms';

const setup = () => {
  const store = createStore();
  render(
    <Provider store={store}>
      <BackgroundPanel />
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
});

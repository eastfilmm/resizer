import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore, Provider } from 'jotai';
import { FramePanel } from '../../components/panels/FramePanel';
import { imageSettingsAtom, uploadedImagesAtom } from '../../atoms/imageAtoms';

/**
 * 폴라로이드 날짜는 입력이 없으면 사진 촬영일을 보여주고, 사용자가 지운 날짜는
 * 패널을 다시 열거나 Polaroid를 껐다 켜도 촬영일로 되살아나지 않아야 한다.
 */
const setup = () => {
  const store = createStore();
  store.set(uploadedImagesAtom, [
    { id: 'a', fileName: 'a.jpg', objectUrl: 'blob:a', photoDate: '2023.07.14' },
  ]);
  const mount = () =>
    render(
      <Provider store={store}>
        <FramePanel />
      </Provider>,
    );
  return { store, mount };
};

const dateInput = () => screen.getByPlaceholderText('e.g. 2024.01.01') as HTMLInputElement;

describe('FramePanel 날짜', () => {
  it('Polaroid를 켜면 사진 촬영일을 보여준다', async () => {
    const { mount } = setup();
    mount();

    await userEvent.click(screen.getByRole('button', { name: 'Polaroid' }));

    expect(dateInput().value).toBe('2023.07.14');
  });

  it('지운 날짜는 패널을 다시 열어도 돌아오지 않는다', async () => {
    const { store, mount } = setup();
    const first = mount();
    await userEvent.click(screen.getByRole('button', { name: 'Polaroid' }));
    await userEvent.click(screen.getByRole('button', { name: '×' }));
    expect(dateInput().value).toBe('');

    first.unmount();
    mount();

    expect(dateInput().value).toBe('');
    expect(store.get(imageSettingsAtom).polaroidDate).toBe('');
  });

  it('지운 날짜는 Polaroid를 껐다 켜도 돌아오지 않는다', async () => {
    const { mount } = setup();
    mount();
    const polaroid = screen.getByRole('button', { name: 'Polaroid' });
    await userEvent.click(polaroid);
    await userEvent.click(screen.getByRole('button', { name: '×' }));

    await userEvent.click(polaroid);
    await userEvent.click(polaroid);

    expect(dateInput().value).toBe('');
  });

  it('직접 고친 날짜는 패널을 다시 열어도 유지된다', async () => {
    const { mount } = setup();
    const first = mount();
    await userEvent.click(screen.getByRole('button', { name: 'Polaroid' }));
    await userEvent.clear(dateInput());
    await userEvent.type(dateInput(), '1999.12.31');

    first.unmount();
    mount();

    expect(dateInput().value).toBe('1999.12.31');
  });
});

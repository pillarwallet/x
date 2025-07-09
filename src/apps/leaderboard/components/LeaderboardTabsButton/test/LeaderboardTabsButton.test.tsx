import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

// store
import { store } from '../../../../../store';

// hooks
import * as reducerHooks from '../../../hooks/useReducerHooks';

// reducer
import { setTimeTab } from '../../../reducer/LeaderboardSlice';

// components
import LeaderboardTabsButton from '../LeaderboardTabsButton';

describe('<LeaderboardTabsButton />', () => {
  const useAppSelectorMock = vi.spyOn(reducerHooks, 'useAppSelector');
  const useAppDispatchMock = vi.spyOn(reducerHooks, 'useAppDispatch');

  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAppDispatchMock.mockReturnValue(mockDispatch);
  });

  it('matches snapshot', () => {
    useAppSelectorMock.mockReturnValue('weekly');

    const { container } = render(
      <Provider store={store}>
        <LeaderboardTabsButton />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it('renders both buttons', () => {
    useAppSelectorMock.mockReturnValue('weekly');

    render(
      <Provider store={store}>
        <LeaderboardTabsButton />
      </Provider>
    );

    expect(screen.getByRole('button', { name: /weekly/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /all time/i })
    ).toBeInTheDocument();
  });

  it('dispatches setTimeTab("all") when "All Time" is clicked', () => {
    useAppSelectorMock.mockReturnValue('weekly');

    render(
      <Provider store={store}>
        <LeaderboardTabsButton />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /all time/i }));
    expect(mockDispatch).toHaveBeenCalledWith(setTimeTab('all'));
  });

  it('dispatches setTimeTab("weekly") when "Weekly" is clicked', () => {
    useAppSelectorMock.mockReturnValue('all');

    render(
      <Provider store={store}>
        <LeaderboardTabsButton />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /weekly/i }));
    expect(mockDispatch).toHaveBeenCalledWith(setTimeTab('weekly'));
  });

  it('does not dispatch if clicking already active tab', () => {
    useAppSelectorMock.mockReturnValue('weekly');

    render(
      <Provider store={store}>
        <LeaderboardTabsButton />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /weekly/i }));

    expect(mockDispatch).toHaveBeenCalledWith(setTimeTab('weekly'));
  });
});

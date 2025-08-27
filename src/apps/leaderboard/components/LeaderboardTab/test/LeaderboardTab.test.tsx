import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { Mock, vi } from 'vitest';

// types
import {
  LeaderboardRankChange,
  LeaderboardTableData,
} from '../../../../../types/api';

// components
import useTransactionKit from '../../../../../hooks/useTransactionKit';
import LeaderboardTab from '../LeaderboardTab';

vi.mock('../../../../../hooks/useTransactionKit');

const mockData: LeaderboardTableData[] = Array.from({ length: 25 }, (_, i) => ({
  addresses: [`0xAddress${i + 1}`],
  totalPoints: (i + 1) * 100,
  totalAmountUsd: (i + 1) * 50,
  rankChange: LeaderboardRankChange.NO_CHANGE,
  completedSwap: false,
  totalGas: (i + 1) * 10,
}));

describe('<LeaderboardTab />', () => {
  const mockWalletAddress = '0xAddress1';
  const useTransactionKitMock = useTransactionKit as unknown as Mock;

  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;

    useTransactionKitMock.mockReturnValue({
      walletAddress: '0x1234567890123456789012345678901234567890',
      kit: {},
    });
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<LeaderboardTab data={mockData} timeTab="all" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays initial 10 items', () => {
    render(<LeaderboardTab data={mockData} timeTab="all" />);

    expect(screen.getAllByTestId('leaderboard-user-data')).toHaveLength(10);
  });

  it('loads more items when clicking "Loading more"', () => {
    render(<LeaderboardTab data={mockData} timeTab="all" />);

    const loadMoreDiv = screen.getByText(/Loading more/i);
    fireEvent.click(loadMoreDiv);

    expect(screen.getAllByTestId('leaderboard-user-data')).toHaveLength(20);

    fireEvent.click(loadMoreDiv);

    expect(screen.getAllByTestId('leaderboard-user-data')).toHaveLength(25);
  });

  it('hides "Loading more" when all items are displayed', () => {
    render(<LeaderboardTab data={mockData} timeTab="all" />);

    const loadMoreDiv = screen.getByText(/Loading more/i);
    fireEvent.click(loadMoreDiv); // Loading more to 20
    fireEvent.click(loadMoreDiv); // Loading more to 25

    expect(screen.queryByText(/Loading more/i)).not.toBeInTheDocument();
  });

  it('displays "My rank" section if wallet address is in the data', () => {
    useTransactionKitMock.mockReturnValue({
      walletAddress: mockWalletAddress,
      kit: {},
    });
    render(<LeaderboardTab data={mockData} timeTab="all" />);

    expect(screen.getByText('My rank')).toBeInTheDocument();
    expect(
      screen.getAllByText(new RegExp(mockWalletAddress, 'i')).length
    ).toBeGreaterThanOrEqual(2);
  });

  it('does not display "My rank" section if wallet address is not in the data', () => {
    useTransactionKitMock.mockReturnValue({
      walletAddress: '0xNotInData',
      kit: {},
    });
    render(<LeaderboardTab data={mockData} timeTab="all" />);

    expect(screen.queryByText('My rank')).not.toBeInTheDocument();
  });

  it('hides the "Loading more" when all items are visible and no more data is available', () => {
    render(<LeaderboardTab data={mockData} timeTab="all" />);

    const loadMoreDiv = screen.getByText(/Loading more/i);
    fireEvent.click(loadMoreDiv);
    fireEvent.click(loadMoreDiv);
    fireEvent.click(loadMoreDiv);

    expect(screen.queryByText(/Loading more/i)).not.toBeInTheDocument();
  });
});

import * as TransactionKit from '@etherspot/transaction-kit';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// types
import {
  LeaderboardRankChange,
  PointsResult,
  WeeklyLeaderboardData,
} from '../../../../../types/api';

// components
import LeaderboardTab from '../LeaderboardTab';

const mockData: (WeeklyLeaderboardData | PointsResult)[] = Array.from(
  { length: 25 },
  (_, i) => ({
    address: `0xAddress${i + 1}`,
    points: (i + 1) * 100,
    totalGasUsed: (i + 1) * 10,
    pointsPerChain: {
      '100': i + 7,
      '137': i + 160,
      '8453': i + 40,
    },
    transactionCount: {
      '100': i + 7,
      '137': i + 8,
      '8453': i + 2,
    },
    gasCount: {
      '100': i + 1863679,
      '137': i + 1816553,
      '8453': i + 415853,
    },
    rankChange: LeaderboardRankChange.NO_CHANGE,
  })
);

const mockWalletAddress = '0xAddress1';

describe('<LeaderboardTab />', () => {
  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<LeaderboardTab data={mockData} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays initial 10 items', () => {
    render(<LeaderboardTab data={mockData} />);

    expect(screen.getAllByTestId('leaderboard-user-data')).toHaveLength(10);
  });

  it('loads more items when clicking "Load more" ', () => {
    render(<LeaderboardTab data={mockData} />);

    const loadMoreDiv = screen.getByText(/Load more/i);
    fireEvent.click(loadMoreDiv);

    expect(screen.getAllByTestId('leaderboard-user-data')).toHaveLength(20);

    fireEvent.click(loadMoreDiv);

    expect(screen.getAllByTestId('leaderboard-user-data')).toHaveLength(25);
  });

  it('hides "Load more" when all items are displayed', () => {
    render(<LeaderboardTab data={mockData} />);

    const loadMoreDiv = screen.getByText(/Load more/i);
    fireEvent.click(loadMoreDiv); // Load more to 20
    fireEvent.click(loadMoreDiv); // Load more to 25

    expect(screen.queryByText(/Load more/i)).not.toBeInTheDocument();
  });

  it('displays "My rank" section if wallet address is in the data', () => {
    jest
      .spyOn(TransactionKit, 'useWalletAddress')
      .mockReturnValue(mockWalletAddress);

    render(<LeaderboardTab data={mockData} />);

    expect(screen.getByText('My rank')).toBeInTheDocument();
    expect(screen.getByText('PX Points')).toBeInTheDocument();
    expect(screen.getAllByText('0xAddress1')).toHaveLength(2);
  });

  it('does not display "My rank" section if wallet address is not in the data', () => {
    const mockDataWithoutWallet = mockData.filter(
      (entry) => entry.address !== mockWalletAddress
    );

    render(<LeaderboardTab data={mockDataWithoutWallet} />);

    expect(screen.queryByText('My rank')).not.toBeInTheDocument();
  });

  it('hides the "Load more" when all items are visible and no more data is available', () => {
    render(<LeaderboardTab data={mockData} />);

    const loadMoreDiv = screen.getByText(/Load more/i);
    fireEvent.click(loadMoreDiv);
    fireEvent.click(loadMoreDiv);
    fireEvent.click(loadMoreDiv);

    expect(screen.queryByText(/Load more/i)).not.toBeInTheDocument();
  });
});

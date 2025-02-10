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

describe('<LeaderboardTab />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<LeaderboardTab data={mockData} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays initial 10 items', () => {
    render(<LeaderboardTab data={mockData} />);

    expect(screen.getAllByTestId('leaderboard-user-data')).toHaveLength(10);
  });

  it('loads more items when clicking "Load more" button', () => {
    render(<LeaderboardTab data={mockData} />);

    const loadMoreButton = screen.getByRole('button', { name: /Load more/i });
    fireEvent.click(loadMoreButton);

    expect(screen.getAllByTestId('leaderboard-user-data')).toHaveLength(20);

    fireEvent.click(loadMoreButton);

    expect(screen.getAllByTestId('leaderboard-user-data')).toHaveLength(25);
  });

  it('hides "Load more" button when all items are displayed', () => {
    render(<LeaderboardTab data={mockData} />);

    const loadMoreButton = screen.getByRole('button', { name: /Load more/i });
    fireEvent.click(loadMoreButton);
    fireEvent.click(loadMoreButton);

    expect(
      screen.queryByRole('button', { name: /Load more/i })
    ).not.toBeInTheDocument();
  });
});

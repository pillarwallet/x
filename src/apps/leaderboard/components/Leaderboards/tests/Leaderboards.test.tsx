import { render, screen } from '@testing-library/react';

// components
import SkeletonLoader from '../../../../../components/SkeletonLoader';
import LeaderboardTab from '../../LeaderboardTab/LeaderboardTab';
import Leaderboards from '../Leaderboards';

jest.mock('../../LeaderboardTab/LeaderboardTab', () =>
  jest.fn(() => <div>LeaderboardTab Mock</div>)
);
jest.mock('../../../../../components/SkeletonLoader', () =>
  jest.fn(() => <div>SkeletonLoader Mock</div>)
);

describe('Leaderboards Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders 3 SkeletonLoader components when loading', () => {
    render(<Leaderboards isLoading isError={false} isSuccess={false} />);

    expect(SkeletonLoader).toHaveBeenCalledTimes(3);
    expect(screen.getAllByText('SkeletonLoader Mock')).toHaveLength(3);
  });

  it('renders error message when isError is true', () => {
    const customError = 'Custom error message';
    render(
      <Leaderboards
        isLoading={false}
        isError
        isSuccess={false}
        errorMessage={customError}
      />
    );

    expect(screen.getByText(customError)).toBeInTheDocument();
  });

  it('renders default error message if errorMessage not provided', () => {
    render(<Leaderboards isLoading={false} isError isSuccess={false} />);

    expect(
      screen.getByText('Failed to load data. Please try again later.')
    ).toBeInTheDocument();
  });

  it('renders LeaderboardTab when success and data available', () => {
    const mockData = [
      {
        totalPoints: 100,
        totalAmountUsd: 50,
        addresses: ['0xAddress1'],
      },
    ];
    render(
      <Leaderboards
        isLoading={false}
        isError={false}
        isSuccess
        data={mockData}
      />
    );

    expect(screen.getByText('LeaderboardTab Mock')).toBeInTheDocument();
    expect(LeaderboardTab).toHaveBeenCalledWith({ data: mockData }, {});
  });

  it('renders noDataMessage when success but no data', () => {
    const customNoData = 'No leaderboard data yet!';
    render(
      <Leaderboards
        isLoading={false}
        isError={false}
        isSuccess
        data={[]}
        noDataMessage={customNoData}
      />
    );

    expect(screen.getByText(customNoData)).toBeInTheDocument();
  });

  it('renders default noDataMessage when none provided', () => {
    render(
      <Leaderboards isLoading={false} isError={false} isSuccess data={[]} />
    );

    expect(screen.getByText('No available data.')).toBeInTheDocument();
  });

  it('renders null if no matching state', () => {
    const { container } = render(
      <Leaderboards isLoading={false} isError={false} isSuccess={false} />
    );

    expect(container.firstChild).toBeNull();
  });
});

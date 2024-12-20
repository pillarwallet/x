import { fireEvent, render, screen } from '@testing-library/react';

// types
import { ApiLayout, Points, Projection } from '../../../../../types/api';

// components
import PointsTile from '../PointsTile';

const mockPointsData: Projection = {
  meta: {
    display: {
      title: 'My Points Tile',
    },
  },
  data: {
    address: {
      points: {
        total: 500,
        lastWeek: 120,
      },
      ranking: {
        global: 5,
        leaderboardPosition: 3,
      },
    },
    drops: {
      upcoming: {
        timestamp: 1672540800,
      },
    },
    referrals: {
      code: 'PILLARX123',
      href: 'https://pillarx.com/referral',
    },
  } as Points,
  layout: ApiLayout.PXPOINTS,
  id: 'points-tile',
};

describe('<PointsTile />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = render(
      <PointsTile data={mockPointsData} isDataLoading={false} />
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders all data correctly', () => {
    render(<PointsTile data={mockPointsData} isDataLoading={false} />);

    expect(screen.getByText('My Points Tile')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('My PX points')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Current ranking')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('Earned last week')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Weekly ranking')).toBeInTheDocument();
    expect(screen.getByText('Next drop')).toBeInTheDocument();
    expect(screen.getByText('Share with friends')).toBeInTheDocument();
    expect(screen.getByText('PILLARX123')).toBeInTheDocument();
    expect(
      screen.getByTestId('points-fornatted-timestamp')
    ).toBeInTheDocument();
  });

  it('renders referral code and copy button', () => {
    render(<PointsTile data={mockPointsData} isDataLoading={false} />);

    const copyButton = screen.getByText('Copy');
    const copyIcon = screen.getByTestId('copy-icon');

    expect(copyIcon).toBeInTheDocument();

    fireEvent.click(copyButton);

    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('copy-success-icon')).not.toBeInTheDocument();
  });

  it('does not render when data is loading', () => {
    render(<PointsTile data={mockPointsData} isDataLoading />);

    expect(screen.queryByText('My Points Tile')).not.toBeInTheDocument();
    expect(screen.queryByText('500')).not.toBeInTheDocument();
  });

  it('does not render without data', () => {
    render(<PointsTile data={undefined} isDataLoading={false} />);

    expect(screen.queryByText('My Points Tile')).not.toBeInTheDocument();
    expect(screen.queryByText('500')).not.toBeInTheDocument();
  });
});

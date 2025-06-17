import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// types
import { LeaderboardRankChange } from '../../../../../types/api';

// components
import UserInfo from '../UserInfo';

jest.mock('../../RandomAvatar/RandomAvatar', () => ({
  __esModule: true,
  default: function MockAvatar() {
    return <div data-testid="mock-avatar">Avatar</div>;
  },
}));

const resizeWindow = (width: number) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

describe('<UserInfo />', () => {
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<UserInfo rank={1} walletAddress={walletAddress} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows walletAddress for desktop and tablet width', () => {
    resizeWindow(800);
    render(<UserInfo rank={1} walletAddress={walletAddress} />);
    expect(screen.getByText(/0x12345678...12345678/)).toBeInTheDocument();
  });

  it('shows shortened walletAddress for mobile width', () => {
    resizeWindow(500);
    render(<UserInfo rank={1} walletAddress={walletAddress} />);
    expect(screen.getByText(/0x123...5678/)).toBeInTheDocument();
  });

  it('shows shortened walletAddress for very small mobile width', () => {
    resizeWindow(300);
    render(<UserInfo rank={1} walletAddress={walletAddress} />);
    expect(screen.getByText(/0x12345\.\.\./)).toBeInTheDocument();
  });

  it('renders avatar', () => {
    render(<UserInfo rank={1} walletAddress={walletAddress} />);
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
  });

  it('displays rank and tooltip', () => {
    render(<UserInfo rank={42} walletAddress={walletAddress} />);
    expect(screen.getAllByText('#42')[0]).toBeInTheDocument();
  });

  it('shows username when provided', () => {
    render(
      <UserInfo
        rank={1}
        walletAddress={walletAddress}
        username="blockuser.eth"
      />
    );
    expect(screen.getByText('blockuser.eth')).toBeInTheDocument();
  });

  it('shows rank decrease icon', () => {
    render(
      <UserInfo
        rank={1}
        walletAddress={walletAddress}
        rankChange={LeaderboardRankChange.DECREASED}
      />
    );
    expect(screen.getByTestId('leaderboard-rank-up')).toBeInTheDocument();
  });

  it('shows rank increase icon', () => {
    render(
      <UserInfo
        rank={1}
        walletAddress={walletAddress}
        rankChange={LeaderboardRankChange.INCREASED}
      />
    );
    expect(screen.getByTestId('leaderboard-rank-down')).toBeInTheDocument();
  });

  it('does not show rank change icon if NO_CHANGE', () => {
    render(
      <UserInfo
        rank={1}
        walletAddress={walletAddress}
        rankChange={LeaderboardRankChange.NO_CHANGE}
      />
    );
    expect(
      screen.queryByTestId(/leaderboard-rank-(up|down)/)
    ).not.toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// types
import { LeaderboardRankChange } from '../../../../../types/api';

// components
import UserInfo from '../UserInfo';

describe('<UserInfo />', () => {
  const mockUser = {
    rank: 1,
    walletAddress: '0x1234567890abcdef',
    rankChange: LeaderboardRankChange.INCREASED,
    username: 'User1',
  };

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <UserInfo
          rank={mockUser.rank}
          walletAddress={mockUser.walletAddress}
          rankChange={mockUser.rankChange}
          username={mockUser.username}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays the correct rank and username', () => {
    render(
      <UserInfo
        rank={mockUser.rank}
        walletAddress={mockUser.walletAddress}
        rankChange={mockUser.rankChange}
        username={mockUser.username}
      />
    );
    expect(screen.getAllByText(`#${mockUser.rank}`)).toHaveLength(2);
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
  });

  it('displays truncated wallet address', () => {
    render(
      <UserInfo
        rank={mockUser.rank}
        walletAddress={mockUser.walletAddress}
        rankChange={mockUser.rankChange}
        username={mockUser.username}
      />
    );
    expect(screen.getByText(/0x1234.*cdef/)).toBeInTheDocument();
  });

  it('shows copy success icon when copying', () => {
    render(
      <UserInfo
        rank={mockUser.rank}
        walletAddress={mockUser.walletAddress}
        rankChange={mockUser.rankChange}
        username={mockUser.username}
      />
    );
    fireEvent.click(screen.getByTestId('copy-icon'));
    expect(screen.getByTestId('copy-success-icon')).toBeInTheDocument();
  });

  it('displays the correct rank change icon if rank down', () => {
    render(
      <UserInfo
        rank={mockUser.rank}
        walletAddress={mockUser.walletAddress}
        rankChange={mockUser.rankChange}
        username={mockUser.username}
      />
    );
    expect(screen.getByTestId('leaderboard-rank-down')).toBeInTheDocument();
  });

  it('displays the correct rank change icon if rank up', () => {
    render(
      <UserInfo
        rank={mockUser.rank}
        walletAddress={mockUser.walletAddress}
        rankChange={LeaderboardRankChange.DECREASED}
        username={mockUser.username}
      />
    );
    expect(screen.getByTestId('leaderboard-rank-up')).toBeInTheDocument();
  });

  it('does not display any icon if rank change is same', () => {
    render(
      <UserInfo
        rank={mockUser.rank}
        walletAddress={mockUser.walletAddress}
        rankChange={LeaderboardRankChange.NO_CHANGE}
        username={mockUser.username}
      />
    );
    expect(screen.queryByTestId('leaderboard-rank-up')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('leaderboard-rank-down')
    ).not.toBeInTheDocument();
  });

  it('does not display username if does not exists', () => {
    render(
      <UserInfo
        rank={mockUser.rank}
        walletAddress={mockUser.walletAddress}
        rankChange={mockUser.rankChange}
      />
    );
    expect(screen.queryByText(mockUser.username)).not.toBeInTheDocument();
  });
});

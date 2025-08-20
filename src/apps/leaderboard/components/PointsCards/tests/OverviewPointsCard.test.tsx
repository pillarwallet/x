import { render, screen } from '@testing-library/react';

// components
import {
  LeaderboardRankChange,
  LeaderboardTableData,
} from '../../../../../types/api';
import OverviewPointsCard from '../OverviewPointsCard';

const myAllTimeMergedMock: LeaderboardTableData = {
  totalPoints: 1234,
  totalAmountUsd: 10000,
  addresses: ['0xabc123456789def'],
  totalGas: 98765,
};

const myWeeklyMergedMock: LeaderboardTableData = {
  totalPoints: 345,
  totalAmountUsd: 200,
  addresses: ['0xabc123456789def'],
  completedSwap: true,
  totalGas: 78765,
  rankChange: LeaderboardRankChange.INCREASED,
};

describe('OverviewPointsCard', () => {
  it('matches snapshot with full data', () => {
    const { container } = render(
      <OverviewPointsCard
        myAllTimeMerged={{ entry: myAllTimeMergedMock, index: 4 }}
        myWeeklyMerged={{ entry: myWeeklyMergedMock, index: 9 }}
        timeTab="all"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with empty data', () => {
    const { container } = render(
      <OverviewPointsCard
        myAllTimeMerged={{ entry: undefined, index: -1 }}
        myWeeklyMerged={{ entry: undefined, index: -1 }}
        timeTab="all"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders all sections with valid data', () => {
    render(
      <OverviewPointsCard
        myAllTimeMerged={{ entry: myAllTimeMergedMock, index: 0 }}
        myWeeklyMerged={{ entry: myWeeklyMergedMock, index: 2 }}
        timeTab="all"
      />
    );

    expect(screen.getByText('My PX Overview')).toBeInTheDocument();
    expect(screen.getByText('PX Points')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Current Rank')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Weekly Rank')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('345')).toBeInTheDocument();
    expect(screen.getByText('Earned This Week')).toBeInTheDocument();
  });

  it('shows fallback for missing data', () => {
    render(
      <OverviewPointsCard
        myAllTimeMerged={{ entry: undefined, index: -1 }}
        myWeeklyMerged={{ entry: undefined, index: -1 }}
        timeTab="all"
      />
    );

    expect(screen.getAllByText('-').length).toBe(4);
  });
});

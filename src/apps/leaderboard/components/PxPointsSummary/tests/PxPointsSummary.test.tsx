import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// types
import type { Mock } from 'vitest';
import {
  LeaderboardRankChange,
  LeaderboardTableData,
} from '../../../../../types/api';

// components
import PxPointsSummary from '../PxPointsSummary';
import useTransactionKit from '../../../../../hooks/useTransactionKit';

// mock subcomponents
vi.mock('../../PointsCards/GasNewDropCard', () => ({
  __esModule: true,
  default: function GasNewDropCard() {
    return <div>GasNewDropCard</div>;
  },
}));

vi.mock('../../PointsCards/OverviewPointsCard', () => ({
  __esModule: true,
  default: function OverviewPointsCard() {
    return <div>OverviewPointsCard</div>;
  },
}));

vi.mock('../../PointsCards/PointsCard', () => ({
  __esModule: true,
  default: function PointsCard(props: { title: string }) {
    return <div>{props.title} PointsCard</div>;
  },
}));

vi.mock('../../Typography/BodySmall', () => ({
  __esModule: true,
  default: function BodySmall(props: { children: React.ReactNode }) {
    return <div>{props.children}</div>;
  },
}));

vi.mock('../../../../../hooks/useTransactionKit');

describe('<PxPointsSummary />', () => {
  const mockWallet = '0x1234';
  const useTransactionKitMock = useTransactionKit as unknown as Mock;

  const allTimeTradingDataMock: LeaderboardTableData[] = [
    {
      totalPoints: 1200,
      totalAmountUsd: 500000,
      addresses: ['0x1234', '0x456def'],
      totalGas: 35000,
    },
    {
      totalPoints: 1100,
      totalAmountUsd: 450000,
      addresses: ['0x789ghi'],
      totalGas: 30000,
    },
  ];

  const allTimeMigrationDataMock: LeaderboardTableData[] = [
    {
      totalPoints: 900,
      totalAmountUsd: 200000,
      addresses: ['0x1234'],
      totalGas: 15000,
    },
    {
      totalPoints: 850,
      totalAmountUsd: 180000,
      addresses: ['0xdef456', '0xghi789'],
      totalGas: 14000,
    },
  ];

  const mergedAllTimeDataMock: LeaderboardTableData[] = [
    {
      totalPoints: 2100,
      totalAmountUsd: 700000,
      addresses: ['0x1234', '0x789ghi'],
      totalGas: 50000,
    },
    {
      totalPoints: 1950,
      totalAmountUsd: 630000,
      addresses: ['0xdef456', '0x456def'],
      totalGas: 44000,
    },
  ];

  const mergedWeeklyTimeDataMock: LeaderboardTableData[] = [
    {
      totalPoints: 350,
      totalAmountUsd: 120000,
      addresses: ['0x1234'],
      completedSwap: true,
      totalGas: 8000,
      rankChange: LeaderboardRankChange.INCREASED,
    },
    {
      totalPoints: 300,
      totalAmountUsd: 100000,
      addresses: ['0xdef456'],
      completedSwap: false,
      totalGas: 7500,
      rankChange: LeaderboardRankChange.NO_CHANGE,
    },
  ];

  beforeEach(() => {
    useTransactionKitMock.mockReturnValue({
      walletAddress: mockWallet,
      kit: {},
      activeChainId: 1,
      setActiveChainId: vi.fn(),
    });
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(
      <PxPointsSummary
        allTimeTradingData={allTimeTradingDataMock}
        allTimeMigrationData={allTimeMigrationDataMock}
        mergedAllTimeData={mergedAllTimeDataMock}
        mergedWeeklyTimeData={mergedWeeklyTimeDataMock}
        isUserInMigrationData
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('renders full Px Points summary with all sections when user is present in all data sets', () => {
    render(
      <PxPointsSummary
        allTimeTradingData={allTimeTradingDataMock}
        allTimeMigrationData={allTimeMigrationDataMock}
        mergedAllTimeData={mergedAllTimeDataMock}
        mergedWeeklyTimeData={mergedWeeklyTimeDataMock}
        isUserInMigrationData
      />
    );

    expect(screen.getByText('My PX Points')).toBeInTheDocument();
    expect(screen.getByText('Qualified')).toBeInTheDocument();
    expect(screen.getByText('OverviewPointsCard')).toBeInTheDocument();
    expect(screen.getByText('Migration PointsCard')).toBeInTheDocument();
    expect(screen.getByText('Trading PointsCard')).toBeInTheDocument();
    expect(screen.getByText('GasNewDropCard')).toBeInTheDocument();
  });

  it('does not show migration card if isUserInMigrationData is false', () => {
    render(
      <PxPointsSummary
        allTimeTradingData={allTimeTradingDataMock}
        allTimeMigrationData={[]}
        mergedAllTimeData={mergedAllTimeDataMock}
        mergedWeeklyTimeData={mergedWeeklyTimeDataMock}
        isUserInMigrationData={false}
      />
    );

    expect(screen.getByText('My PX Points')).toBeInTheDocument();
    expect(screen.queryByText('Migration PointsCard')).not.toBeInTheDocument();
    expect(screen.getByText('Trading PointsCard')).toBeInTheDocument();
  });

  it('does not show lottery badge if user is not eligible', () => {
    const newMergedWeeklyTimeDataMock = mergedWeeklyTimeDataMock.map(
      (entry, index) =>
        index === 0 ? { ...entry, completedSwap: false } : entry
    );

    render(
      <PxPointsSummary
        allTimeTradingData={allTimeTradingDataMock}
        allTimeMigrationData={[]}
        mergedAllTimeData={mergedAllTimeDataMock}
        mergedWeeklyTimeData={newMergedWeeklyTimeDataMock}
        isUserInMigrationData={false}
      />
    );

    expect(screen.queryByText('Qualified')).not.toBeInTheDocument();
  });

  it('handles no wallet address gracefully', () => {
    useTransactionKitMock.mockReturnValue({
      walletAddress: undefined,
      kit: {},
      activeChainId: 1,
      setActiveChainId: vi.fn(),
    });

    render(
      <PxPointsSummary
        allTimeTradingData={[]}
        allTimeMigrationData={[]}
        mergedAllTimeData={[]}
        mergedWeeklyTimeData={[]}
        isUserInMigrationData={false}
      />
    );

    expect(screen.getByText('My PX Points')).toBeInTheDocument();
    expect(screen.getByText('OverviewPointsCard')).toBeInTheDocument(); // still renders overview
    expect(screen.getByText('Trading PointsCard')).toBeInTheDocument(); // with 0 points
  });
});

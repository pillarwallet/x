// types
import { LeaderboardTableData } from '../../../../types/api';

// components
import SkeletonLoader from '../../../../components/SkeletonLoader';
import LeaderboardTab from '../LeaderboardTab/LeaderboardTab';
import Body from '../Typography/Body';

interface LeaderboardsProps {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  data?: LeaderboardTableData[];
  errorMessage?: string;
  noDataMessage?: string;
  timeTab: 'all' | 'weekly';
}

const Leaderboards = ({
  isLoading,
  isError,
  isSuccess,
  data,
  errorMessage = 'Failed to load data. Please try again later.',
  noDataMessage = 'No available data.',
  timeTab,
}: LeaderboardsProps) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col">
        {[...Array(3)].map((_, index) => (
          <SkeletonLoader
            key={index}
            $height="50px"
            $radius="6px"
            $marginBottom="16px"
          />
        ))}
      </div>
    );
  }

  // Error State
  if (isError) {
    return <Body className="text-percentage_red">{errorMessage}</Body>;
  }

  // Success State with Data
  if (isSuccess && data && data.length > 0) {
    return <LeaderboardTab data={data} timeTab={timeTab} />;
  }

  // Success State but No Data
  if (isSuccess && (!data || data.length === 0)) {
    return <Body>{noDataMessage}</Body>;
  }

  // If none of the above conditions are met we return null
  return null;
};

export default Leaderboards;

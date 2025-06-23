import { useCallback } from 'react';

// types
import { LeaderboardRankChange } from '../../../types/api';

export const useRankComparison = () => {
  return useCallback((currentIndex: number, previousIndex: number) => {
    if (currentIndex === previousIndex) return LeaderboardRankChange.NO_CHANGE;
    return currentIndex > previousIndex
      ? LeaderboardRankChange.INCREASED
      : LeaderboardRankChange.DECREASED;
  }, []);
};

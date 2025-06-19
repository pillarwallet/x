import { DateTime } from 'luxon';
import { useMemo } from 'react';

export const useDateRanges = () => {
  return useMemo(() => {
    const now = DateTime.now();
    return {
      currentMonday: now.startOf('week').toUnixInteger(),
      currentSunday: now.endOf('week').toUnixInteger(),
      lastMonday: now.startOf('week').minus({ weeks: 1 }).toUnixInteger(),
      lastSunday: now.endOf('week').minus({ weeks: 1 }).toUnixInteger(),
    };
  }, []);
};

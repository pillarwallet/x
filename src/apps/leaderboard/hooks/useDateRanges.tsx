import { DateTime } from 'luxon';
import { useMemo } from 'react';

export const useDateRanges = () => {
  const now = DateTime.now();
  return useMemo(() => {
    return {
      currentMonday: now.startOf('week').toUnixInteger(),
      currentSunday: now.endOf('week').toUnixInteger(),
      lastMonday: now.startOf('week').minus({ weeks: 1 }).toUnixInteger(),
      lastSunday: now.endOf('week').minus({ weeks: 1 }).toUnixInteger(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now.weekNumber]); // re-evaluate when the week changes
};

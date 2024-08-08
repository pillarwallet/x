import dayjs from 'dayjs';
import { useEffect, useReducer } from 'react';

const useCountdown = (timestamp: string, disabled = false) => {
    const forceUpdate = useReducer(() => ({}), {})[1];

    const future = dayjs(timestamp).add(20, 'minutes');
    const now = Date.now();
    const timeout = future.isBefore(now);
    useEffect(() => {
        if (disabled || timeout) {
            return;
        }

        const interval = setInterval(forceUpdate, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [forceUpdate, disabled, timeout]);

    return {
        timeout,
        countdown: future.subtract(now).format('mm:ss'),
    };
};

export default useCountdown;
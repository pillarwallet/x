import { useEffect } from 'react';
import { UseClickOutsideOptions } from '../types/types';

/**
 * Custom hook for handling click outside events
 */
export const useClickOutside = ({
  ref,
  callback,
  condition,
}: UseClickOutsideOptions) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        condition
      ) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, condition]);
};

import { useEffect } from 'react';
import { UseKeyboardNavigationOptions } from '../types/types';

/**
 * Custom hook for handling keyboard navigation
 */
export const useKeyboardNavigation = ({
  onEscape,
  onEnter,
  enabled = true,
}: UseKeyboardNavigationOptions) => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
      }

      if (event.key === 'Enter' && onEnter) {
        event.preventDefault();
        onEnter();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape, onEnter, enabled]);
};

import { useEffect, useState } from 'react';

export const isClientMatchMedia = (query: string): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(query).matches;
};

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => isClientMatchMedia(query));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export const MOBILE_QUERY = '(max-width: 768px)';

export const useIsMobile = (): boolean => useMediaQuery(MOBILE_QUERY);

export const isMobileViewport = (): boolean => isClientMatchMedia(MOBILE_QUERY);



import { useState, useEffect, useRef, useCallback } from 'react';

const useComponentVisible = (initialIsVisible) => {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = useCallback((event) => {
    const isCloseElement =
      event.target.getAttribute('role') && event.target.getAttribute('role') === 'close-dropdown';

    if (ref.current && (!ref.current.contains(event.target) || isCloseElement)) {
      setIsComponentVisible(false);
    }
  }, []);

  useEffect(() => {
    if (isComponentVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isComponentVisible]);

  return { ref, isComponentVisible, setIsComponentVisible };
};

export default useComponentVisible;

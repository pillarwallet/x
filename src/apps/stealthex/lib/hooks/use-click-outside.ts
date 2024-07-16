import { useEffect } from 'react';

import type { RefObject } from 'react';

const useClickOutside = (
  ref: RefObject<Node>,
  callback: (event: Event) => void,
  useCapture = true,
) => {
  useEffect(() => {
    const handleClick = (event: Event) => {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        callback(event);
      }
    };

    window.addEventListener('click', handleClick, useCapture);
    window.addEventListener('touchstart', handleClick, useCapture);

    return () => {
      window.removeEventListener('click', handleClick, useCapture);
      window.removeEventListener('touchstart', handleClick, useCapture);
    };
    // callback is a function so on every render it'll be recreated and useEffect will be called again
    // for sake of optimization you can wrap outer callback in useCallback
  }, [ref, callback, useCapture]);
};

export default useClickOutside;

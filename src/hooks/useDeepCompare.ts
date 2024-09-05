import isEqual from 'lodash/isEqual';
import { useRef } from 'react';

const useDeepCompare = <T>(value: T) => {
  const ref = useRef<T>(value);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
};

export default useDeepCompare;

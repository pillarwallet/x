import { useRef } from 'react';
import isEqual from 'lodash/isEqual';

const useDeepCompare = <T>(value: T) => {
  const ref = useRef<T>(value);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export default useDeepCompare;

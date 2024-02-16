import { useRef } from 'react';
import isEqual from 'lodash/isEqual';

const useDeepCompare = (value: unknown) => {
  const ref = useRef<unknown>(value);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export default useDeepCompare;

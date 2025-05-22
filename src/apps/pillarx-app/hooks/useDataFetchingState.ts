/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

// reducer
import { useAppDispatch } from './useReducerHooks';

export const useDataFetchingState = <T>(
  data: T | undefined,
  isLoading: boolean,
  isFetching: boolean,
  isSuccess: boolean,
  error: any,
  setData: (data: T | undefined) => any,
  setIsLoading: (isLoading: boolean) => any,
  setIsErroring?: (isErroring: boolean) => any
) => {
  const dispatch = useAppDispatch();

  // Update loading state
  useEffect(() => {
    dispatch(setIsLoading(isLoading || isFetching));
  }, [dispatch, isLoading, isFetching, setIsLoading]);

  // Update data and error states
  useEffect(() => {
    const isError = !isLoading && !isFetching && !!error;

    if (data && isSuccess) {
      dispatch(setData(data));
      if (setIsErroring) {
        dispatch(setIsErroring(false));
      }
    } else if (isError) {
      dispatch(setData(undefined));
      if (setIsErroring) {
        dispatch(setIsErroring(true));
      }
    }
  }, [
    dispatch,
    data,
    isSuccess,
    error,
    isLoading,
    isFetching,
    setData,
    setIsErroring,
  ]);
};

import { useEffect, useState } from 'react';
import {
  ExpressIntentResponse,
  UserIntent,
} from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import useIntentSdk from './useIntentSdk';

export default function useExpressIntent(userIntent: UserIntent | null) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expressIntentResponse, setExpressIntentResponse] =
    useState<ExpressIntentResponse | null>(null);
  const { intentSdk } = useIntentSdk();
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    if (intentSdk && userIntent) {
      setIsLoading(true);
      intentSdk
        ?.expressIntent(userIntent)
        .then((response) => {
          setExpressIntentResponse(response);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error in expressIntent: ', error);
          setIsLoading(false);
          setExpressIntentResponse(null);
        });
    } else {
      setExpressIntentResponse(null);
      setIsLoading(false);
    }
  }, [userIntent, intentSdk, refetch]);

  return {
    isLoading,
    expressIntentResponse,
    refetch,
    setRefetch,
  };
}

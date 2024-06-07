import { useMemo } from 'react';
import { ApiLayout, TokenData, WalletPortfolioData } from '../../../types/api';
import { useGetTilesInfoQuery } from '../api/apiSlice';

export const useApiData = () => {
  const { data, isLoading } = useGetTilesInfoQuery('');

  const apiData = useMemo(() => {
    const dataPortlioOverview = data?.projection.find((item) => item.layout === ApiLayout.OVERVIEW)?.data as WalletPortfolioData;
    const dataTokensHorizontal = data?.projection.find((item) => item.layout === ApiLayout.TOKENS_HORIZONTAL)?.data as TokenData[];
    const dataTokensVertical = data?.projection.filter((item) => item.layout === ApiLayout.TOKENS_VERTICAL);
    const dataTokensVerticalLeft = dataTokensVertical?.[0]?.data as TokenData[];
    const dataTokensVerticalRight = dataTokensVertical?.[1]?.data as TokenData[];

    const titleTokensHorizontal = data?.projection.find((item) => item.layout === ApiLayout.TOKENS_HORIZONTAL)?.meta.display.title;
    const titledataTokensVerticalLeft = dataTokensVertical?.[0]?.meta.display.title;
    const titledataTokensVerticalRight = dataTokensVertical?.[1]?.meta.display.title;

    return {
      dataPortlioOverview,
      dataTokensHorizontal,
      dataTokensVertical,
      dataTokensVerticalLeft,
      dataTokensVerticalRight,
      titleTokensHorizontal,
      titledataTokensVerticalLeft,
      titledataTokensVerticalRight,
    };
  }, [data]);

  return {
    isLoading,
    ...apiData,
  };
};

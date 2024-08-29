import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

// types
import { TokenAtlasInfoApiResponse, TokenAtlasGraphApiResponse } from '../../../types/api';

export const tokenInfoApi = createApi({
    reducerPath: 'tokenInfoApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://token-nubpgwxpiq-uc.a.run.app' }),
    endpoints: (builder) => ({
        getTokenInfo: builder.query<TokenAtlasInfoApiResponse, { asset: string; blockchain: string; symbol: string; }>({
            query: ({ asset, blockchain, symbol }) => {
                const blockchainParam = blockchain !== undefined ? `&blockchain=${blockchain}` : '';
                return `?asset=${asset}&symbol=${symbol}${blockchainParam}`;
            },
        }),
    })
});

export const tokenGraphApi = createApi({
    reducerPath: 'tokenGraphApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://tokenpricehistory-nubpgwxpiq-uc.a.run.app' }),
    endpoints: (builder) => ({
        getTokenGraph: builder.query<TokenAtlasGraphApiResponse, { blockchain?: string; asset: string; from: number; to?: number; }>({
            query: ({ blockchain, asset, from, to }) => {
                const toParam = to !== undefined ? `&to=${from * 1000}` : '';
                const blockchainParam = blockchain !== undefined ? `&blockchain=${blockchain}` : '';
                const assetParam = asset.split(' ')[0];
                return `?asset=${assetParam}&from=${from * 1000}${toParam}${blockchainParam}`;
            },
        }),
    })
})

/**
 * Add this to the store
 */
addMiddleware(tokenInfoApi);
addMiddleware(tokenGraphApi);

export const { useGetTokenInfoQuery } = tokenInfoApi;
export const { useGetTokenGraphQuery } = tokenGraphApi;

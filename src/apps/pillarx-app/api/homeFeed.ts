/* eslint-disable no-console */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { addMiddleware } from '../../../store';
import { ApiResponse } from '../../../types/api';

export const homeFeedApi = createApi({
    reducerPath: 'homeFeedApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://feed-nubpgwxpiq-uc.a.run.app/' }),
    endpoints: (builder) => ({
        getTilesInfo: builder.query<ApiResponse, { page: number; address: string }>({
            query: ({ page, address }) => `?page=${page}&address=${address}`,
        }),
    })
})

/**
 * Add this to the store
 */
addMiddleware(homeFeedApi);

export const { useGetTilesInfoQuery } = homeFeedApi;

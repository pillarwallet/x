/* eslint-disable no-console */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

// types
import { ApiResponse } from '../../../types/api';

export const homeFeedApi = createApi({
  reducerPath: 'homeFeedApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_USE_TESTNETS === 'true'
        ? 'https://feed-nubpgwxpiq-uc.a.run.app'
        : 'https://feed-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getTilesInfo: builder.query<ApiResponse, { page: number; address: string }>(
      {
        query: ({ page, address }) => `?page=${page}&address=${address}`,
      }
    ),
  }),
});

/**
 * Add this to the store
 */
addMiddleware(homeFeedApi);

export const { useGetTilesInfoQuery } = homeFeedApi;

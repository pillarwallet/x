/* eslint-disable no-console */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

export const emcdSwapApi = createApi({
  reducerPath: 'emcdSwapApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://b2b-endpoint.dev-b2b.mytstnv.site',
  }),
  endpoints: (builder) => ({
    getSwapCoins: builder.query<any, void>({
      query: () => 'v2/swap/coins',
    }),
    getEstimate: builder.query<any, any>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });

        return `swap/estimate?${searchParams.toString()}`;
      },
    }),
    createSwap: builder.mutation<any, any>({
      query: (formData) => ({
        url: 'swap',
        method: 'POST',
        body: formData,
      }),
    }),
    getSwapStatus: builder.query<any, { swapID: string; status: number }>({
      query: ({ swapID, status }) => `swap/${swapID}/${status}`,
    }),
    getSwap: builder.query<any, { swapID: string }>({
      query: ({ swapID }) => `swap/${swapID}`,
    }),
    createUser: builder.mutation<any, any>({
      query: (formData) => ({
        url: 'swap/user',
        method: 'POST',
        body: formData,
      }),
    }),

    createTicket: builder.mutation<any, any>({
      query: (formData) => ({
        url: 'swap/support/message',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

addMiddleware(emcdSwapApi);

export const { useGetSwapCoinsQuery, useLazyGetEstimateQuery, useCreateSwapMutation, useCreateUserMutation, useLazyGetSwapQuery, useCreateTicketMutation, useLazyGetSwapStatusQuery } = emcdSwapApi;

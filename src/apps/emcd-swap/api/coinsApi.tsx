/* eslint-disable no-console */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

// Define types for the API responses and requests
interface SwapCoin {
  title: string;
  icon_url: string;
  networks: string[];
  // Add other properties as needed
}

interface ErrorData {
  message?: string;
  [key: string]: any;
}

interface EstimateParams {
  coin_from: string;
  coin_to: string;
  amount: number;
  network_from: string;
  network_to: string;
}

interface EstimateResponse {
  amount_to: string;
  rate: string;
  // Add other properties as needed
}


export const emcdSwapApi = createApi({
  reducerPath: 'emcdSwapApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_EMCD_SWAP_API_URL || 'https://b2b-endpoint.dev-b2b.mytstnv.site',
    prepareHeaders: (headers) => {
      return headers;
     },
  }),
  endpoints: (builder) => ({
    getSwapCoins: builder.query<SwapCoin[], void>({
      query: () => 'v2/swap/coins',
      transformErrorResponse: (response: { status: number; data: ErrorData }) => {
        console.error('API Error:', response);
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'An error occurred'
        };
      },
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
      transformErrorResponse: (response: { status: number; data: ErrorData }) => {
        console.error('API Error:', response);
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'An error occurred'
        };
      },
    }),
    createSwap: builder.mutation<any, any>({
      query: (formData) => ({
        url: 'swap',
        method: 'POST',
        body: formData,
      }),
      transformErrorResponse: (response: { status: number; data: ErrorData }) => {
        console.error('API Error:', response);
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'An error occurred'
        };
      },
    }),
    getSwapStatus: builder.query<any, { swapID: string; status: number }>({
      query: ({ swapID, status }) => `swap/${swapID}/${status}`,
      transformErrorResponse: (response: { status: number; data: ErrorData }) => {
        console.error('API Error:', response);
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'An error occurred'
        };
      },
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
      transformErrorResponse: (response: { status: number; data: ErrorData }) => {
        console.error('API Error:', response);
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'An error occurred'
        };
      },
    }),

    createTicket: builder.mutation<any, any>({
      query: (formData) => ({
        url: 'swap/support/message',
        method: 'POST',
        body: formData,
      }),
      transformErrorResponse: (response: { status: number; data: ErrorData }) => {
        console.error('API Error:', response);
        return {
          status: response.status,
          data: response.data,
          message: response.data?.message || 'An error occurred'
        };
      },
    }),
  }),
});

addMiddleware(emcdSwapApi);

export const { useGetSwapCoinsQuery, useLazyGetEstimateQuery, useCreateSwapMutation, useCreateUserMutation, useLazyGetSwapQuery, useCreateTicketMutation, useLazyGetSwapStatusQuery } = emcdSwapApi;

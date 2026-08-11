import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

export interface RelayRequest {
  id: string;
  status: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  in: {
    chainId: number;
    currency: string;
    amount: string;
    amountUsd?: string;
  };
  out: {
    chainId: number;
    currency: string;
    amount: string;
    amountUsd?: string;
  };
  fees?: {
    fixed: string;
    variable: string;
  };
  metadata?: {
    currencyIn?: {
      currency?: {
        address?: string;
        symbol?: string;
        decimals?: number;
      };
      amount?: string;
      amountFormatted?: string;
      amountUsd?: string;
    };
    currencyOut?: {
      currency?: {
        address?: string;
        symbol?: string;
        decimals?: number;
      };
      amount?: string;
      amountFormatted?: string;
      amountUsd?: string;
    };
  };
  data?: {
    inTxs?: Array<{
      hash?: string;
      chainId?: number;
      timestamp?: number;
      stateChanges?: Array<{
        change?: {
          data?: {
            tokenAddress?: string;
            symbol?: string;
            decimals?: number;
          };
          balanceDiff?: string;
        };
        address?: string;
      }>;
    }>;
    outTxs?: Array<{
      hash?: string;
      chainId?: number;
      timestamp?: number;
      stateChanges?: Array<{
        change?: {
          data?: {
            tokenAddress?: string;
            symbol?: string;
            decimals?: number;
          };
          balanceDiff?: string;
        };
        address?: string;
      }>;
    }>;
    metadata?: {
      currencyIn?: {
        currency?: {
          address?: string;
          symbol?: string;
          decimals?: number;
        };
        amount?: string;
        amountFormatted?: string;
        amountUsd?: string;
      };
      currencyOut?: {
        currency?: {
          address?: string;
          symbol?: string;
          decimals?: number;
        };
        amount?: string;
        amountFormatted?: string;
        amountUsd?: string;
      };
    };
  };
}

export interface RelayRequestsResponse {
  requests: RelayRequest[];
  nextCursor?: string;
}

const RELAY_API_URL = 'https://api.relay.link';

const fetchBaseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl: RELAY_API_URL,
    timeout: 5000,
  }),
  { maxRetries: 2 }
);

export const relayApi = createApi({
  reducerPath: 'relayApi',
  baseQuery: fetchBaseQueryWithRetry,
  endpoints: (builder) => ({
    getRelayRequests: builder.query<
      RelayRequest[],
      { user: string; status?: string }
    >({
      query: ({ user, status = 'filled' }) => ({
        url: '/requests',
        params: { user, status },
      }),
      transformResponse: (response: RelayRequestsResponse) =>
        response.requests || [],
    }),
    getRelayRequestByHash: builder.query<RelayRequest | null, string>({
      query: (hash) => ({
        url: '/requests/v2',
        params: { hash },
      }),
      transformResponse: (response: { requests?: RelayRequest[] }) => {
        const requests = response?.requests || [];
        return requests.length > 0 ? requests[0] : null;
      },
    }),
    getRelayRequestsByUser: builder.query<RelayRequest[], string>({
      query: (user) => ({
        url: '/requests/v2',
        params: { user },
      }),
      transformResponse: (
        response: { requests?: RelayRequest[] } | RelayRequest[]
      ) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (
          response &&
          'requests' in response &&
          Array.isArray(response.requests)
        ) {
          return response.requests;
        }
        return [];
      },
    }),
  }),
});

export const {
  useGetRelayRequestsQuery,
  useGetRelayRequestByHashQuery,
  useGetRelayRequestsByUserQuery,
} = relayApi;

// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pillarXApiPresence = createApi({
  reducerPath: 'pillarXApiPresence',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://activity-nubpgwxpiq-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    recordPresence: builder.mutation({
      query: (payload = {}) => ({
        url: '/',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useRecordPresenceMutation } = pillarXApiPresence

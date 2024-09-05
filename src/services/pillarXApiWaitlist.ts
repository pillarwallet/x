// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const pillarXApiWaitlist = createApi({
  reducerPath: 'pillarXApiWaitlistWaitlist',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_USE_TESTNETS === 'true'
        ? 'https://waitlist-nubpgwxpiq-uc.a.run.app'
        : 'https://waitlist-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getWaitlist: builder.query({
      query: (address) => `?address=${address}`,
    }),
  }),
});

export const { useGetWaitlistQuery } = pillarXApiWaitlist;
